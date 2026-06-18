<script setup>
import {ref, onMounted, inject} from "vue";
import Error from "@/components/Modal/Error.vue";
import apiFetch from "@/helpers/apiFetch.js";
import {useRoute} from "vue-router";
import toggleTag from '@/helpers/toggleTag.js'
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import router from "@/router/index.js";
import {changeFile} from '@/helpers/fileHandler.js'
import Privacy from "@/components/Form/Privacy.vue";
import EditVideoSkeleton from '@/components/Loaders/EditVideoSkeleton.vue'

  const api = import.meta.env.VITE_APP_API
  const form = ref({
    data: {
      id: null,
      title: '',
      description: '',
      category_id: '',
      public: true,
      tags: [],
      thumbnail: null,
      thumbnailblob: null
    },
    errors: {},
    loading: true,
    isProcess: false
  })

  const route = useRoute()
  const id = inject('id')
  const video = ref();
  const tags = ref();
  const categories = ref();
  const showToast = inject('showToast')

  onMounted(async () => {
    const [videoData, tagData, categoryData] = await Promise.all([
      apiFetch('GET', `/video/${route.params.id}`),
      apiFetch('GET', '/tag'),
      apiFetch('GET', '/category')
    ])

    if (videoData.video.user.id !== id.value) {
      await router.replace('/')
    }

    video.value = videoData.video
    tags.value = tagData
    categories.value = categoryData

    form.value.data.id = videoData.video.id
    form.value.data.title = videoData.video.title
    form.value.data.description = videoData.video.description
    form.value.data.public = Boolean(videoData.video.public)
    form.value.data.category_id = videoData.video.category?.id

    form.value.data.tags = videoData.video.tags.map(tag => tag.id)

    form.value.loading = false
  })

  const formatDuration = (duration) => {
    if (!duration) {
      return '00:00'
    }

    const totalSeconds = Math.floor(duration / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const deleteVideo = async () => {
    if (form.value.isProcess) {
      return
    }

    const confirmed = confirm('Удалить видео без возможности восстановления?')

    if (!confirmed) {
      return
    }

    form.value.isProcess = true

    const result = await apiFetch('DELETE',`/video/${form.value.data.id}`)
    form.value.isProcess = false

    if (!result) {
      return
    }

    showToast('Видео успешно удалено', faCheck)
    await router.push('/')
  }

  const saveVideo = async () => {
    if (form.value.isProcess) {
      return
    }

    form.value.isProcess = true
    form.value.errors = {}

    const formData = new FormData()

    formData.append('title', form.value.data.title ?? '')
    formData.append('description',form.value.data.description ?? '')
    formData.append('category_id',form.value.data.category_id ?? '')
    formData.append('public',form.value.data.public ? 1 : 0)
    form.value.data.tags.forEach(tagId => { formData.append('tags[]', tagId) })

    if (form.value.data.thumbnail) {
      formData.append( 'thumbnail', form.value.data.thumbnail)
    }

    const result = await apiFetch('POST', `/video/${form.value.data.id}/update`, formData)
    form.value.isProcess = false
    if (result?.error?.errors) {
      form.value.errors = result.error.errors
      return
    }

    showToast('Изменения успешно сохранены', faCheck)
  }
</script>


<template>
  <EditVideoSkeleton v-if="form.loading"/>
  <div v-else class="max-w-7xl mx-auto p-6">

    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900">
          Редактирование видео
        </h1>

        <p class="mt-1 text-sm text-zinc-500">
          Измените информацию о видео и сохраните изменения
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <div class="xl:col-span-8 space-y-6">
        <div class="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
          <img :src="form.data.thumbnailblob ?? `${api}/${video.thumbnail}`" alt="" class="w-full aspect-video object-cover">

          <div class="border-t border-zinc-200 p-6">

            <div class="flex items-center justify-between">

              <div>
                <h2 class="font-semibold">
                  Превью видео
                </h2>

                <p class="text-sm text-zinc-500 mt-1">
                  Выберите новую миниатюру при необходимости
                </p>
              </div>

              <label class="cursor-pointer rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition">
                Изменить

                <input type="file" accept="image/*" class="hidden" @change="changeFile($event, 'thumbnail',form,)">
              </label>

            </div>

            <Error :errors="form.errors.thumbnail" />

          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <h2 class="text-lg font-semibold mb-5">
            Информация о видео
          </h2>

          <div class="space-y-5">

            <div>
              <label class="block text-sm font-medium mb-2">
                Название
              </label>

              <input v-model="form.data.title" type="text" maxlength="255" placeholder="Введите название видео" class="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400">

              <Error :errors="form.errors.title" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Описание
              </label>

              <textarea v-model="form.data.description" rows="8" placeholder="Расскажите зрителям о вашем видео" class="w-full resize-none rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"></textarea>

              <Error :errors="form.errors.description" />
            </div>

          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <h2 class="text-lg font-semibold mb-5">
            Информация
          </h2>

          <div class="grid sm:grid-cols-2 gap-4">

            <div class="rounded-2xl bg-zinc-50 p-4">
              <div class="text-sm text-zinc-500">
                Длительность
              </div>

              <div class="mt-1 font-medium">
                {{ formatDuration(video.duration) }}
              </div>
            </div>

            <div class="rounded-2xl bg-zinc-50 p-4">
              <div class="text-sm text-zinc-500">
                Загружено
              </div>

              <div class="mt-1 font-medium">
                {{ video.created_at }}
              </div>
            </div>

          </div>

        </div>

      </div>

      <div class="xl:col-span-4 space-y-6">

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <h2 class="text-lg font-semibold mb-5">
            Категория
          </h2>

          <select v-model="form.data.category_id" class="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400">

            <option disabled value="">
              Выберите категорию
            </option>

            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>

          </select>

          <Error :errors="form.errors.category_id" />

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="flex items-center justify-between mb-5">

            <h2 class="text-lg font-semibold">
              Теги
            </h2>

            <span class="text-xs text-zinc-500">
              {{ form.data.tags.length }}
            </span>

          </div>

          <div class="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">

            <button v-for="tag in tags" :key="tag.id" type="button" @click="toggleTag(form.data.tags, tag.id)"
                    class="px-3 py-2 rounded-full border text-sm transition cursor-pointer"
                    :class="form.data.tags.includes(tag.id)
                    ? 'bg-zinc-900 border-zinc-900 text-white'
                    : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-500'">

              #{{ tag.name }}

            </button>

          </div>
          <Error :errors="form.errors.tags" />

        </div>

        <Privacy :data="form.data"/>

        <div class="rounded-3xl border border-red-200 bg-red-50 p-6">

          <h2 class="text-lg font-semibold text-red-700 mb-2">
            Опасная зона
          </h2>

          <p class="text-sm text-red-600 mb-5">
            После удаления видео восстановить его будет невозможно.
          </p>

          <button @click="deleteVideo"
                  class="w-full h-12 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer">
            Удалить видео
          </button>

        </div>

        <button :disabled="form.isProcess"
                @click="saveVideo"
                class="w-full h-12 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 transition cursor-pointer">

          Сохранить изменения

        </button>

      </div>

    </div>

  </div>
</template>


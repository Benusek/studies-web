<script setup>

import FileUpload from "@/components/Modal/FileUpload.vue";
import {inject, onMounted, ref} from "vue";
import Error from "@/components/Modal/Error.vue";
import apiFetch from "@/helpers/apiFetch.js";
import Resumable from "resumablejs";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import toggleArray from "@/helpers/toggleTag.js";
import {changeFile, removeFile} from '@/helpers/fileHandler.js'
import Privacy from "@/components/Form/Privacy.vue";

const tags = ref([])
const token = inject('token')
const showToast = inject('showToast')
const api = import.meta.env.VITE_APP_API
const categories = ref([])
const form = ref({
  data: {
    tags: [],
  },
  errors: {},
  isProcess: false
});
const fileKeys = ref({
  video: 0,
  thumbnail: 0
})


onMounted(async () => {
  const tag = await apiFetch('GET', '/tag')
  const category = await apiFetch('GET', '/category')
  if (tag) {
    tags.value = tag
  }

  if (category) {
    categories.value = category
  }
})

const post = async () => {
  if (form.value.isProcess) return
  form.value.isProcess = true
  form.value.errors = {}

  if (!form.value.data.video) {
    form.value.errors.video = [
      'Выберите видеофайл'
    ]
    form.value.isProcess = false
    return
  }

  const formData = new FormData()
  for (const key in form.value.data) {
    if (form.value.data[key]) {
      formData.append(key, form.value.data[key])
    }
    form.value.data.tags.forEach(tagId => {
      formData.append('tags[]', tagId)
    })
  }
  formData.delete('video')
  if (formData.get('public')) {
    formData.append('public', 1)
  } else formData.append('public', 0)
  const result = await apiFetch('POST', '/meta', formData)
  console.log(formData.get('category_id'))

  if (result.errors) {
    form.value.errors = result['errors']
    return
  }

  const meta = result.data['upload_token']
  const r = new Resumable({
    headers: {'Authorization': `Bearer ${token.value}`, 'Accept': 'application/json'},
    target: `${api}/api/video`,
    chunkSize: 10 * 1024 * 1024,
    testChunks: false,
    maxChunkRetries: 0,
    query: {'upload_token': meta}
  })
  console.log('UPLOAD START')
  r.addFile(form.value.data['video'])
  r.on('fileAdded', function (file, event) {
    console.log('FILE ADDED')
    r.upload()
  })
  r.on('fileProgress', file => {
    form.value.progress = Math.floor(file.progress(true) * 100)

    form.value.uploaded =
        Math.floor(file.size * file.progress(true) / 1024 / 1024)

    form.value.total = file.size / 1024 / 1024
  })
  r.on('fileError', function (file, err) {
    try {
      const response = JSON.parse(err)

      form.value.errors = response.errors || {
        common: [response.message || 'Ошибка загрузки']
      }
    } catch {
      form.value.errors = {
        common: ['Внутренняя ошибка сервера']
      }
    }

    console.error(err)
  })
  r.on('chunkingError', function (file, message) {
    console.error('Chunk error:', message)
  })
  r.on('fileSuccess', function (file, message) {
    message.message ? showToast(message.message, faCheck) : null
  })
  form.value.isProcess = false
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900">
          Загрузка видео
        </h1>
        <p class="text-sm text-zinc-500 mt-1">
          Заполните информацию и опубликуйте видео
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div class="xl:col-span-8 space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <FileUpload :key="`video-${fileKeys.video}`" :errors="form.errors.video" :file="form.data" label="Видео" type="video" @change="changeFile" @remove="removeFile" />
          <FileUpload :key="`thumbnail-${fileKeys.thumbnail}`" :errors="form.errors.thumbnail" :file="form.data" label="Превью" type="thumbnail" @change="changeFile" @remove="removeFile"/>
        </div>
        <div class="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 class="text-lg font-semibold mb-5">
            Информация о видео
          </h2>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-2">Название</label>
              <input v-model="form.data.title" class="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none
                     focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" maxlength="255"
                     placeholder="Введите название видео" type="text" />
              <Error :errors="form.errors.title"/>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Описание
              </label>
              <textarea v-model="form.data.description" class="w-full rounded-2xl border border-zinc-200 px-4 py-3 resize-none outline-none
                         focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Расскажите зрителям о вашем видео" rows="8"/>
              <Error :errors="form.errors.description"/>
            </div>

            <div v-if="form.progress !== null && form.progress !== 100" class="rounded-3xl border border-zinc-200 bg-white p-6">
              <div class="flex justify-between text-sm mb-3">
                <span class="font-medium">
                  Загрузка видео
                </span>
                <span v-if="form.progress">
                  {{ form.progress }}%
                </span>
                <span class="text-zinc-500">
                  {{ form.uploaded }} MB / {{ form.total }} MB
                </span>
              </div>

              <div class="h-3 bg-zinc-200 rounded-full overflow-hidden">
                <div :style="{ width: `${form.progress}%` }" class="h-full bg-gradient-to-r
                from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-300"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-4 space-y-6">
        <div class="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 class="text-lg font-semibold mb-5">Категория</h2>
          <select v-model="form.data.category_id" class="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none
                     focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option disabled value="">Выберите категорию</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <Error :errors="form.errors.category_id"/>
        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-semibold">Теги</h2>
            <span class="text-xs text-zinc-500">{{ form.data.tags?.length || 0 }}</span>
          </div>

          <div class="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
            <button v-for="tag in tags" :key="tag.id" :class=" form.data.tags?.includes(tag.id)
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-zinc-300 text-zinc-700 hover:border-indigo-500'"
                class="px-3 py-2 rounded-full border text-sm transition cursor-pointer"
                type="button"
                @click="toggleArray(tag.id)">
              #{{ tag.name }}
            </button>
          </div>
          <Error :errors="form.errors.tags"/>
        </div>

        <Privacy :data="form.data"/>

        <button :disabled="form.isProcess" class="w-full h-12 rounded-2xl bg-zinc-900 text-white font-medium
                   hover:bg-zinc-800 disabled:opacity-50 transition cursor-pointer" @click="post">
          <span>
            Опубликовать видео
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
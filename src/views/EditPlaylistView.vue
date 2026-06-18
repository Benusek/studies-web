<script setup>

import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import apiFetch from '@/helpers/apiFetch.js'

import Error from '@/components/Modal/Error.vue'
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Privacy from "@/components/Form/Privacy.vue";
import EditPlaylistSkeleton from "@/components/Loaders/EditPlaylistSkeleton.vue";


const route = useRoute()
const router = useRouter()
const api = import.meta.env.VITE_APP_API
const id = inject('id')

const showToast = inject('showToast')

const form = ref({
  data: {
    id: null,
    title: '',
    public: true,
  },

  errors: {},
  loading: true,
  isProcess: false
})


const playlist = ref({})
const videos = ref([])


onMounted(async () => {

  const result = await apiFetch('GET', `/playlist/${route.params.id}`)
  if (!result?.playlist) {
    return
  }

  playlist.value = result.playlist

  if (playlist.value.user.id !== id.value) {
    await router.replace('/')
  }

  videos.value = result.videos ?? []

  form.value.data.id = result.playlist.id
  form.value.data.title = result.playlist.title
  form.value.data.public = Boolean(result.playlist.public)
  form.value.loading = false
})


const savePlaylist = async () => {

  if (form.value.isProcess) {
    return
  }


  form.value.errors = {}
  form.value.isProcess = true


  const result = await apiFetch('PATCH', `/playlist/${form.value.data.id}`,
{
        title: form.value.data.title,
        public: form.value.data.public ? 1 : 0
      }
  )

  form.value.isProcess = false

  if (result?.errors) {
    form.value.errors = result.errors
    return
  }

  showToast('Плейлист обновлен', faCheck)
}


const deletePlaylist = async () => {

  if (!confirm('Удалить плейлист без возможности восстановления?')) {
    return
  }

  const result = await apiFetch('DELETE', `/playlist/${form.value.data.id}`)

  if (!result) {
    return
  }

  showToast('Плейлист удален', faCheck)
  await router.push('/playlists')
}

const removeVideo = async (video) => {

  if (!confirm(`Удалить "${video.title}" из плейлиста?`)) {
    return
  }

  const result = await apiFetch(
      'DELETE',
      `/playlist/${playlist.value.id}/video/${video.id}`
  )

  if (!result) {
    return
  }

  videos.value = videos.value.filter(
      item => item.id !== video.id
  )

  showToast('Видео удалено из плейлиста', faCheck)
}
</script>


<template>
  <EditPlaylistSkeleton v-if="form.loading"/>
  <div v-else class="max-w-7xl mx-auto p-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900">
          Редактирование плейлиста
        </h1>
        <p class="mt-1 text-sm text-zinc-500">
          Измените настройки плейлиста
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div class="xl:col-span-8 space-y-6">
        <div class="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 class="text-lg font-semibold mb-5">
            Информация
          </h2>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-2">
                Название
              </label>
              <input
                  v-model="form.data.title"
                  maxlength="255"
                  class="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                  placeholder="Введите название"
              />
              <Error :errors="form.errors.title"/>
            </div>
          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 class="text-lg font-semibold mb-5">
            Видео
          </h2>
          <div v-if="videos.length" class="space-y-3">

            <div
                v-for="video in videos"
                :key="video.id"
                class="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 p-3 border border-zinc-200"
            >

              <div class="flex items-center gap-4 min-w-0 flex-1">

                <img
                    :src="`${api}/${video.thumbnail}`"
                    class="size-20 rounded-xl object-cover shrink-0"
                >

                <div class="min-w-0 flex-1">

                  <div class="font-medium truncate">
                    {{ video.title }}
                  </div>

                  <div class="text-sm text-zinc-500 mt-1">
                    {{ video.created_at }}
                  </div>

                </div>

              </div>

              <button
                  @click="removeVideo(video)"
                  class="flex size-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <FontAwesomeIcon :icon="faTrash" />
              </button>

            </div>

          </div>
          <div v-else class="text-sm text-zinc-400">
            В плейлисте нет видео
          </div>
        </div>
      </div>

      <div class="xl:col-span-4 space-y-6">
        <Privacy :data="form.data"/>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">


          <h2 class="text-lg font-semibold">
            Автор
          </h2>


          <div class="mt-4 flex items-center gap-3">

            <img
                :src="playlist.user.avatar
              ? `${api}/${playlist.user.avatar}`
              : '/src/assets/default.png'"
                class="size-12 rounded-full object-cover"
            >


            <div>

              <div class="font-medium">
                {{ playlist.user.name }}
              </div>


              <div class="text-sm text-zinc-500">
                {{ playlist.created_at }}
              </div>

            </div>


          </div>


        </div>




        <div class="rounded-3xl border border-red-200 bg-red-50 p-6">


          <h2 class="text-lg font-semibold text-red-700 mb-2">
            Опасная зона
          </h2>


          <p class="text-sm text-red-600 mb-5">
            Удаление плейлиста невозможно отменить.
          </p>



          <button
              @click="deletePlaylist"
              class="w-full h-12 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer"
          >
            Удалить плейлист
          </button>


        </div>



        <button
            :disabled="form.isProcess"
            @click="savePlaylist"
            class="w-full h-12 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
        >
          Сохранить изменения
        </button>



      </div>



    </div>



  </div>
</template>
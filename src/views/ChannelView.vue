<script setup>
import {inject, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import apiFetch from '@/helpers/apiFetch.js'
import NotFound from '@/components/Loaders/NotFound.vue'
import VideoPreview from "@/components/Previews/Video.vue";
import PlaylistPreview from "@/components/Previews/Playlist.vue";

const route = useRoute()
const api = import.meta.env.VITE_API_KEY
const data = ref({})
const isEmpty = ref(false)
const page = ref(1)
const text = ref('')
const id = inject('id')
const isResponse = ref(false)
onMounted(async () => {
  if (isResponse.value) return
  isResponse.value = false
  const result = await apiFetch('GET', `/user/${route.params.id}/videos`)
  if (result) data.value = result

  if (!result.videos.length) {
    isEmpty.value = true
    text.value = 'Список видео пуст'
  }
  isResponse.value = true
})

const switchPage = async (value) => {
  data.value.videos = []
  data.value.playlists = []
  switch (value) {
    case 1:
      const videos = await apiFetch('GET', `/user/${route.params.id}/videos`)
      if (videos.videos) {
        isEmpty.value = false
        data.value.videos = videos.videos
      }
      if (!videos.videos.length || videos.data) {
        isEmpty.value = true
        text.value = 'Список видео пуст'
      }
      page.value = 1
      break
    case 2:
      const playlist = await apiFetch('GET', `/user/${route.params.id}/playlist`)
      if (playlist.playlists) {
        isEmpty.value = false
        data.value.playlists = playlist.playlists
      }
      if (!playlist.playlists?.length || playlist.data) {
        isEmpty.value = true
        text.value = 'Список плейлистов пуст'
      }
      page.value = 2
      break
  }
}

const FollowingUser = async () => {
  if (data.value.user.subscribed) {
    const unfollow = await apiFetch('DELETE', `/user/${data.value.user.id}/unfollow`)
    if (unfollow) {
      data.value.user.subscribed = false
    }
  } else {
    const follow = await apiFetch('GET', `/user/${data.value.user.id}/follow`)
    if (follow) {
      data.value.user.subscribed = true
    }
  }
}

</script>

<template>
  <div class="flex flex-col w-full p-3 gap-3">
    <div class="flex flex-col sm:flex-row justify-between items-center" v-if="data.user">
      <div class="flex flex-row gap-2">
        <img class="rounded-full size-20 aspect-square"
             :src="data.user.avatar ? `${api}/${data.user.avatar}` : '/src/assets/default.png' "
             alt="user">
        <div class="flex flex-col">
          <span class="text-2xl font-medium">{{ data.user.name }}</span>
          <span class="text-xs text-gray-500">{{ data.user.subscribers.count ? data.user.subscribers.count :'Нет' }} подписчиков</span>
        </div>
      </div>

      <template v-if="parseInt(id) !== data.user.id && id">
        <div v-if="!data.user.subscribed" @click="FollowingUser"
             class="px-2 py-1 text-xs text-white bg-blue-500 rounded-sm cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none">
          Подписаться
        </div>
        <div v-else-if="data.user.subscribed" @click="FollowingUser"
             class="py-1 px-2 text-xs text-red-400 border border-red-400 rounded-sm font-medium cursor-pointer hover:bg-gray-100 active:bg-gray-200/60 select-none">
          Отписаться
        </div>
      </template>

    </div>
<!--    TODO: Вынести в компонент -->
      <div class="col-span-full flex flex-row gap-2 select-none">
        <div v-for="index in 2"
             class="rounded-lg p-1.25 text-xs font-medium cursor-pointer"
             :class="page !== index ? 'ring-gray-400 text-gray-600 active:bg-gray-300 hover:bg-gray-200' : 'text-white bg-blue-400 active:bg-blue-400 hover:bg-blue-300'"
             @click="switchPage(index)">{{ index === 1 ? 'Видео' : 'Плейлисты' }}
        </div>
      </div>
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 h-auto p-2">
        <NotFound :text="text" :isEmpty="isEmpty" />
        <PlaylistPreview :playlists="data.playlists" />
        <VideoPreview :videos="data.videos" :isResponse="isResponse" />
      </div>
    </div>
  </div>
</template>
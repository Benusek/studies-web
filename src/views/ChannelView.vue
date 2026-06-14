<script setup>
import {inject, onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import apiFetch from '@/helpers/apiFetch.js'
import NotFound from '@/components/Loaders/NotFound.vue'
import VideoPreview from "@/components/Cards/VideoCard.vue";
import PlaylistPreview from "@/components/Cards/PlaylistCard.vue";
const route = useRoute()
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
  console.log(result)

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
  <div class="mx-auto w-full max-w-[1800px] p-3 lg:p-6">
    <section v-if="data.user" class="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-4">
          <img class="size-20 md:size-24 rounded-full object-cover ring-2 ring-zinc-100"
               :src="data.user.avatar ? `http://localhost:8000/${data.user.avatar}` : '/src/assets/default.png'"
              alt="user">

          <div class="min-w-0">
            <h1 class="text-2xl md:text-3xl font-bold text-zinc-900 break-words">
              {{ data.user.name }}
            </h1>
            <div class="mt-1 text-sm text-zinc-500">
              {{ data.user.subscribers.count ? data.user.subscribers.count : 'Нет'}} подписчиков
            </div>
          </div>

        </div>

        <template v-if="id !== data.user.id && id">

          <button
              v-if="!data.user.subscribed"
              @click="FollowingUser"
              class="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Подписаться
          </button>

          <button
              v-else
              @click="FollowingUser"
              class="h-11 rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Отписаться
          </button>

        </template>

      </div>
    </section>

    <!-- Навигация -->
    <section class="mt-6">

      <div
          class="inline-flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm"
      >

        <button
            v-for="index in 2"
            :key="index"
            @click="switchPage(index)"
            class="h-10 rounded-xl px-5 text-sm font-medium transition"
            :class="
            page === index
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          "
        >
          {{ index === 1 ? 'Видео' : 'Плейлисты' }}
        </button>

      </div>

    </section>

    <!-- Контент -->
    <section class="mt-6">

      <div
          class="rounded-3xl border border-zinc-200 bg-white p-4 lg:p-5"
      >

        <NotFound
            :text="text"
            :isEmpty="isEmpty"
        />

        <div
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
        >

          <PlaylistPreview
              :playlists="data.playlists"
          />

          <VideoPreview
              :videos="data.videos"
              :variant="false"
              :isResponse="isResponse"
          />

        </div>

      </div>

    </section>

  </div>
</template>
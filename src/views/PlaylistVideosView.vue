<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import apiFetch from '@/helpers/apiFetch.js'

import VideoPreview from '@/components/Cards/VideoCard.vue'
import NotFound from '@/components/Loaders/NotFound.vue'
import PlaylistVideosSkeleton from "@/components/Loaders/PlaylistVideosSkeleton.vue";

const route = useRoute()
const api = import.meta.env.VITE_APP_API

const data = ref({})
const isResponse = ref(false)
const isEmpty = ref(false)

onMounted(async () => {
  const result = await apiFetch(
      'GET',
      `/playlist/${route.params.id}`
  )

  if (result) {
    console.log(result)
    data.value = result
  }

  if (!result?.playlist) {
    isEmpty.value = true
  }

  isResponse.value = true
})
</script>

<template>

<PlaylistVideosSkeleton v-if="!isResponse"/>
<div v-else class="mx-auto w-full max-w-[1800px] p-3 lg:p-6">
  <NotFound text="Плейлист не найден" :isEmpty="isEmpty"/>
  <template v-if="data.playlist">
    <section class="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col xl:flex-row gap-6">
        <div class="w-full xl:max-w-lg shrink-0">
          <div class="relative aspect-video overflow-visible">
            <div class="absolute inset-0 translate-y-3 scale-[0.92] rounded-2xl bg-violet-300/70"/>
            <div class="absolute inset-0 translate-y-1.5 scale-[0.96] rounded-2xl bg-sky-300/70"/>
            <div class="relative h-full overflow-hidden rounded-2xl bg-zinc-900">
              <div class="absolute inset-0 bg-cover bg-center"
                  :style="{ backgroundImage: data.videos?.[data.videos.length - 1].thumbnail
                      ? `url(${api}/${data.videos[data.videos.length - 1].thumbnail})`
                      : 'url(/src/assets/playlist-placeholder.jpg)'
                }"
              />
              <div class="absolute inset-0 bg-black/35"/>
              <div class="absolute bottom-4 right-4 rounded-xl bg-black/75 px-3 py-2 text-sm text-white backdrop-blur-sm">
                {{ data.videos?.length || 0 }} видео
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <h1 class="text-2xl md:text-3xl font-bold text-zinc-900">
            {{ data.playlist.title }}
          </h1>
          <div class="mt-4 flex items-center gap-3">
            <img class="size-12 rounded-full object-cover"
                 :src=" data.playlist.user.avatar ? `${api}/${data.playlist.user.avatar}` : '/src/assets/default.png'">
            <div>
              <div class="font-medium">
                {{ data.playlist.user.name }}
              </div>
              <div class="text-sm text-zinc-500">
                {{ data.playlist.created_at }}
              </div>
            </div>
          </div>
          <div v-if="data.playlist.description"
              class="mt-6 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
            {{ data.playlist.description }}
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-zinc-200 bg-white p-4">
        <div class="text-xs text-zinc-500">
          Видео
        </div>
        <div class="mt-1 text-xl font-semibold">
          {{ data.videos?.length || 0 }}
        </div>
      </div>
      <div class="rounded-2xl border border-zinc-200 bg-white p-4">
        <div class="text-xs text-zinc-500">
          Доступ
        </div>
        <div class="mt-1 text-xl font-semibold">
          {{ data.playlist.public ? 'Открытый' : 'Закрытый' }}
        </div>
      </div>
    </section>

    <section class="mt-6 rounded-3xl border border-zinc-200 bg-white p-4 lg:p-5">
      <div class="mb-5">
        <h2 class="text-xl font-semibold">
          Видео плейлиста
        </h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        <VideoPreview :videos="data.videos" :variant="false" :isResponse="isResponse"/>
      </div>
    </section>

  </template>
</div>
</template>
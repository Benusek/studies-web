<script setup>
import {useRoute} from "vue-router";

const route = useRoute()
const api = import.meta.env.VITE_APP_API
defineProps({
  playlists: Object
})
</script>

<template>
  <div
      class="min-w-25 cursor-pointer"
      v-for="playlist in playlists"
      @mouseenter="playlist.isHover = true" @mouseleave="playlist.isHover = false">
    <RouterLink :to="`/playlist/${playlist.id}`">
      <div class="relative w-full aspect-video group overflow-visible">
        <div class="absolute inset-0 translate-y-3 scale-[0.92] rounded-2xl bg-violet-300/70"/>
        <div class="absolute inset-0 translate-y-1.5 scale-[0.96] rounded-2xl bg-sky-300/70" />
        <div class="relative h-full overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
          <div class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              :style="{ backgroundImage: playlist.videos?.[playlist.videos.length - 1].thumbnail ? `url('${api}/${playlist.videos?.[playlist.videos.length - 1].thumbnail}')`
              : 'url(/src/assets/playlist-placeholder.jpg)'}"/>
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/55
          transition-all duration-300 flex items-center justify-center">
            <span class="opacity-0 group-hover:opacity-100 text-white font-medium transition-all duration-300">
              Перейти к плейлисту
            </span>
          </div>
          <div class="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-lg
          bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
              <span>{{ playlist.videos?.length || 0 }} видео</span>
          </div>
        </div>
      </div>
      </RouterLink>
    <div class="gap-3 relative flex pt-5">
      <RouterLink v-if="!route.name.includes('channel')" :to="'/channel/' + playlist.user.id"
                  class="shrink-0 hidden sm:block">
        <img class="rounded-full w-10 h-10 object-cover"
             :src="playlist.user.avatar ? `${api}/${playlist.user.avatar}` : '/src/assets/default.png'" alt="user">
      </RouterLink>
      <div class="flex-1 min-w-0">
        <RouterLink :to="'/playlist/' + playlist.id" class="font-semibold text-sm md:text-base line-clamp-2 leading-5">
          {{ playlist.title }}
        </RouterLink>
        <RouterLink :to="'/channel/' + playlist.user.id" class="block text-sm text-gray-600 mt-1">
          {{ playlist.user.name }}
        </RouterLink>
        <div class="text-xs text-gray-500 mt-2"> {{ playlist.created_at }}</div>
      </div>
    </div>
  </div>
</template>
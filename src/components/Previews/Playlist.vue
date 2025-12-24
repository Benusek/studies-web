<script setup>

import { faEllipsisVertical, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject } from 'vue'
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
console.log(route.name)
const api = import.meta.env.VITE_APP_API
const token = inject('token')
defineProps({
  playlists: Object
})
</script>

<template>
  <div
    class="min-w-25 cursor-pointer"
    v-for="playlist in playlists"
    @mouseenter="playlist.isHover = true" @mouseleave="playlist.isHover = false">
    <div class="relative flex justify-center items-center">
      <div class="absolute rounded-t-lg w-full bg-purple-400 bg-no-repeat scale-x-80 ring ring-white aspect-16/9" />
      <div class="absolute rounded-t-lg w-full translate-y-1 bg-blue-400 scale-x-90 ring ring-white aspect-16/9" />
      <div class="translate-y-2 rounded-lg w-full aspect-16/9 bg-black bg-contain w-full bg-no-repeat border-t border-white bg-center"
        :class="{'brightness-60': playlist.isHover}"
        :style="{'background-image': `url('${ playlist.videos ? `${api}/${playlist.videos[0]['thumbnail']}` : null }')`}">
        <div
          class="absolute flex justify-center items-center gap-1 bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium text-xs bg-black/50 mb-1.5 select-none">
          <FontAwesomeIcon :icon="faList" />
          <span>{{ playlist.videos?.length ? playlist.videos.length : 'Нет' }} видео</span>
        </div>
      </div>
      <span class="absolute text-white z-2 font-medium text-xs select-none"
            v-if="playlist.isHover">Перейти к плейлисту</span>
    </div>

    <main class="pt-3 grid grid-cols-9 gap-1 relative">
      <RouterLink class="hidden sm:block" :to="`/channel/${playlist.user.id}`" v-if="!route.name.includes('channel')">
        <img class="rounded-full w-8 aspect-square"
             :src="playlist.user.avatar ? `${api}/${playlist.user['avatar']}` : '/src/assets/default.png' "
             alt="user">
      </RouterLink>
      <div class="col-span-7">
        <RouterLink :to="`/playlist/${playlist.id}`" class="text-xs sm:text-sm font-semibold leading-snug break-words line-clamp-2">
          {{ playlist.title }}
        </RouterLink>
        <RouterLink :to="`/channel/${playlist.user.id}`" class="text-xs line-clamp-1 mt-1 text-gray-600 w-fit">
          {{ playlist.user.name }}
        </RouterLink>
        <RouterLink :to="`/playlist/${playlist.id}`" class="text-xs line-clamp-1 text-gray-600">
          {{ playlist.created_at }}
        </RouterLink>
      </div>
      <div class="flex justify-end" v-if="token" @click="playlist.isClicked = false">
        <FontAwesomeIcon class="block mr-2 mt-1 text-sm" :icon="faEllipsisVertical" />
      </div>
    </main>
  </div>
</template>
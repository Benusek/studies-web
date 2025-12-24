<script setup>
import { faEllipsisVertical, faList, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Video from '@/components/Loaders/Video.vue'
import { inject, watch } from 'vue'
import Hls from 'hls.js'
import {useRoute} from "vue-router";

const api = import.meta.env.VITE_APP_API
const props = defineProps({
  isResponse: Boolean,
  videos: Array
})

const route = useRoute();
const token = inject('token')

const changeMenu = (video) => {
  if (video.isMenu) {
    video.isMenu = false
  } else {
    props.videos.forEach((video) => {
      video.isMenu = false
    })
    video.isMenu = true
  }
}

const getVideoPlaylists = inject('getVideoPlaylistModal')
const toggleMutedVideo = (video, el) => {
  switch (video.isMuted && el.muted) {
    case true:
      video.isMuted = false
      el.muted = false
      break
    default:
      video.isMuted = true
      el.muted = true
      break
  }
}

const setDurationVideo = (video, offset = null) => {
  const duration = video.duration / 1000
  let seconds = Math.max(0, Math.floor(offset ? duration - offset : duration))
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  if (seconds > 59) seconds = Math.floor(seconds % 60)
  if (minutes > 59) minutes = Math.floor(minutes % 60)

  const pad = (v) => String(v).padStart(2, '0')
  video.time = (hours > 0 ? `${pad(hours)}:` : '') + pad(minutes) + ':' + pad(seconds)
}


watch(() => props.videos, videos => {
  if (videos && videos.length) videos.forEach(video => setDurationVideo(video))
}, { immediate: true })

const playVideo = (video, el) => {
  if (Hls.isSupported()) {
    const hls = new Hls({ autoStartLoad: true })
    hls.loadSource(`${api}/${video.video}`)
    hls.attachMedia(el)

    el.addEventListener('loadedmetadata', () => {
      el.play()
      video.isMuted = true
      video.isHover = true
    })
  } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
    el.src = ''
    el.addEventListener('loadedmetadata', () => {
      el.play()
    })
  }
}


const timeupdateVideo = (video, el) => {
  setDurationVideo(video, el.currentTime)
  video.progress = (el.currentTime / (video.duration / 1000)) * 100
  if (el.ended) {
    video.isHover = false
    setDurationVideo(video)
  }
}

const mouseleaveVideo = (video, el) => {
  const playing = el.readyState > el.HAVE_CURRENT_DATA
  if (!playing) return
  el.pause()
  el.src = null
  video.isHover = false
  el.muted = true
  setDurationVideo(video)
  
  //TODO: Не сбрасываются видео не успевает запустится и фукнция не обрабатывается

}

const changeRange = (event, video, el) => {
  video.progress = event.target.value
  el.currentTime = ((event.target.value / 100) * video.duration) / 1000
  el.play()
}
</script>

<template>
  <Video v-if="!isResponse" />
  <div v-else v-for="(video, index) in videos"
       class="rounded-xl p-1.5 ring-1 ring-gray-200 bg-gray-100/20 min-w-25 cursor-pointer">
    <div v-show="!video.isHover"
         class="relative w-full aspect-[16/9] inset-0 bg-center bg-contain bg-no-repeat bg-black w-full rounded-lg"
         :style="`background-image: url(${api}/${video['thumbnail']})`"
         @mouseenter="playVideo(video, $refs.video[index])">
      <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
        {{ video.time }}</p>
    </div>

    <div class="relative" v-show="video.isHover" @mouseleave="mouseleaveVideo(video, $refs.video[index])">
      <video disablePictureInPicture muted ref="video" class="w-full aspect-[16/9] bg-black rounded-t-lg"
             @timeupdate="timeupdateVideo(video, $refs.video[index])">
        <source />
      </video>

      <input type="range" @input="changeRange($event, video, $refs.video[index])"
             class="[&::-webkit-slider-thumb]:hidden hover:[&::-webkit-slider-thumb]:block
                 h-1 z-1 accent-red-500 outline-none [&::-webkit-slider-thumb]:shadow-orange-400
                 shadow-orange-400 bg-black/20 appearance-none rounded-none  cursor-pointer absolute bottom-0 w-full"
             v-model="video.progress">
      <template v-if="video.isMuted">
        <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.video[index]);"
                         class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                         :icon="faVolumeXmark" />
      </template>
      <template v-else>
        <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.video[index]);"
                         class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                         :icon="faVolumeHigh" />
      </template>
      <div class="h-1 absolute bg-red-500 bottom-0 z-0" :class="`w-${video.progress ? video.progress : 0}`"
           :style="`width: ${video.progress}%;`"></div>
      <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
        {{ video.time }}</p>
    </div>
    <div class="pt-1 grid grid-cols-9 gap-1 relative">
      <RouterLink class="hidden sm:block" :to="'/channel/' + video.user.id" v-if="!route.name.includes('channel')">
        <img class="mt-1 w-8 aspect-square"
             :src="video.user.avatar ? `${api}/${video.user.avatar}` : '/src/assets/default.png' "
             alt="user">
      </RouterLink>
      <div class="col-span-7">
        <RouterLink :to="'/watch/' + video.id"
                    class="text-xs sm:text-sm md:text-base font-semibold leading-snug break-words line-clamp-2">
          {{ video.title }}
        </RouterLink>
        <RouterLink :to="'/channel/' + video.user.id" class="text-xs line-clamp-1 mt-1 text-gray-600">
          {{ video.user.name }}
        </RouterLink>
        <RouterLink :to="'/watch/' + video.id" class="text-xs line-clamp-1 text-gray-600">
          {{ video.created_at }}
        </RouterLink>
      </div>
      <div class="flex justify-end" v-if="token" @click="changeMenu(video)">
        <FontAwesomeIcon class="block mr-2 mt-1 text-sm" :icon="faEllipsisVertical" />
      </div>
      <div v-if="video.isMenu" class="absolute bottom-15 right-[-5px] border border-gray-300 p-2 bg-white rounded-sm text-sm flex gap-2
      items-center font-medium hover:bg-gray-100 active:bg-gray-200 z-1"
           @click="getVideoPlaylists(video)">
        <FontAwesomeIcon :icon="faList" />
        <span>Добавить в плейлист</span>
      </div>
    </div>
  </div>
</template>
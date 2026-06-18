<script setup> import {faList, faVolumeHigh, faVolumeXmark, faPen} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {inject, ref, watch} from 'vue'
import Hls from 'hls.js'
import {useRoute} from "vue-router";

const activeVideo = ref(null)
const activeHls = ref(null)
const api = import.meta.env.VITE_APP_API
const id = inject('id')
const props = defineProps({isResponse: Boolean, videos: Array, variant: {
    type: Boolean,
    default: true
  }})
const route = useRoute();
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
//TODO: Some repeating form EditVideoView.vue
const setDurationVideo = (video, offset = null) => {
  const duration = video.duration / 1000
  let seconds = Math.max(0, Math.floor(offset ? duration - offset : duration))
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  if (seconds > 59) seconds = Math.floor(seconds % 60)
  if (minutes > 59) minutes = Math.floor(minutes % 60)
  const pad = (v) => String(v).padStart(2, '0')
  video.time = (hours > 0 ? `${pad(hours)}` : '') + pad(minutes) + ':' + pad(seconds)
}
watch(() => props.videos, videos => {
  if (videos && videos.length) videos.forEach(video => setDurationVideo(video))
}, {immediate: true})
const playVideo = (video, el) => {
  if (activeVideo.value && activeVideo.value !== el) {
    stopCurrentVideo()
  }
  if (Hls.isSupported()) {
    const hls = new Hls({autoStartLoad: true})
    activeVideo.value = el
    activeHls.value = hls
    hls.loadSource(`${api}/${video.video}`)
    hls.attachMedia(el)
    hls.on(Hls.Events.MANIFEST_PARSED, async () => {
      try {
        await el.play()
        video.isMuted = true
        video.isHover = true
      } catch (e) {
        console.debug('Playback cancelled')
      }
    })
  }
}
const timeupdateVideo = (video, el) => {
  setDurationVideo(video, el.currentTime)
  video.progress = (el.currentTime /(video.duration / 1000)) * 100
    if (el.ended) {
      video.isHover = false
      setDurationVideo(video)
    }
  }
  const mouseleaveVideo = (video, el) => {
    if (activeVideo.value === el) {
      stopCurrentVideo()
    }
  }
  const changeRange = (event, video, el) => {
    video.progress = event.target.value
    el.currentTime = ((event.target.value / 100) * video.duration) / 1000
    el.play()
  }
  const stopCurrentVideo = () => {
    if (activeVideo.value) {
      activeVideo.value.pause()
      activeVideo.value.removeAttribute('src')
      activeVideo.value.load()
    }
    if (activeHls.value) {
      activeHls.value.destroy()
    }
    activeVideo.value = null
    activeHls.value = null
    props.videos.forEach(video => {
      video.isHover = false
      video.progress = 0
      setDurationVideo(video)
    })
  }
</script>
<template>
  <div v-for="(video, index) in videos"
       class="group p-2 overflow-hidden rounded-2xl cursor-point"
       :class="{'flex gap-4 items-start': variant}">
    <div class="relative" :class="{' w-42 shrink-0': variant,'w-full': !variant}">
      <RouterLink :to="`/video/${video.id}/edit`" v-if="id && id === video.user.id">
        <FontAwesomeIcon
            class="absolute rounded-full top-0 left-10 m-2 w-4 h-1 text-white p-2 font-medium bg-black/50"
            :icon="faPen"/>
      </RouterLink>
      <FontAwesomeIcon v-if="id" @click="getVideoPlaylists(video)"
                       class="absolute rounded-full top-0 m-2 w-4 left-0 h-1 text-white p-2 font-medium bg-black/50"
                       :icon="faList"/>
      <div v-show="!video.isHover"
          class="aspect-[16/9] bg-center bg-contain bg-no-repeat bg-black rounded-lg"
          :style="`background-image: url(${api}/${video.thumbnail})`"
          @mouseenter="playVideo(video, $refs.video[index])">
        <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
          {{ video.time }}</p>
      </div>
      <div v-show="video.isHover" @mouseleave="mouseleaveVideo(video, $refs.video[index])">
        <video ref="video" disablePictureInPicture muted class="w-full aspect-[16/9] bg-black rounded-t-lg" @timeupdate="timeupdateVideo(video, $event.target)"/>
        <input type="range" @input="changeRange($event, video, $refs.video[index])"
               class="[&::-webkit-slider-thumb]:hidden hover:[&::-webkit-slider-thumb]:block h-1 z-1 accent-red-500 outline-none
               [&::-webkit-slider-thumb]:shadow-orange-400 shadow-orange-400 bg-black/20 appearance-none rounded-none cursor-pointer absolute bottom-0 w-full"
               v-model="video.progress">
        <template v-if="video.isMuted">
          <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.video[index]);"
                           class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                           :icon="faVolumeXmark"/>
        </template>
        <template v-else>
          <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.video[index]);"
                           class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                           :icon="faVolumeHigh"/>
        </template>
        <div class="h-1 absolute bg-red-500 bottom-0 z-0" :class="`w-${video.progress ? video.progress : 0}`"
             :style="`width: ${video.progress}%;`"></div>
        <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
          {{ video.time }}</p>
      </div>
    </div>
    <div class="gap-3 relative" :class="{'flex-1 min-w-0 pt-0 items-start': variant,'flex pt-3': !variant}">
      <RouterLink v-if="!route.name.includes('channel')" :to="'/channel/' + video.user.id"
                  class="shrink-0 hidden sm:block">
        <img class="rounded-full w-10 h-10 object-cover"
             :class="{'hidden': variant}"
             :src="video.user.avatar ? `${api}/${video.user.avatar}` : '/src/assets/default.png'" alt="user">
      </RouterLink>
      <div class="flex-1 min-w-0">
        <RouterLink :to="'/watch/' + video.id" class="font-semibold text-sm md:text-base line-clamp-2 leading-5">
          {{ video.title }}
        </RouterLink>
        <RouterLink :to="'/channel/' + video.user.id" class="block text-sm text-gray-600 mt-1">
          {{ video.user.name }}
        </RouterLink>
        <div class="text-xs text-gray-500 mt-2"> {{ video.created_at }}</div>
      </div>
    </div>
  </div>
</template>
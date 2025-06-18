<script setup>

import { faEllipsisVertical, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject } from 'vue'

const token = inject('token')
const props = defineProps({
  playlists: Array
})

function captureFrameAtTime(timeInSeconds, videoElement, videoCanvas) {
  videoElement.currentTime = timeInSeconds
  videoElement.addEventListener('seeked', function onSeeked() {
    videoCanvas.width = videoElement.videoWidth
    videoCanvas.height = videoElement.videoHeight
    const canvasContext = videoCanvas.getContext('2d')
    canvasContext.drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height)
    videoElement.currentTime = 0
    videoElement.removeEventListener('seeked', onSeeked)
  })
}
</script>

<template>
  <div
    class="rounded-lg min-w-25 cursor-pointer relative transition-all duration-100 active:scale-95 select-none active:[&_main]:bg-gray-100"
    v-for="(playlist, index) in props.playlists"
    @mouseenter="playlist.isHover = true" @mouseleave="playlist.isHover = false">
    <div class="absolute bg-contain rounded-t-lg w-full bg-blue-500 bg-no-repeat h-0 scale-x-80 border border-white"
         style="padding-top:56.25%;"></div>
    <div
      class="absolute translate-y-1 bg-contain rounded-t-lg w-full bg-red-500 bg-no-repeat h-0 scale-x-90 border border-white"
      style="padding-top:56.25%;">
    </div>

    <div class="relative flex justify-center items-center">
      <div class="translate-y-2 rounded-t-lg w-full bg-black bg-contain w-full bg-no-repeat border-t border-white bg-size-[20%] bg-center"
           :class="{'brightness-60': playlist.isHover}"
           style="padding-top:56.25%;"
           :style="{'background-image':
           `url('${ playlist.videos ? 'http://videoapi/' + playlist.videos[0].photo_file : '/src/assets/playlist-default.png' }')`}">
        <video ref="PlaylistElement"
               @loadeddata="captureFrameAtTime(5, $refs.PlaylistElement[index], $refs.canvas[index])"
               class="absolute top-0 rounded-t-lg h-full hidden bg-contain bg-black w-full">
          <source :src="playlist.videos ? 'http://videoapi/' + playlist.videos[0].video_file : ''" type="video/mp4" />
        </video>
        <canvas ref="canvas" :class="!playlist.videos ? 'hidden' : null"
                class="h-full mx-auto left-0 right-0 top-0 absolute rounded-t-lg w-full"></canvas>
        <div
          class="absolute flex justify-center items-center gap-1 bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium text-xs bg-black/50 mb-1.5 select-none">
          <FontAwesomeIcon :icon="faList" />
          <span>{{ playlist.videos?.length ? playlist.videos.length : 'Нет' }} видео</span>
        </div>
      </div>
      <span class="absolute text-white z-2 font-medium text-xs select-none"
            v-if="playlist.isHover">Перейти к плейлисту</span>
    </div>


    <main class="p-2 grid grid-cols-9 gap-1 translate-y-2 shadow-sm rounded-b-lg">
      <RouterLink :to="'/channel/' + playlist.user.id">
        <img class="rounded-full w-10 aspect-square"
             :src="playlist.user.photo_file ? 'http://videoapi/'+ playlist.user.photo_file : '/src/assets/default.png' "
             alt="user">
      </RouterLink>
      <div class="col-span-7">
        <RouterLink to="/" class="text-xs sm:text-sm md:text-base font-semibold leading-none break-words line-clamp-2">
          {{ playlist.title }}
        </RouterLink>
        <RouterLink :to="'/channel/' + playlist.user.id" class="text-xs line-clamp-1 mt-1 text-gray-600 w-fit">
          {{ playlist.user.name }}
        </RouterLink>
        <RouterLink to="/" class="text-xs line-clamp-1 text-gray-600">
          {{ playlist.created_at }}
        </RouterLink>
      </div>
      <div class="flex justify-end" v-if="token" @click="playlist.isClicked = false">
        <FontAwesomeIcon class="block mr-2 mt-1 text-sm" :icon="faEllipsisVertical" />
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>
<script setup>
import { faEllipsisVertical, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject, ref } from 'vue'

defineProps({
  isResponse: Boolean,
  videos: Array
})

const token = inject('token')
console.log(token)

const data = ref({
  status: {
    isClickVideo: false
  }
})
const isNotVideo = () => {
  data.value.status.isClickVideo = false
}

const isVideo = () => {
  data.value.status.isClickVideo = true
}

defineEmits(['mouseleaveVideo', 'playVideo', 'timeupdateVideo', 'loadVideo', 'changeRange', 'pauseVideo', 'toggleMutedVideo']);

</script>

<template>
  <div v-if="!isResponse" class="rounded-lg shadow-sm min-w-25 cursor-pointer animate-pulse" v-for="i in 30">
    <div class="bg-contain rounded-t-lg bg-top w-full bg-top bg-gray-300 bg-no-repeat h-0 relative"
         style="padding-top:56.25%;"></div>
    <div class="p-2 grid grid-cols-6 gap-1">
      <div class="flex justify-center py-1.5">
        <div class="py-1.5 col-span-1 aspect-square w-10 rounded-full bg-gray-300" />
      </div>
      <div class="col-span-5">
        <p
          class="text-xs sm:text-sm h-2 opacity-10 bg-current text-lg font-semibold leading-6 break-words line-clamp-2 mb-3"></p>
        <p class="h-2 opacity-10 bg-current text-lg font-semibold leading-6 break-words line-clamp-2"></p>
      </div>
    </div>
  </div>
  <div v-else class="rounded-lg shadow-sm min-w-25 cursor-pointer" v-for="(video, index) in videos"
       :class="{'transition-all duration-150 active:bg-gray-200 active:scale-95': data.status.isClickVideo}">
    <div @mouseleave="$emit('mouseleaveVideo', video, $refs.videoElement[index])"
         @mouseenter="$emit('playVideo', video, $refs.videoElement[index])"
         class="bg-contain rounded-t-lg bg-top
           w-full bg-top bg-black bg-no-repeat h-0 relative" style="padding-top:56.25%;"
         :style="{'background-image': `url('http://videoapi/${video.photo_file}')`}">
      <canvas ref="canvas" :class="{'hidden': video.photo_file !== null}"
              class="h-full mx-auto left-0 right-0 top-0 absolute"></canvas>
      <div>
        <div class="transition delay-250" :class="video.isHover ? 'opacity-100' : 'opacity-0'">
          <video disablePictureInPicture muted ref="videoElement" @click="isVideo"
                 @timeupdate="$emit('timeupdateVideo', video, $refs.videoElement[index])"
                 @loadeddata="$emit('loadVideo', video, $refs.videoElement[index], $refs.canvas[index])"
                 @pause="video.isPlaying = false"
                 @playing="video.isPlaying = true"
                 class="absolute top-0 rounded-t-lg h-full bg-contain bg-black w-full">
            <source :src="`http://videoapi/${video.video_file}`" type="video/mp4" />
          </video>
          <input type="range" @input="$emit('changeRange', $event, video, $refs.videoElement[index])"
                 @change="$emit('changeRange', $event, video, $refs.videoElement[index])"  @click="isNotVideo"
                 @mousedown="$emit('pauseVideo', video, $refs.videoElement[index])" class="[&::-webkit-slider-thumb]:hidden hover:[&::-webkit-slider-thumb]:block
        h-1 z-1 accent-red-500 outline-none [&::-webkit-slider-thumb]:shadow-orange-400
        shadow-orange-400 bg-black/20 appearance-none rounded-none  cursor-pointer absolute bottom-0 w-full"
                 v-model="video.progress">
          <template v-if="video.isMuted">
            <FontAwesomeIcon @click="$emit('toggleMutedVideo', video, $refs.videoElement[index]); isNotVideo();"
                             class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                             :icon="faVolumeXmark" />
          </template>
          <template v-else>
            <FontAwesomeIcon @click="$emit('toggleMutedVideo', video, $refs.videoElement[index]); isNotVideo();"
                             class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                             :icon="faVolumeHigh" />
          </template>
          <div @click="isNotVideo" class="h-1 absolute bg-red-500 bottom-0 z-0" :class="`w-${video.progress}`"
               :style="`width: ${video.progress}%;`"></div>
        </div>
        <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
          {{ video.time }}</p>
      </div>
    </div>
    <div class="p-2 grid grid-cols-9 gap-1" @click="isVideo">
      <RouterLink :to="'/channel/' + video.user.id">
        <img class="rounded-full w-10 aspect-square"
             :src="video.user.photo_file ? 'http://videoapi/'+video.user.photo_file : '/src/assets/default.png' "
             alt="user">
      </RouterLink>
      <div class="col-span-7">
        <RouterLink to="/" class="text-xs sm:text-sm md:text-base font-semibold leading-none break-words line-clamp-2">
          {{ video.title }}
        </RouterLink>
        <RouterLink :to="'/channel/' + video.user.id" class="text-xs line-clamp-1 mt-1 text-gray-600 w-fit">
          {{ video.user.name }}
        </RouterLink>
        <RouterLink to="/" class="text-xs line-clamp-1 text-gray-600">
          {{ video.created_at }}
        </RouterLink>
      </div>
      <div class="flex justify-end" v-if="token">
        <FontAwesomeIcon class="block mr-2 mt-1 text-sm" :icon="faEllipsisVertical" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
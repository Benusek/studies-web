<script setup>
import { faEllipsisVertical, faList, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Video from '@/components/Loaders/Video.vue'
import { inject } from 'vue'
import { VideoPlayer } from 'vue-hls-video-player'

const api = import.meta.env.VITE_APP_API
const props = defineProps({
  isResponse: Boolean,
  videos: Array
})

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

defineEmits(['mouseleaveVideo', 'playVideo', 'timeupdateVideo', 'setDurationVideo', 'changeRange', 'pauseVideo', 'toggleMutedVideo'])

</script>

<template>
  <Video v-if="!isResponse" />
  <div v-else class="rounded-lg shadow-sm min-w-25 cursor-pointer p-1" v-for="(video, index) in videos"
       :class="{'transition-all duration-150 active:bg-gray-100 active:scale-95': false}">
    {{ video.isHover }}
    <div class="relative">
      <img v-if="false" @mouseleave="$emit('mouseleaveVideo', video, $refs.videoElement[index])"
           @mouseenter="$emit('playVideo', video, $refs.videoElement[index])"
           class="bg-cover rounded-lg w-full"
           :src="`${api}/${video['thumbnail']}`" />

      <VideoPlayer v-else :isMuted="true" :isControls="true" ref="videoElement" type="default"
                   :link="`${api}/${video.video}`" :progress="video.seconds ? video.seconds : 0"
                   @timeupdate="$emit('timeupdateVideo', video, $refs.videoElement[index])"
                   @loadeddata="$emit('setDurationVideo', video)"
                   @pause="video.isPlaying = false" @playing="video.isPlaying = true"
                   class="rounded-t-lg bg-contain bg-black" />

      <input type="range" @input="$emit('changeRange', $event, video, $refs.videoElement[index])"
             @mousedown="$emit('pauseVideo', video, $refs.videoElement[index])"
             class="[&::-webkit-slider-thumb]:hidden hover:[&::-webkit-slider-thumb]:block
                 h-1 z-1 accent-red-500 outline-none [&::-webkit-slider-thumb]:shadow-orange-400
                 shadow-orange-400 bg-black/20 appearance-none rounded-none  cursor-pointer absolute bottom-0 w-full"
             v-model="video.progress">
      <template v-if="video.isMuted">
        <FontAwesomeIcon @click="$emit('toggleMutedVideo', video, $refs.videoElement[index]);"
                         class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                         :icon="faVolumeXmark" />
      </template>
      <template v-else>
        <FontAwesomeIcon @click="$emit('toggleMutedVideo', video, $refs.videoElement[index]);"
                         class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                         :icon="faVolumeHigh" />
      </template>
      {{ video.progress }}
      <div class="h-1 absolute bg-red-500 bottom-0 z-0" :class="`w-${video.progress ? video.progress : 0}`"
           :style="`width: ${video.progress}%;`"></div>
      <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
        {{ video.time }}</p>
    </div>
    <div class="p-2 grid grid-cols-9 gap-1 relative">
      <RouterLink :to="'/channel/' + video.user.id">
        <img class="rounded-full w-10 aspect-square"
             :src="video.user.photo_file ? `${api}/${video.user.photo_file}` : '/src/assets/default.png' "
             alt="user">
      </RouterLink>
      <div class="col-span-7">
        <RouterLink :to="'/watch/' + video.id"
                    class="text-xs sm:text-sm md:text-base font-semibold leading-none break-words line-clamp-2">
          {{ video.title }}
        </RouterLink>
        <RouterLink :to="'/channel/' + video.user.id" class="text-xs line-clamp-1 mt-1 text-gray-600 w-fit">
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
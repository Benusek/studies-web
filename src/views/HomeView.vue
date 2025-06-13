<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEllipsisVertical, faUserCircle, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'

const videos = ref([])

const token = inject('token')
const isResponse = ref(false)
const isUploading = ref(true)
const isProcessing = ref(false)

onMounted(async () => {
    const result = await apiFetch('GET', `/video/start/${videos.value.length}/count/20`)
    if (result.videos) {
      result.videos.forEach(v => {
        v.isHover = false
        v.isMuted = true
        v.isPlaying = false
        v.time = null
        v.progress = Number
        v.length = Number
        v.created_at = getRelativeTime(v.created_at)

        videos.value.push(v)
      })
      isResponse.value = true
    }
  }
)

const getRelativeTime = date => {
  let time = new Intl.RelativeTimeFormat(
    'ru', {style: "long",numeric: "auto"}
  )

  const milliseconds  =  new Date(date) - new Date()
  const seconds = Math.abs(Math.floor(milliseconds / 1000))
  const minutes = Math.abs(Math.floor(seconds / 60))
  const hours = Math.abs(Math.floor(minutes / 60))
  const days = Math.abs(Math.floor(hours / 24))
  const week = Math.abs(Math.floor(days / 24))
  const months = Math.abs(Math.floor(days / 30))
  const years = Math.abs(Math.floor(months / 12))

  const times = {
    years: years,
    months: months,
    week: week,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }

  for(const key in times) {
    if (times[key] >= 1) {
      return time.format(times[key] * -1, key)
    }
  }
}

const loadVideo = (video, videoElement, canvas = null) => {
  video.photo_file === null ? captureFrameAtTime(5, videoElement, canvas) : null
  video.length = videoElement.duration
  setDurationVideo(video, video.length)
}

const timeupdateVideo = (video, videoElement) => {
  if (videoElement) {
    const currentTime = videoElement.currentTime
    video.length = videoElement.duration
    video.progress = (currentTime / video.length) * 100
    setDurationVideo(video, video.length - currentTime)
  }
}

const mouseleaveVideo = (video, videoElement) => {
  video.isHover = false
  video.isMuted = true
  videoElement.muted = true
  videoElement.currentTime = 0
  setDurationVideo(video, video.length)
  pauseVideo(video, videoElement)
}

const changeRange = (event, video, videoElement) => {
  videoElement.currentTime = (event.target.value / 100) * video.length
  playVideo(video, videoElement)
}

const pauseVideo = (video, videoElement) => {
  if (video.isPlaying && !videoElement.paused) {
    videoElement.pause()
  }
}

const playVideo = (video, videoElement) => {
  video.isHover = true
  if (!video.isPlaying && videoElement.paused) {
    videoElement.play()
  }
}

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

const setDurationVideo = (video, seconds) => {
  const time = {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60),
    seconds: Math.floor(seconds % 60)
  }

  for (const key in time) {
    if (key === 'hours') {
      time[key] < 10 && time[key] > 0 ? time[key] = '0' + time[key] : time[key]
      time[key] === 0 ? time[key] = '' : time[key] + ':'
    } else {
      time[key] < 10 ? time[key] = '0' + time[key] : time[key]
    }
  }
  video.time = time['hours'] + time['minutes'] + ':' + time['seconds']
}

const toggleMutedVideo = (video, videoElement) => {
  switch (video.isMuted && videoElement.muted) {
    case true:
      video.isMuted = false
      videoElement.muted = false
      break
    case false:
      video.isMuted = true
      videoElement.muted = true
      break
  }
}

window.onbeforeunload = function() {
  window.scrollTo(0, 0)
}

window.addEventListener('scroll', async () => {
  if (isProcessing.value || isResponse.value === false) {
    return
  }

  if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight && isUploading.value) {
    isProcessing.value = true
    const result = await apiFetch('GET', `/video/start/${videos.value.length}/count/20`)

    if (result.data) {
      isUploading.value = false
    }

    if (result?.videos) {
      result.videos.forEach(video => {
        video.created_at = getRelativeTime(video.created_at)
      })
      videos.value = videos.value.concat(result.videos)
    }

    isProcessing.value = false
    console.log('Прокрутка достигла конца страницы!')
  }
}, false)

</script>

<template>
  <div class="p-3 w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 h-auto">
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
      <div v-else class="rounded-lg shadow-sm min-w-25 cursor-pointer" v-for="(video, index) in videos">
        <div @mouseleave="mouseleaveVideo(video, $refs.videoElement[index])"
             @mouseenter="playVideo(video, $refs.videoElement[index])"
             class="bg-contain rounded-t-lg bg-top
           w-full bg-top bg-black bg-no-repeat h-0 relative" style="padding-top:56.25%;"
             :style="{'background-image': `url('http://videoapi/${video.photo_file}')`}">
          <canvas ref="canvas" :class="{'hidden': video.photo_file !== null}"
                  class="h-full mx-auto left-0 right-0 top-0 absolute"></canvas>
          <div>
            <div class="transition delay-250" :class="video.isHover ? 'opacity-100' : 'opacity-0'">
              <video disablePictureInPicture muted ref="videoElement"
                     @timeupdate="timeupdateVideo(video, $refs.videoElement[index])"
                     @loadeddata="loadVideo(video, $refs.videoElement[index], $refs.canvas[index])"
                     @pause="video.isPlaying = false"
                     @playing="video.isPlaying = true"
                     class="absolute top-0 rounded-t-lg h-full bg-contain bg-black w-full">
                <source :src="`http://videoapi/${video.video_file}`" type="video/mp4" />
              </video>
              <input type="range" @input="changeRange($event, video, $refs.videoElement[index])"
                     @change="changeRange($event, video, $refs.videoElement[index])"
                     @mousedown="pauseVideo(video, $refs.videoElement[index])" class="[&::-webkit-slider-thumb]:hidden hover:[&::-webkit-slider-thumb]:block
        h-1 z-1 accent-red-500 outline-none [&::-webkit-slider-thumb]:shadow-orange-400
        shadow-orange-400 bg-black/20 appearance-none rounded-none  cursor-pointer absolute bottom-0 w-full"
                     v-model="video.progress">
              <template v-if="video.isMuted">
                <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.videoElement[index])"
                                 class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                                 :icon="faVolumeXmark" />
              </template>
              <template v-else>
                <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.videoElement[index])"
                                 class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                                 :icon="faVolumeHigh" />
              </template>
              <div class="h-1 absolute bg-red-500 bottom-0 z-0" :class="`w-${video.progress}`"
                   :style="`width: ${video.progress}%;`"></div>
            </div>
            <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
              {{ video.time }}</p>
          </div>
        </div>
        <div class="p-2 grid grid-cols-10 gap-1">
          <RouterLink :to="'/channel/' + video.user.id" class="col-span-2">
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
      <div v-if="isUploading" class="h-15 col-span-full flex justify-center items-center">
        <svg aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-black"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>

import { inject, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import VideoPreview from '@/components/VideoPreview.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const videos = ref([])

const token = inject('token')
const isResponse = ref(false)
const isUploading = ref(true)
const isProcessing = ref(false)
const isClickVideo = ref(false)
const isEmpty =  ref(false)
const category = ref(route.params.category)

if (!category.value) {
  category.value = ''
}
else {
  category.value = '?category=' + category.value;
}

const getVideos = async() => {
    const result = await apiFetch('GET', `/video/start/${videos.value.length}/count/20${category.value}`)
    if (result.videos) {
      if (result.videos.length < 20) {
        isUploading.value = false
      }

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

    if (result.data) {
      isEmpty.value = true
      isUploading.value = false
    }

    if (result) {
      isResponse.value = true
    }
  }

getVideos()

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

const isNotVideo = () => {
  isClickVideo.value = false
}

const isVideo = () => {
  isClickVideo.value = true
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
    const result = await apiFetch('GET', `/video/start/${videos.value.length}/count/20${category.value}`)

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
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 h-auto">
      <div class="flex flex-col p-10 col-span-full flex justify-center items-center text-gray-500 gap-5" v-if="isEmpty">
        <FontAwesomeIcon :icon="faPhotoFilm" class="text-4xl "/>
        <span>Нет видео с данной категорией</span>
      </div>
      <VideoPreview :videos="videos" :isResponse="isResponse" :isClickVideo="isClickVideo" :token="token"
                    @mouseleaveVideo="mouseleaveVideo" @playVideo="playVideo" @timeupdateVideo="timeupdateVideo"
                    @loadVideo="loadVideo" @changeRange="changeRange" @isNotVideo="isNotVideo" @isVideo="isVideo"
                    @pauseVideo="pauseVideo" @toggleMutedVideo="toggleMutedVideo"/>
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
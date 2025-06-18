<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHome, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import VideoPreview from '@/components/VideoPreview.vue'
import NotFound from '@/components/NotFound.vue'

const props = defineProps({
  videos: Array,
  isEmpty: Boolean,
  isResponse: Boolean,
  isProcessing: Boolean,
  text:String
})

const loadVideo = (video, videoElement, canvas = null) => {
  video.photo_file === null ? captureFrameAtTime(5, videoElement, canvas) : null
  video.length = videoElement.duration
  setDurationVideo(video, video.length, videoElement)
}

const timeupdateVideo = (video, videoElement) => {
  if (videoElement) {
    const currentTime = videoElement.currentTime
    video.length = videoElement.duration
    video.progress = (currentTime / video.length) * 100
    setDurationVideo(video, video.length - currentTime, videoElement)
  }
}

const mouseleaveVideo = (video, videoElement) => {
  video.isHover = false
  video.isMuted = true
  videoElement.muted = true
  videoElement.currentTime = 0
  pauseVideo(video, videoElement)
  if (videoElement.readyState !== 4) {
    return
  }
  setDurationVideo(video, video.length, videoElement)

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

const setDurationVideo = (video, seconds, videoElement) => {
  if (videoElement.readyState !== 4) {
    return
  }

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

</script>

<template>

  <NotFound :text="props.text" :isEmpty="props.isEmpty"/>
<!--      <div class="flex flex-col gap-4 p-10 col-span-full flex justify-center items-center text-gray-500"-->
<!--           v-if="props.isEmpty">-->
<!--        <FontAwesomeIcon :icon="faPhotoFilm" class="text-4xl " />-->
<!--        <span class="text-lg">{{props.text}}</span>-->
<!--          <RouterLink to="/" class="flex flex-row gap-2 items-center text-blue-600">-->
<!--            <FontAwesomeIcon :icon="faHome" />-->
<!--            <span>Вернуться на главную</span>-->
<!--          </RouterLink>-->
<!--      </div>-->
      <VideoPreview :videos="videos" :isResponse="props.isResponse"
                    @mouseleaveVideo="mouseleaveVideo" @playVideo="playVideo" @timeupdateVideo="timeupdateVideo"
                    @loadVideo="loadVideo" @changeRange="changeRange"
                    @pauseVideo="pauseVideo" @toggleMutedVideo="toggleMutedVideo" />
</template>
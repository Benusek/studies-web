<script setup>
import VideoPreview from '@/components/VideoPreview.vue'
import NotFound from '@/components/Loaders/NotFound.vue'

const props = defineProps({
  videos: Array,
  isEmpty: Boolean,
  isResponse: Boolean,
  isProcessing: Boolean,
  text: String
})

const timeupdateVideo = (video, videoElement) => {
  // if (videoElement) {
    // const currentTime = videoElement.currentTime
    // video.progress = (currentTime / video.duration) * 100
    // setDurationVideo(video)
  //TODO: currentTime не работает для hls. Изменить
    console.log(videoElement.currentTime)
    // video.progress = (currentTime / video.duration) * 100
  // }
}

const mouseleaveVideo = (video, videoElement) => {
  console.log('Выщел')
  // video.isHover = false
  videoElement.muted = true
  pauseVideo(video, videoElement)
  if (videoElement.readyState !== 4) {
    return
  }
  setDurationVideo(video)
}

const changeRange = (event, video, videoElement) => {
  video.seconds = ((event.target.value/100) * video.duration)/1000
  console.log(video.progress)
  // videoElement.currentTime = (event.target.value / 100) * video.duration
  // playVideo(video, videoElement)
}

const pauseVideo = (video, videoElement) => {
  if (video.isPlaying && !videoElement.paused) {
    videoElement.pause()
  }
}

const playVideo = (video, videoElement) => {
  // video.isHover = true
  if (!video.isPlaying && videoElement.paused) {
    videoElement.play()
  }
}

const setDurationVideo = (video) => {
  const time = new function() {
    this.seconds = Math.abs(Math.floor(video.duration / 1000))
    this.minutes = Math.abs(Math.floor(this.seconds / 60))
    this.hours = Math.abs(Math.floor(this.minutes / 60))
  }

  for (const key in time) {
    if (key.startsWith('hours')) {
      time[key] < 10 && time[key] > 0 ? time[key] = '0' + time[key] : time[key]
      time[key] === 0 ? time[key] = '' : time[key] + ':'
    } else {
      time[key] < 10 ? time[key] = '0' + time[key] : time[key]
    }
  }
  video.time = time['hours'] + time['minutes'] + ':' + time['seconds']
}

const toggleMutedVideo = (video, videoElement) => {
  //TODO: muted не работает для hls
  switch (video.isMuted && videoElement.muted) {
    case true:
      video.isMuted = false
      videoElement.muted = false
      break
    default:
      video.isMuted = true
      videoElement.muted = true
      break
  }
}


// window.onbeforeunload = function() {
//   window.scrollTo(0, 0)
// }

</script>

<template>

  <NotFound :text="props.text" :isEmpty="props.isEmpty" />
  <VideoPreview :videos="videos" :isResponse="props.isResponse"
                @mouseleaveVideo="mouseleaveVideo" @playVideo="playVideo" @timeupdateVideo="timeupdateVideo"
                @setDurationVideo="setDurationVideo" @changeRange="changeRange"
                @pauseVideo="pauseVideo" @toggleMutedVideo="toggleMutedVideo" />
</template>
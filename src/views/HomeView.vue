<script setup>

import {onMounted, ref} from "vue";
import apiFetch from "@/helpers/apiFetch.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faUserCircle, faVolumeHigh, faVolumeXmark} from "@fortawesome/free-solid-svg-icons";

const isResponse = ref(false)
const videos = ref([])
onMounted(async () => {
      const result = await apiFetch('GET', '/video/start/0/count/30')
      if (result.videos) {
        result.videos.forEach(v => {
          v.isHover = false
          v.isMuted = true
          v.isPlaying = false
          v.time = null
          v.progress = Number
          v.length = Number
          videos.value.push(v)
        })
        isResponse.value = true
      }
    }
)

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
  videoElement.currentTime = timeInSeconds;
  videoElement.addEventListener('seeked', function onSeeked() {
    videoCanvas.width = videoElement.videoWidth;
    videoCanvas.height = videoElement.videoHeight;
    const canvasContext = videoCanvas.getContext('2d');
    canvasContext.drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height);
    videoElement.currentTime = 0;
    videoElement.removeEventListener('seeked', onSeeked);
  });
}

const setDurationVideo = (video, seconds) => {
  const time = {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60),
    seconds: Math.floor(seconds % 60)
  }

  for (const key in time) {
    if (key === 'hours') {
      time[key] < 10 && time[key] > 0 ? time[key] = "0" + time[key] : time[key]
      time[key] === 0 ? time[key] = '' : time[key] + ':'
    }
    else {
      time[key] < 10 ? time[key] = "0" + time[key] : time[key]
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
</script>

<template>
  <main class="container mx-auto p-3 border-1 border-t-0 border-gray-200
      border-b border-gray-200 h-screen">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      <div v-if="!isResponse" class="rounded-lg shadow-sm min-w-25 cursor-pointer animate-pulse" v-for="i in 12">
        <div class="bg-contain rounded-t-lg bg-top w-full bg-top bg-gray-300 bg-no-repeat h-0 relative" style="padding-top:56.25%;"></div>
        <div class="p-2 grid grid-cols-6 gap-1">
          <div class="flex justify-center py-1.5">
            <div class="rounded-full w-[36px] h-[36px] bg-gray-300"></div>
          </div>
          <div class="col-span-5">
            <p class="h-3 opacity-10 bg-current text-lg font-semibold leading-6 break-words line-clamp-2 mb-3"></p>
            <p class="h-3 opacity-10 bg-current text-lg font-semibold leading-6 break-words line-clamp-2"></p>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg shadow-sm min-w-25 cursor-pointer" v-for="(video, index) in videos">
        <div @mouseleave="mouseleaveVideo(video, $refs.videoElement[index])"
             @mouseenter="playVideo(video, $refs.videoElement[index])"
             class="bg-contain rounded-t-lg bg-top
           w-full bg-top bg-black bg-no-repeat h-0 relative" style="padding-top:56.25%;"
             :style="{'background-image': `url('http://videoapi/${video.photo_file}')`}">
          <canvas ref="canvas" :class="{'hidden': video.photo_file !== null}" class="h-full mx-auto left-0 right-0 top-0 absolute"></canvas>
          <div>
            <div :class="{'hidden': !video.isHover}">
              <video disablePictureInPicture muted ref="videoElement"
                     @timeupdate="timeupdateVideo(video, $refs.videoElement[index])"
                     @loadeddata="loadVideo(video, $refs.videoElement[index], $refs.canvas[index])"
                     @pause="video.isPlaying = false"
                     @playing="video.isPlaying = true"
                     class="absolute top-0 rounded-t-lg h-full bg-contain bg-black w-full">
                <source :src="`http://videoapi/${video.video_file}`" type="video/mp4"/>
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
                                 :icon="faVolumeXmark"/>
              </template>
              <template v-else>
                <FontAwesomeIcon @click="toggleMutedVideo(video, $refs.videoElement[index])"
                                 class="absolute rounded-full top-0 m-2 w-4 right-0 h-1 text-white p-2 font-medium bg-black/50"
                                 :icon="faVolumeHigh"/>
              </template>
              <div class="h-1 absolute bg-red-500 bottom-0 z-0" :class="`w-${video.progress}`"
                   :style="`width: ${video.progress}%;`"></div>
            </div>
            <p class="absolute text-sm bottom-0 right-0 m-1 p-0.5 rounded-sm text-white font-medium bg-black/50 mb-1.5">
              {{ video.time }}</p>
          </div>
        </div>
        <div class="p-2 grid grid-cols-6 gap-1">
          <div class="flex justify-center py-1.5">
            <RouterLink to="/">
              <template v-if="video.user.photo_file === null">
                <FontAwesomeIcon class="text-4xl text-gray-300" :icon="faUserCircle"/>
              </template>
              <template v-else>
                <img class="rounded-full w-[36px] h-[36px]" :src="`http://videoapi/${video.user.photo_file}`" alt="user">
              </template>
            </RouterLink>
          </div>
          <div class="col-span-5">
            <RouterLink to="/"><p class="text-lg font-semibold leading-6 break-words line-clamp-2 ">{{ video.title }}</p>
            </RouterLink>
            <RouterLink to="/"><p class="line-clamp-1 mt-1 text-gray-600">{{ video.user.login }}</p></RouterLink>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

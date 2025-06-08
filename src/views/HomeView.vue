<script setup>

import {onMounted, ref} from "vue";
import apiFetch from "@/helpers/apiFetch.js";

const progress = ref(0)
const videos = ref([])

onMounted(async() => {
  const result = await apiFetch('GET', '/video/start/0/count/30')
  if (result.videos) {
    // console.log(result.videos)
    result.videos.forEach(v => {
      const video = v
      video.isHover = false
      video.progress = 0
      videos.value.push(video)
    })
  }
  console.log(videos.value)
})

const mouseenterVideo = event => {
  event.target.play()
}

const mouseleaveVideo = event => {
  event.target.pause()
  event.target.currentTime = 0
}

const hoverProgress = (progress) => {
  console.log(1)
  progress = event.target.currentTime
}

</script>

<template>
  <main class="container mx-auto p-3 border-1 border-t-0 border-gray-200
      gap-3 border-b border-gray-200
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    <div class="rounded-lg shadow-sm min-w-25 cursor-pointer" v-for="video in videos">
      <div @mouseenter="video.isHover = true" @mouseleave="video.isHover = false"
           class="bg-contain rounded-t-lg bg-top
           w-full bg-top bg-no-repeat h-0 relative" style="padding-top:56.25%;"
           :style="{'background-image': `url('http://videoapi/${video.photo_file}')`}">
        <video disablePictureInPicture muted @mouseover="hoverProgress(video.progress)"  @mouseenter="mouseenterVideo" @mouseleave="mouseleaveVideo" v-if="video.isHover"
               class="absolute top-0 rounded-t-lg h-full bg-contain bg-black w-full">
          <source :src="`http://videoapi/${video.video_file}`" type="video/mp4" />
        </video>
        <input type="range" class="absolute bottom-0 w-full" v-model="progress">
      </div>
      {{progress}}
      <div class="p-2 h-20">
        <p class="text-lg font-semibold leading-6 break-words line-clamp-2 ">{{video.title}}</p>
        <p class="line-clamp-1 mt-1 text-gray-600">{{video.user.login}}</p>
      </div>
    </div>
  </main>
</template>

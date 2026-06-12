<script setup>

import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { useRoute } from 'vue-router'
import Loading from '@/components/Loaders/Loading.vue'
import NotFound from '@/components/Loaders/NotFound.vue'
import VideoPreview from '@/components/Previews/VideoCard.vue'
import VideoCard from "@/components/Previews/VideoCard.vue";

const route = useRoute()
const data = ref({
  status: {
    isResponse: false,
    isUploading: true,
  },
  category: route.params.category,
  videos: []
})

if (!data.value.category) {
  data.value.category = ''
} else {
  data.value.category = '?category=' + data.value.category
}

onMounted(async () => {
  const result = await apiFetch('GET', `/video/start/${data.value.videos.length}/count/12${data.value.category}`)
  if (result.videos) {
    if (result.videos.length < 11) {
      data.value.status.isUploading = false
    }
    data.value.videos = result.videos
  }

  if (result.data) {
    data.value.status.isEmpty = true
    data.value.status.isUploading = false
  }

  if (result) {
    data.value.status.isResponse = true
  }
})

window.addEventListener('scroll', async () => {
  if (data.value.status.isProcessing || data.value.status.isResponse === false) {
    return
  }
  if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight && data.value.status.isUploading) {
    data.value.status.isProcessing = true
    const result = await apiFetch('GET', `/video/start/${data.value.videos.length}/count/11${data.value.category}`)

    if (result.data) {
      data.value.status.isUploading = false
    }

    if (result?.videos) {
      result.videos.forEach(video => {
        video.created_at = relativeTime(video.created_at)
      })
      data.value.videos = data.value.videos.concat(result.videos)
    }

    data.value.status.isProcessing = false
    console.log('Прокрутка достигла конца страницы!')
  }
}, false)

</script>

<template>
  <div class="p-3 w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 h-auto">
      <NotFound text="Нет видео с данной категорией" :isEmpty="data.status.isEmpty" />
      <VideoCard :videos="data.videos" :isResponse="data.status.isResponse" />
    </div>
  </div>
</template>
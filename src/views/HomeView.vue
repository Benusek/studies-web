<script setup>

import { onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { useRoute } from 'vue-router'
import NotFound from '@/components/Loaders/NotFound.vue'
import VideoCard from "@/components/Cards/VideoCard.vue";
import VideoSkeleton from "@/components/Loaders/VideoSkeleton.vue";
import InfiniteScroll from "@/components/InfiniteScroll.vue";

const route = useRoute()
const data = ref({
  status: {
    isResponse: false,
    isProcessing: false,
    isEmpty: false,

    hasMore: true
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
  await loadMore()
  data.value.status.isResponse = true
})

const loadMore = async () => {
  if (
      data.value.status.isProcessing ||
      !data.value.status.hasMore
  ) {
    return
  }

  data.value.status.isProcessing = true

  try {
    const result = await apiFetch(
        'GET',
        `/video/start/${data.value.videos.length}/count/12${data.value.category}`
    )

    if (result?.data?.length < 1) {
      data.value.status.isEmpty = true
      return
    }

    if (!result?.videos?.length) {
      data.value.status.hasMore = false
      return
    }

    data.value.videos.push(...result.videos)

    if (result.videos.length < 12) {
      data.value.status.hasMore = false
    }
  } finally {
    data.value.status.isProcessing = false
  }
}

</script>

<template>

  <div class="p-3 w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 h-auto">
      <VideoSkeleton v-if="!data.status.isResponse && !data.status.isEmpty" v-for="index in 8" :key="index"/>
      <VideoCard v-else-if="data.status.isResponse && !data.status.isEmpty" :variant="false" :videos="data.videos" :isResponse="data.status.isResponse" />
      <NotFound v-else text="Нет видео с данной категорией" :isEmpty="data.status.isEmpty" />
      <InfiniteScroll  v-if="!data.status.isEmpty" :loading="data.status.isProcessing" :has-more="data.status.hasMore" @load="loadMore" />
    </div>
  </div>
</template>
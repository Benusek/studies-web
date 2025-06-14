<script setup>

import VideoGridView from '@/components/VideoGridView.vue'
import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBook, faC, faN, faSliders } from '@fortawesome/free-solid-svg-icons'
import {
  faFlutter,
  faGolang,
  faJava,
  faNodeJs,
  faReact,
  faUnity,
  faVuejs,
  faWpforms
} from '@fortawesome/free-brands-svg-icons'

const relativeTime = inject('getRelativeTime')
const allCategories = inject('allCategories')
const icons = {
  1: faWpforms,
  2: faVuejs,
  3: faN,
  4: faNodeJs,
  6: faReact,
  7: faFlutter,
  8: faGolang,
  9: faUnity,
  11: faJava,
  10: faC,
  12: faBook
}

const route = useRoute()
const data = ref({
  status: {
    isResponse: false,
    isUploading: true,
    isProcessing: false,
    isEmpty: false,
  },
  query: route.params.query,
  videos: []
})

if (!data.value.query) {
  data.value.query = ''
} else {
  data.value.query = '?query=' + data.value.query
}

onMounted(async () => {
  const result = await apiFetch('GET', `/video/start/0/count/20${data.value.query}`)
  if (result.videos) {
    if (result.videos.length < 20) {
      data.value.status.isUploading = false
    }
    result.videos.forEach(v => {
      v.isHover = false
      v.isMuted = true
      v.isPlaying = false
      v.time = null
      v.progress = Number
      v.length = Number
      v.created_at = relativeTime(v.created_at)
      data.value.videos.push(v)
    })
    data.value.status.isResponse = true
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
    const result = await apiFetch('GET', `/video/start/${data.value.videos.length}/count/20${data.value.query}`)

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
      <div v-if="true" class="col-span-full">
        <div class="flex gap-2">
          <FontAwesomeIcon :icon="faSliders"/>
          <span class="font-medium text-xs">Фильтр</span>
        </div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li class="xl:col-span-2 flex flex-col p-4 gap-2">
            <span class="font-medium text-sm mb-0 text-gray-600">По категории</span>
            <input type="text"  placeholder="Категория" class="border border-gray-300 bg-white rounded-lg p-1 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-1 [&>*:nth-child(3n+2)]:lg:border-x  [&>*:nth-child(3n+2)]:border-gray-300 w-fit">
              <div v-for="category in allCategories" class="flex gap-2 p-1 justify-between items-center">
                <FontAwesomeIcon :icon="icons[`${category.id}`]" />
                <span class="text-xs break-words line-clamp-2">{{category.name}}</span>
                <input type="radio" name="category" class="">
              </div>
            </div>

          </li>
          <li class="flex flex-col p-4 gap-2">
            <span class="font-medium text-sm mb-0 text-gray-600">По тегу</span>
            <input type="text"  placeholder="Тег" class="border border-gray-300 bg-white rounded-lg p-1 text-xs">
          </li>
          <li class="flex flex-col p-4 items-start gap-2 font-medium text-gray-500">
            <span class="font-medium text-sm mb-0 text-gray-600">Тип</span>
              <label for="all" class="flex gap-2 text-xs cursor-pointer">
                <input type="radio" name="type" id="all">
                <span>Все</span>
              </label>
            <label for="video" class="flex gap-2 text-xs cursor-pointer">
              <input type="radio" name="type" id="video">
              <span>Видео</span>
            </label>
            <label for="playlist" class="flex gap-2 text-xs cursor-pointer">
              <input type="radio" name="type" id="playlist">
              <span>Плейлист</span>
            </label>
          </li>
        </ul>
      </div>
      <VideoGridView :videos="data.videos" :isEmpty="data.status.isEmpty" :isResponse="data.status.isResponse"
                     :isProcessing="data.status.isProcessing" :text="'К сожалению, на ваш поисковый запрос ничего не найдено'"/>
      <div v-if="true" class="col-span-full h-25 flex justify-center items-center">
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

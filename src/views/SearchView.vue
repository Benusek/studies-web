<script setup>

import VideoGridView from '@/components/VideoGridView.vue'
import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBook, faC, faN, faSliders, faXmark } from '@fortawesome/free-solid-svg-icons'
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
const getFiltered = inject('getFiltered')

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
    isFilter: false
  },
  videos: [],
  playlists: [],
  count_videos: '',
  count_playlists: '',
  filter: {
    allCategories: [],
    categories: [],
    categoryQuery: '',
    tagQuery: '',
    allTags: [],
    tags: []
  },
  form: {
    query: route.params.query,
    categories: [],
    tags: [],
    type: 'all'
  },
})

onMounted(async () => {
  const tags = await apiFetch('GET', '/tag')
  if (tags) {
    tags.forEach((tag) => {
      tag.isChecked = false
      data.value.filter.allTags.push(tag)
      data.value.filter.tags.push(tag)
    })
  }

  const categories = await apiFetch('GET', '/category')
  if (categories) {
    categories.forEach((category) => {
      category.isChecked = false
      data.value.filter.allCategories.push(JSON.parse(JSON.stringify(category)))
      data.value.filter.categories.push(category)
    })
  }

  const result = await apiFetch('POST', `/video/search/start/${data.value.videos.length}/count/30`, data.value.form)
  console.log(result)
  if (result.data.videos) {
    if (result.data.videos.length < 30) {
      data.value.status.isUploading = false
    }
    result.data.videos.forEach(v => {
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

  if (result.data.count_videos === 0 && result.data.count_videos === 0 || result.data.length === 0) {
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
    const result = await apiFetch('GET', `/video/start/${data.value.videos.length}/count/20${data.value.form.query}`)

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

const sortTags = (tag) => {
  data.value.filter.allTags[data.value.filter.allTags.findIndex(obj => obj.id === tag.id)] = data.value.filter.tags[data.value.filter.tags.findIndex(obj => obj.id === tag.id)]
  !tag.isChecked ? tag.isChecked = true : tag.isChecked = false
}

const toggle = (value) => {
  return !value
}

const writeForm = (value, massive, id) => {
  value ? massive.push(id) : massive.splice(massive.indexOf(id), 1)
}

const resetFilter = (radio) => {
  data.value.filter.tags.forEach((tag) => {
    tag.isChecked = false
  })

  data.value.filter.categories.forEach((tag) => {
    tag.isChecked = false
  })

  radio.checked = true
}

const submitFilter = async() => {
  const result = await apiFetch('POST', `video/search/start/${data.value.videos.length}/count/30`, data.value.form)
  if (result) {
    console.log(result)
  }
}

</script>

<template>
  <div class="p-3 w-full">
    <div class="flex gap-2 select-none cursor-pointer mb-1 p-2 active:bg-gray-200 rounded-lg" @click="data.status.isFilter = toggle(data.status.isFilter)">
      <FontAwesomeIcon :icon="faSliders"/>
      <span class="font-medium text-xs">Фильтр</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <transition
          enter-active-class="transition-all ease-linear duration-100 transform"
          enter-from-class="h-0"
          enter-to-class="h-full"
          leave-active-class="transition-all ease-linear duration-100 transform"
          leave-from-class="h-full"
          leave-to-class="h-0">
        <ul class="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-3 w-full sm:w-auto flex shadow-lg sm:justify-center overflow-y-hidden" v-if="data.status.isFilter">
          <li class=" flex flex-col p-4 gap-2 sm:border-r border-gray-200/80 border-b sm:border-b-0">
            <span class="font-medium text-sm mb-0 text-gray-600 select-none">По категории</span>
            <input v-model="data.filter.categoryQuery" type="text"  placeholder="Категория" class="border border-gray-300 bg-white rounded-lg p-1 text-xs"
                   @input="data.filter.categories = []; getFiltered(data.filter.allCategories, data.filter.categories, data.filter.categoryQuery)">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [&>*:nth-child(3n+2)]:md:border-x
            [&>*:nth-child(2n+1)]:sm:border-r [&>*:nth-child(2n+1)]:sm:border-gray-300 [&>*:nth-child(3n+2)]:border-gray-300 [&>*:nth-child(2n+1)]:md:border-r-0 ">
              <label :for="`category${category.id}`" v-for="category in data.filter.categories" class="flex gap-2 sm:justify-between items-center cursor-pointer hover:bg-gray-100
              active:bg-gray-200 p-2 select-none"  :class="{'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700': category.isChecked}"
                     @click="category.isChecked = toggle(category.isChecked); writeForm(category.isChecked, data.form.categories, category.id)">
                <FontAwesomeIcon :icon="icons[`${category.id}`]"/>
                <span class="text-xs break-words line-clamp-1">{{category.name}}</span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 gap-2">
            <span class="font-medium text-sm mb-0 text-gray-600 select-none">По тегу</span>
            <input v-model="data.filter.tagQuery" type="text"  placeholder="Тег" class="border border-gray-300 bg-white rounded-lg p-1 text-xs"
                   @input="data.filter.tags = []; getFiltered(data.filter.allTags, data.filter.tags, data.filter.tagQuery)">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [&>*:nth-child(3n+2)]:md:border-x  [&>*:nth-child(3n+2)]:border-gray-300 w-fit gap-2  select-none">
              <label :for="`tag${tag.id}`" v-for="tag in data.filter.tags" class="relative flex gap-2 justify-between items-center cursor-pointer bg-blue-500 rounded-lg
              font-medium text-white hover:bg-blue-600 active:bg-blue-700 p-1.5" :class="{'bg-indigo-500 hover:bg-indigo-600': tag.isChecked}" @click="sortTags(tag); writeForm(tag.isChecked, data.form.tags, tag.id)">
                <span class="text-[10px] break-words line-clamp-1 px-2">{{tag.name}}</span>
                <span class="invisible text-xs" :class="{'visible': tag.isChecked}">
                  <FontAwesomeIcon :icon="faXmark" />
                </span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 items-start gap-2 font-medium text-gray-500 lg:border-l lg:border-gray-200/80 select-none border-t border-gray-200/80 sm:border-t-0">
            <span class="font-medium text-sm mb-0 text-gray-600">Тип</span>
              <label for="all" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'all'">
                <input type="radio" checked ref="all" name="type" id="all" class="checked:accent-indigo-500 peer cursor-pointer">
                <span class="peer-checked:text-indigo-500">Все</span>
              </label>
            <label for="video" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'video'">
              <input type="radio" name="type" id="video" class="checked:accent-indigo-500 peer cursor-pointer">
              <span class="peer-checked:text-indigo-500">Видео</span>
            </label>
            <label for="playlist" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'playlist'">
              <input type="radio" name="type" id="playlist" class="checked:accent-indigo-500 peer cursor-pointer">
              <span class="peer-checked:text-indigo-500">Плейлист</span>
            </label>
          </li>
          <li class="col-span-full  flex flex-row justify-center sm:justify-end gap-2">
            <button @click.prevent="resetFilter($refs.all)" class="p-1.5 border-2 border-red-400 rounded-lg text-red-400 text-xs font-medium cursor-pointer hover:bg-gray-100 active:bg-gray-200">
              Сбросить
            </button>
            <button @click.prevent="submitFilter()" class="p-1.5 bg-blue-500 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-blue-600 active:bg-blue-500">
              Подтвердить
            </button>
          </li>
        </ul>
        </transition>

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

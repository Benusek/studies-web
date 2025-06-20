<script setup>

import VideoGridView from '@/components/VideoGridView.vue'
import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAngleLeft, faAngleRight,
  faAnglesLeft, faAnglesRight,
  faBook,
  faC, faCheck,
  faN,
  faSliders,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
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
import PlaylistPreview from '@/components/PlaylistPreview.vue'

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
    isProcessing: false,
    isEmpty: false,
    isFilter: false,
    isPagination: false
  },
  response: {
    videos: [],
    playlists: [],
    count_videos: 0,
    count_playlists: 0
  },
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
  objects_count: 0,
  current_page: 1,
  input_page: ''
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

  const result = await apiFetch('POST', `/video/search/start/${data.value.response.videos.length}/count/5`, data.value.form)

  if (result) {
    data.value.status.isResponse = true
  }

  requestPage(result)
})

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

  data.value.form.categories = []
  data.value.form.tags = []
  data.value.form.type = 'all'

  radio.checked = true
}

const submitFilter = async () => {
  data.value.response.videos = []
  data.value.response.playlists = []
  const result = await apiFetch('POST', `/video/search/start/0/count/5`, data.value.form)
  requestPage(result)
}

const fillVideos = (videos) => {
  videos.forEach(v => {
    v.isHover = false
    v.isMuted = true
    v.isPlaying = false
    v.time = null
    v.progress = Number
    v.length = Number
    v.created_at = relativeTime(v.created_at)
    data.value.response.videos.push(v)
  })
}

const changePosition = async (pos) => {
  data.value.status.isPagination = false
  data.value.status.isResponse = false
  data.value.response.videos = []
  data.value.response.playlists = []
  data.value.current_page = pos
  console.log(pos)
  const result = await apiFetch('POST', `/video/search/start/${(data.value.current_page * 5) - 5}/count/5`, data.value.form)
  requestPage(result)
  data.value.status.isResponse = true
}

const requestPage = (result) => {
  data.value.status.isEmpty = false
  if (result.data) {
    if (result.data.videos) {
      fillVideos(result.data.videos)
    }
    if (result.data.playlists) {
      result.data.playlists.forEach((playlist) => {
        playlist.isHover = false
        playlist.isClicked = false
        data.value.response.playlists.push(playlist)
      })
    }

    if (result.data.length === 0) {
      data.value.status.isEmpty = true
    }

    if (result.data.count_playlists) {
      data.value.response.count_playlists = result.data.count_playlists
      data.value.objects_count = result.data.count_playlists
    }

    if (result.data.count_videos) {
      data.value.response.count_videos = result.data.count_videos
      data.value.objects_count += result.data.count_videos
    }

    if (data.value.objects_count !== 0) {
      (data.value.objects_count / 5) % 1 !== 0 ? data.value.objects_count = Math.floor(data.value.objects_count / 5) + 1 :  data.value.objects_count = Math.floor(data.value.objects_count / 5)
    }

    if (result.data.count_videos === 0 && result.data.count_playlists === 0 || result.data.length === 0) {
      data.value.status.isEmpty = true
      data.value.status.isUploading = false
    }
  }

  if (result.playlists) {
    result.playlists.forEach((playlist) => {
      playlist.isHover = false
      playlist.isClicked = false
      data.value.response.playlists.push(playlist)
    })
  }

  if (result.videos) {
    fillVideos(result.videos)
    data.value.status.isEmpty = false
  }
}

const inputPage = () => {
 if (data.value.input_page === '' || data.value.input_page % 1 !== 0) {
   return
 }
  if (data.value.input_page > data.value.objects_count) {
    changePosition(data.value.objects_count)
  }
  else if (data.value.input_page < 1) {
    changePosition(1)
  }
  else {
    changePosition(data.value.input_page)
  }
  data.value.status.isPagination = false
}

</script>

<template>
  <div class="p-3 w-full">
    <div class="flex gap-2 select-none cursor-pointer mb-1 p-2 active:bg-gray-200 rounded-lg"
         @click="data.status.isFilter = toggle(data.status.isFilter)">
      <FontAwesomeIcon :icon="faSliders" />
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
        <ul
          class="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-3 w-full sm:w-auto flex shadow-lg sm:justify-center overflow-y-hidden"
          v-if="data.status.isFilter">
          <li class=" flex flex-col p-4 gap-2 sm:border-r border-gray-200/80 border-b sm:border-b-0">
            <span class="font-medium text-sm mb-0 text-gray-600 select-none">По категории</span>
            <input v-model="data.filter.categoryQuery" type="text" placeholder="Категория"
                   class="border border-gray-300 bg-white rounded-lg p-1 text-xs"
                   @input="data.filter.categories = []; getFiltered(data.filter.allCategories, data.filter.categories, data.filter.categoryQuery)">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [&>*:nth-child(3n+2)]:md:border-x
            [&>*:nth-child(2n+1)]:sm:border-r [&>*:nth-child(2n+1)]:sm:border-gray-300 [&>*:nth-child(3n+2)]:border-gray-300 [&>*:nth-child(2n+1)]:md:border-r-0 ">
              <label :for="`category${category.id}`" v-for="category in data.filter.categories" class="flex gap-2 sm:justify-between items-center cursor-pointer hover:bg-gray-100
              active:bg-gray-200 p-2 select-none"
                     :class="{'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700': category.isChecked}"
                     @click="category.isChecked = toggle(category.isChecked); writeForm(category.isChecked, data.form.categories, category.id)">
                <FontAwesomeIcon :icon="icons[`${category.id}`]" />
                <span class="text-xs break-words line-clamp-1">{{ category.name }}</span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 gap-2">
            <span class="font-medium text-sm mb-0 text-gray-600 select-none">По тегу</span>
            <input v-model="data.filter.tagQuery" type="text" placeholder="Тег"
                   class="border border-gray-300 bg-white rounded-lg p-1 text-xs"
                   @input="data.filter.tags = []; getFiltered(data.filter.allTags, data.filter.tags, data.filter.tagQuery)">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [&>*:nth-child(3n+2)]:md:border-x  [&>*:nth-child(3n+2)]:border-gray-300 w-fit gap-2  select-none">
              <label :for="`tag${tag.id}`" v-for="tag in data.filter.tags" class="relative flex gap-2 justify-between items-center cursor-pointer bg-blue-500 rounded-lg
              font-medium text-white hover:bg-blue-600 active:bg-blue-700 p-1.5"
                     :class="{'bg-indigo-500 hover:bg-indigo-600': tag.isChecked}"
                     @click="sortTags(tag); writeForm(tag.isChecked, data.form.tags, tag.id)">
                <span class="text-[10px] break-words line-clamp-1 px-2">{{ tag.name }}</span>
                <span class="invisible text-xs" :class="{'visible': tag.isChecked}">
                  <FontAwesomeIcon :icon="faXmark" />
                </span>
              </label>
            </div>
          </li>
          <li
            class="flex flex-col p-4 items-start gap-2 font-medium text-gray-500 lg:border-l lg:border-gray-200/80 select-none border-t border-gray-200/80 sm:border-t-0">
            <span class="font-medium text-sm mb-0 text-gray-600">Тип</span>
            <label for="all" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'all'">
              <input type="radio" checked ref="all" name="type" id="all"
                     class="checked:accent-indigo-500 peer cursor-pointer">
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
            <button @click.prevent="resetFilter($refs.all)"
                    class="p-1.5 border-2 border-red-400 rounded-lg text-red-400 text-xs font-medium cursor-pointer hover:bg-gray-100 active:bg-gray-200">
              Сбросить
            </button>
            <button @click.prevent="submitFilter()"
                    class="p-1.5 bg-blue-500 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-blue-600 active:bg-blue-500">
              Подтвердить
            </button>
          </li>
        </ul>
      </transition>

      <PlaylistPreview :playlists="data.response.playlists" />
      <VideoGridView :videos="data.response.videos" :isEmpty="data.status.isEmpty" :isResponse="data.status.isResponse"
                     :isProcessing="data.status.isProcessing"
                     :text="'К сожалению, на ваш поисковый запрос ничего не найдено'" />
      <div v-if="!data.status.isEmpty && data.objects_count && data.objects_count > 1"
           class="relative col-span-full flex items-end justify-center items-center gap-1">
        <div v-if="data.status.isPagination"
             class="absolute top-[-45px] bg-white border-2 border-gray-200  rounded-sm flex flex-row px-1 py-1 gap-2">
          <input v-model="data.input_page" type="number" class="px-2 w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
          <div class="flex gap-1">
            <div @click="inputPage"
              class="px-2 py-0.5 rounded-sm select-none cursor-pointer bg-blue-500 text-white active:bg-blue-700 hover:bg-blue-600">
              <FontAwesomeIcon :icon="faCheck" />
            </div>
            <div @click="data.status.isPagination = false"
                 class="px-2 py-0.5 rounded-sm select-none cursor-pointer bg-blue-500 text-white active:bg-blue-700 hover:bg-blue-600">
              <FontAwesomeIcon :icon="faXmark" />
            </div>
          </div>
        </div>

        <div @click="changePosition(1)"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          <FontAwesomeIcon :icon="faAnglesLeft" />
        </div>
        <div v-if="data.current_page !== 1" @click="changePosition(data.current_page - 1)"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          <FontAwesomeIcon :icon="faAngleLeft" />
        </div>
        <div v-if="data.current_page !== 1" @click="changePosition(1)"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          1
        </div>
        <div v-if="data.current_page === data.objects_count  && data.objects_count > 3 || data.current_page === data.objects_count - 1 && data.objects_count > 3"
             @click="data.status.isPagination ? data.status.isPagination = false : data.status.isPagination = true"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          ...
        </div>
        <div
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer bg-blue-500 text-white active:bg-blue-700 hover:bg-blue-600"
             @click="changePosition(data.current_page)">{{ data.current_page }}
        </div>
        <div v-if="data.current_page !== data.objects_count && data.current_page !== data.objects_count - 1 && data.objects_count > 3"
             @click="data.status.isPagination ? data.status.isPagination = false : data.status.isPagination = true"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          ...
        </div>
        <div v-if="data.current_page !== data.objects_count"
             @click="changePosition(data.objects_count)" class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none
             cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">{{ data.objects_count }}
        </div>
        <div v-if="data.current_page !== data.objects_count"
             @click="changePosition(data.current_page + 1)" class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer
             active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">

          <FontAwesomeIcon :icon="faAngleRight" />
        </div>
        <div @click="changePosition(data.objects_count)"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          <FontAwesomeIcon :icon="faAnglesRight" />
        </div>
      </div>
    </div>
  </div>
</template>

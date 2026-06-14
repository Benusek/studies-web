<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAngleLeft, faAngleRight,
  faAnglesLeft, faAnglesRight,
  faCheck,
  faSliders,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import PlaylistPreview from '@/components/Cards/PlaylistCard.vue'
import VideoPreview from '@/components/Cards/VideoCard.vue'
import NotFound from '@/components/Loaders/NotFound.vue'

const getFiltered = inject('getFiltered')

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
    playlists: []
  },
  filter: {
    categoryQuery: '',
    allCategories: [],
    categories: [],
    tagQuery: '',
    allTags: [],
    tags: []
  },
  form: {
    str: route.params.query,
    categories: [],
    tags: [],
    type: 'all'
  },
  current_page: 1,
  input_page: ''
})
const count = ref(0)
onMounted(async () => {
  const tags = await apiFetch('GET', '/tag')
  if (tags) {
    data.value.filter.allTags = tags
    data.value.filter.tags = tags
  }

  const categories = await apiFetch('GET', '/category')
  if (categories) {
    data.value.filter.allCategories = categories
    data.value.filter.categories = categories
  }

  const result = await apiFetch('POST', `/video/search/start/${data.value.response.videos.length}/count/1`, data.value.form)

  if (result) data.value.status.isResponse = true

  if (!result.count) {
    data.value.status.isEmpty = true
    data.value.status.isUploading = false
  }

  if (result.count) {
    count.value = Math.ceil(result.count / 5)
  }
  requestPage(result)
})

const sortTags = (tag) => {
  data.value.filter.allTags[data.value.filter.allTags.findIndex(obj => obj.id === tag.id)] = data.value.filter.tags[data.value.filter.tags.findIndex(obj => obj.id === tag.id)]
  !tag.isChecked ? tag.isChecked = true : tag.isChecked = false
}

const writeForm = (value, massive, id) => {
  if (value) {
    if (!massive.includes(id)) {
      massive.push(id)
    }
  } else {
    const index = massive.indexOf(id)

    if (index !== -1) {
      massive.splice(index, 1)
    }
  }
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

  const result = await apiFetch(
      'POST',
      '/video/search/start/0/count/5',
      data.value.form
  )
  if (result?.count) {
    console.log(result.count)
    count.value = Math.ceil(result.count / 5)
  }

  requestPage(result)
}

const changePosition = async (pos) => {
  data.value.status.isPagination = false
  data.value.status.isResponse = false
  data.value.response.videos = []
  data.value.response.playlists = []
  data.value.current_page = pos
  const result = await apiFetch('POST', `/video/search/start/${(data.value.current_page * 5) - 5}/count/30`, data.value.form)
  requestPage(result)
  data.value.status.isResponse = true
}

const requestPage = (object) => {
  if (!object) return

  data.value.status.isEmpty = false

  if (object.videos) {
    data.value.response.videos = object.videos
  }

  if (object.playlists) {
    data.value.response.playlists = object.playlists
  }

  if (!object.count) {
    data.value.status.isEmpty = true
  }
}

const inputPage = () => {
  if (!data.value.input_page || data.value.input_page % 1 !== 0) {
    return
  }
  if (data.value.input_page > count.value) {
    changePosition(count.value)
  } else if (data.value.input_page < 1) {
    changePosition(1)
  } else {
    changePosition(data.value.input_page)
  }
  data.value.status.isPagination = false
}

</script>

<template>
  <div class="p-3 w-full">
    <div class="flex gap-2 select-none cursor-pointer mb-1 p-2 active:bg-gray-200 rounded-lg"
         @click="data.status.isFilter = !data.status.isFilter">
      <FontAwesomeIcon :icon="faSliders" />
      <span class="font-medium text-xs">Фильтр</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <ul class="col-span-full grid lg:grid-cols-3 gap-2 p-2 w-full rounded-lg shadow-sm border border-gray-100 bg-gray-300/10"
          v-if="data.status.isFilter">
          <li class="flex flex-col p-4 gap-2">
            <input v-model="data.filter.categoryQuery" type="text" placeholder="Категория"
                   class="w-full px-2 py-1.5 text-sm bg-white rounded-xl border border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                   @input="data.filter.categories = getFiltered(data.filter.allCategories,data.filter.categoryQuery)"/>
            <div class="flex flex-wrap gap-2">
              <label :for="`category${category.id}`" v-for="category in data.filter.categories"
                     class="px-3 py-1.5 rounded-full text-sm border cursor-pointer transition"
                     :class="category.isChecked ? 'bg-zinc-600 border-zinc-500 text-white' : 'bg-white border-zinc-300 hover:border-zinc-400'"
                     @click="category.isChecked = !category.isChecked; writeForm(category.isChecked, data.form.categories, category.id)">
                <span class="text-xs break-words line-clamp-1">{{ category.name }}</span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 gap-2">
            <input v-model="data.filter.tagQuery" type="text" placeholder="Тег"
                   class="w-full px-2 py-1.5 text-sm bg-white rounded-xl border border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                   @input="data.filter.tags = getFiltered(data.filter.allTags, data.filter.tagQuery)">
            <div class="flex flex-wrap gap-1 select-none">
              <label :for="`tag${tag.id}`" v-for="tag in data.filter.tags"  class="px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition"
                     :class="{'bg-indigo-600 hover:bg-indigo-700 text-white ': tag.isChecked}"
                     @click="sortTags(tag); writeForm(tag.isChecked, data.form.tags, tag.id)">
                <span class="break-words line-clamp-1">#{{ tag.name }}</span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 items-start gap-2 font-medium text-gray-500 select-none">
            <span class="font-medium text-sm mb-0 text-gray-600">Тип</span>
            <label for="all" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'all'">
              <input type="radio" checked ref="all" name="type" id="all"
                     class="checked:accent-zinc-500 peer cursor-pointer">
              <span class="peer-checked:text-zinc-500">Все</span>
            </label>
            <label for="video" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'video'">
              <input type="radio" name="type" id="video" class="checked:accent-zinc-500 peer cursor-pointer">
              <span class="peer-checked:text-zinc-500">Видео</span>
            </label>
            <label for="playlist" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'playlist'">
              <input type="radio" name="type" id="playlist" class="checked:accent-zinc-500 peer cursor-pointer">
              <span class="peer-checked:text-zinc-500">Плейлист</span>
            </label>
          </li>
          <li class="col-span-full flex justify-end gap-3 border-t border-zinc-200 p-4">
            <button @click.prevent="resetFilter($refs.all)"
                    class="px-2 py-1.5 font-medium text-sm text-gray-500 hover:bg-gray-100 rounded-sm cursor-pointer active:bg-gray-200">
              Сбросить
            </button>
            <button @click.prevent="submitFilter()"
                    class="p-1.5 bg-gray-600 rounded-sm text-white text-xs font-medium cursor-pointer hover:bg-gray-700 active:bg-gray-500">
              Подтвердить
            </button>
          </li>
        </ul>
      <h2 class="font-semibold text-lg col-span-full mt-4">
        Результаты
      </h2>
      <PlaylistPreview :playlists="data.response.playlists.items" />
      <VideoPreview :videos="data.response.videos.items" :isResponse="data.status.isResponse" :variant="false" />
      <NotFound text="На ваш поисковый запрос ничего не найдено" :isEmpty="data.status.isEmpty" />
      <div v-if="!data.status.isEmpty && count > 1"
           class="relative col-span-full flex items-end justify-center items-center gap-1">
        <div v-if="data.status.isPagination"
             class="absolute top-[-45px] bg-white border-2 border-gray-200  rounded-sm flex flex-row px-1 py-1 gap-2">
          <input v-model="data.input_page" type="number"
                 class="px-2 w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
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
        <div
          v-if="data.current_page === count  && count > 3 || data.current_page === count - 1 && count > 3"
          @click="data.status.isPagination ? data.status.isPagination = false : data.status.isPagination = true"
          class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          ...
        </div>
        <div
          class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer bg-blue-500 text-white active:bg-blue-700 hover:bg-blue-600"
          @click="changePosition(data.current_page)">{{ data.current_page }}
        </div>
        <div
          v-if="data.current_page !== count && data.current_page !== count - 1 && count > 3"
          @click="data.status.isPagination ? data.status.isPagination = false : data.status.isPagination = true"
          class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          ...
        </div>
        <div v-if="data.current_page !== count"
             @click="changePosition(count)" class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none
             cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">{{ count }}
        </div>
        <div v-if="data.current_page !== count"
             @click="changePosition(data.current_page + 1)" class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer
             active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">

          <FontAwesomeIcon :icon="faAngleRight" />
        </div>
        <div @click="changePosition(count)"
             class="border-2 border-gray-200 px-2 py-0.5 rounded-sm select-none cursor-pointer active:bg-gray-100/60 hover:bg-gray-100/30 text-gray-500">
          <FontAwesomeIcon :icon="faAnglesRight" />
        </div>
      </div>
    </div>
  </div>
</template>

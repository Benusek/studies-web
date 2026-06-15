<script setup>

import {inject, onMounted, ref, watch} from 'vue'
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
import InfiniteScroll from "@/components/InfiniteScroll.vue";

const getFiltered = inject('getFiltered')

const route = useRoute()
const data = ref({
  status: {
    isResponse: false,
    isProcessing: false,
    isEmpty: false,

    hasMore: true,
    isFilter: false,
  },
  response: {
    videos: {
      items: []
    },
    playlists: {
      items: []
    }
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
  }
})

watch(
    () => route.params.query,
    async (value) => {
      data.value.form.str = value
      await loadMore(true)
    }
)

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

  await loadMore()
})

const resetSearch = () => {
  data.value.response = {
    videos: {
      items: []
    },
    playlists: {
      items: []
    }
  }

  data.value.status.isEmpty = false
  data.value.status.hasMore = true
  data.value.status.isResponse = false
}

const loadMore = async (reset = false) => {

  if (reset) {
    resetSearch()
  }

  if (
      data.value.status.isProcessing ||
      !data.value.status.hasMore
  ) {
    return
  }

  data.value.status.isProcessing = true

  try {
    const start =
        data.value.response.videos.items.length +
        data.value.response.playlists.items.length

    const result = await apiFetch(
        'POST',
        `/video/search/start/${start}/count/12`,
        data.value.form
    )

    data.value.status.isResponse = true

    if (!result?.count) {
      data.value.status.isEmpty = true
      data.value.status.hasMore = false
      return
    }

    switch (data.value.form.type) {

      case 'video': {
        const items = result.data ?? []

        data.value.response.videos.items.push(...items)

        if (items.length < 12) {
          data.value.status.hasMore = false
        }

        break
      }

      case 'playlist': {
        const items = result.data ?? []

        data.value.response.playlists.items.push(...items)

        if (items.length < 12) {
          data.value.status.hasMore = false
        }

        break
      }

      default: {
        const videos = result.videos?.items ?? []
        const playlists = result.playlists?.items ?? []

        data.value.response.videos.items.push(...videos)
        data.value.response.playlists.items.push(...playlists)

        if (videos.length + playlists.length < 12) {
          data.value.status.hasMore = false
        }

        break
      }
    }
  } finally {
    data.value.status.isProcessing = false
  }
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

const resetFilter = () => {
  data.value.filter.tags.forEach(tag => {
    tag.isChecked = false
  })

  data.value.filter.categories.forEach(category => {
    category.isChecked = false
  })

  data.value.form.categories = []
  data.value.form.tags = []
  data.value.form.type = 'all'

  data.value.filter.tagQuery = ''
  data.value.filter.categoryQuery = ''

  data.value.filter.tags = data.value.filter.allTags
  data.value.filter.categories = data.value.filter.allCategories

  data.value.current_page = 1
}

const toggleCategory = (category) => {
  category.isChecked = !category.isChecked

  writeForm(
      category.isChecked,
      data.value.form.categories,
      category.id
  )
}

const toggleTag = (tag) => {
  tag.isChecked = !tag.isChecked

  writeForm(
      tag.isChecked,
      data.value.form.tags,
      tag.id
  )
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
      <ul class="col-span-full grid lg:grid-cols-3 gap-6 p-5 rounded-3xl border border-zinc-200 bg-white shadow-sm"
          v-if="data.status.isFilter">
          <li class="flex flex-col p-4 gap-2">
            <input v-model="data.filter.categoryQuery" type="text" placeholder="Категория"
                   class="w-full px-2 py-1.5 text-sm bg-white rounded-xl border border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                   @input="data.filter.categories = getFiltered(data.filter.allCategories,data.filter.categoryQuery)"/>
            <div class="flex flex-wrap gap-2">
              <label :for="`category${category.id}`" v-for="category in data.filter.categories" :key="category.id"
                     class="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition"
                     :class="category.isChecked ? 'bg-zinc-900 text-white': 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'"
                     @click="toggleCategory(category)">
                <span class="text-xs break-words line-clamp-1">{{ category.name }}</span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 gap-2">
            <input v-model="data.filter.tagQuery" type="text" placeholder="Тег"
                   class="w-full px-2 py-1.5 text-sm bg-white rounded-xl border border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                   @input="data.filter.tags = getFiltered(data.filter.allTags, data.filter.tagQuery)">
            <div class="flex flex-wrap gap-1 select-none">
              <label :for="`tag${tag.id}`" v-for="tag in data.filter.tags"  class="px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition"
                     :class="tag.isChecked ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'"
                     @click="toggleTag(tag)">
                <span class="break-words line-clamp-1">#{{ tag.name }}</span>
              </label>
            </div>
          </li>
          <li class="flex flex-col p-4 items-start gap-2 font-medium text-gray-500 select-none">
            <span class="font-medium text-sm mb-0 text-gray-600">Тип</span>
            <label for="all" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'all'">
              <input type="radio" checked ref="all" name="type" id="all"
                     class="checked:accent-zinc-900 peer cursor-pointer">
              <span class="peer-checked:text-zinc-500">Все</span>
            </label>
            <label for="video" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'video'">
              <input type="radio" name="type" id="video" class="checked:accent-zinc-500 peer cursor-pointer">
              <span class="peer-checked:text-zinc-900">Видео</span>
            </label>
            <label for="playlist" class="flex gap-2 text-xs cursor-pointer" @click="data.form.type = 'playlist'">
              <input type="radio" name="type" id="playlist" class="checked:accent-zinc-500 peer cursor-pointer">
              <span class="peer-checked:text-zinc-900">Плейлист</span>
            </label>
          </li>
          <li class="col-span-full flex justify-end gap-3 border-t border-zinc-200 p-4">
            <button @click.prevent="resetFilter()"
                    class="px-2 py-1.5 font-medium text-sm text-gray-500 hover:bg-gray-100 rounded-sm cursor-pointer active:bg-gray-200">
              Сбросить
            </button>
            <button @click.prevent="loadMore(true)"
                    class="p-1.5 bg-gray-900 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-gray-800 active:bg-gray-700">
              Подтвердить
            </button>
          </li>
        </ul>
      <h2 v-if="data.response.playlists?.items?.length || data.response.videos?.items?.length" class="font-semibold text-lg col-span-full mt-4">
        Результаты
      </h2>
      <PlaylistPreview :playlists="data.response.playlists.items" />
      <VideoPreview :videos="data.response.videos.items" :isResponse="data.status.isResponse" :variant="false" />
      <NotFound text="На ваш поисковый запрос ничего не найдено" :isEmpty="data.status.isEmpty" />
      <InfiniteScroll v-if="!data.status.isEmpty" :loading="data.status.isProcessing" :has-more="data.status.hasMore" @load="loadMore" />
    </div>
  </div>
</template>

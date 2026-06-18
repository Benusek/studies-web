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
      <ul v-if="data.status.isFilter" class="col-span-full grid lg:grid-cols-3 gap-5 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">

        <li class="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-4">
          <h3 class="text-sm font-semibold text-zinc-900">
            Категории
          </h3>

          <input v-model="data.filter.categoryQuery" type="text" placeholder="Поиск категории" class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-zinc-300" @input="data.filter.categories = getFiltered(data.filter.allCategories, data.filter.categoryQuery)">

          <div class="flex flex-wrap gap-2">
            <label v-for="category in data.filter.categories" :key="category.id" :for="`category${category.id}`" class="cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition-colors" :class="category.isChecked ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'" @click="toggleCategory(category)">
        <span class="line-clamp-1">
          {{ category.name }}
        </span>
            </label>
          </div>
        </li>

        <li class="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-4">
          <h3 class="text-sm font-semibold text-zinc-900">
            Теги
          </h3>

          <input v-model="data.filter.tagQuery" type="text" placeholder="Поиск тега" class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-zinc-300" @input="data.filter.tags = getFiltered(data.filter.allTags, data.filter.tagQuery)">
          <div class="flex flex-wrap gap-2">
            <label v-for="tag in data.filter.tags" :key="tag.id" :for="`tag${tag.id}`" class="cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition-colors" :class="tag.isChecked ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'" @click="toggleTag(tag)">
        <span class="line-clamp-1">
          #{{ tag.name }}
        </span>
            </label>
          </div>
        </li>

        <li class="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-4">
          <h3 class="text-sm font-semibold text-zinc-900">
            Тип контента
          </h3>
          <label for="all" class="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer hover:bg-white transition-colors" @click="data.form.type = 'all'">
            <input type="radio" checked ref="all" id="all" name="type" class="accent-zinc-900 cursor-pointer">
            <span class="text-sm text-zinc-700">
              Все
            </span>
          </label>
          <label for="video" class="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer hover:bg-white transition-colors" @click="data.form.type = 'video'">
            <input type="radio" id="video" name="type" class="accent-zinc-900 cursor-pointer">
            <span class="text-sm text-zinc-700">
              Видео
            </span>
          </label>
          <label for="playlist" class="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer hover:bg-white transition-colors" @click="data.form.type = 'playlist'">
            <input type="radio" id="playlist" name="type" class="accent-zinc-900 cursor-pointer">
            <span class="text-sm text-zinc-700">
              Плейлисты
            </span>
          </label>
        </li>
        <li class="col-span-full flex items-center justify-end gap-3 border-t border-zinc-200 pt-5">
          <button @click.prevent="resetFilter()" class="rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200">
            Сбросить
          </button>
          <button @click.prevent="loadMore(true)" class="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-700">
            Применить фильтры
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

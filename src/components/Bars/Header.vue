<script setup>
import {
  faArrowLeft, faArrowRightFromBracket,
  faBars,
  faFileCirclePlus,
  faGear,
  faList,
  faPlus,
  faSearch,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import apiFetch from '@/helpers/apiFetch.js'
import router from '@/router/index.js'
import { inject, ref } from 'vue'
const api = import.meta.env.VITE_APP_API
const emit = defineEmits(['modal', 'toggle', 'out'])

defineProps({
  role: Number,
  user: {
    photo_file: String,
    name: String,
    login: String,
    email: String
  },
  loading: Boolean
})

const collapse = ref(false)
const nav = ref(null)
const btn = ref(null)
emit('out', nav, btn, () => {
  collapse.value = false
})


const header = ref({
  search: {
    expansions: false,
    value: ''
  }
})

const token = inject('token')

const logout = async () => {
  await apiFetch('GET', '/logout')
  localStorage.clear()
  window.location.replace('/')
}

const sendSearch = async () => {
  const query = header.value.search.value?.trim()

  if (!query) return

  await router.push({
    path: `/search/${encodeURIComponent(query)}`
  })
}

</script>

<template>
  <header class="sticky top-0 z-99 select-none">
    <nav class="bg-zinc-900 text-white">
      <ul class="flex justify-between items-center gap-3 p-2 w-full">
        <li class="flex flex-row items-center gap-2 cursor-pointer justify-center">
          <div class="block sm:hidden" :class="[{'hidden': header.search.expansions}, {'sm:block': !header.search.expansions}]">
            <FontAwesomeIcon :icon="faBars" class="text-md px-4" @click="$emit('toggle','aside')" />
          </div>
          <RouterLink to="/" :class="[{'hidden sm:block': header.search.expansions}, {'sm:block': !header.search.expansions}]">
            <p class="font-pac sm:px-6 text-xl">Studies</p>
          </RouterLink>
        </li>
        <li class="flex-1 max-w-3xl mx-2" :class="{ 'w-full': header.search.expansions }">
          <form @submit.prevent="sendSearch" class="flex items-center">
            <button @click="header.search.expansions = false" v-if="header.search.expansions"
                    class="sm:hidden flex items-center justify-center mr-2 size-10 rounded-full hover:bg-zinc-800 transition">
              <FontAwesomeIcon :icon="faArrowLeft" />
            </button>
            <div class="relative flex-1 sm:block" :class="[{'block':header.search.expansions}, {'hidden':!header.search.expansions}]">
              <FontAwesomeIcon :icon="faSearch" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                  v-model="header.search.value"
                  type="search"
                  placeholder="Поиск видео, плейлистов..."
                  class=" w-full h-11 bg-zinc-800 border border-zinc-700 rounded-l-full pl-11 pr-4 text-sm text-white
                 placeholder:text-zinc-500 outline-none transition" />
            </div>
            <button type="submit" class="sm:block h-11 px-5 rounded-r-full border border-l-0 border-zinc-700 bg-zinc-800
               hover:bg-zinc-700 active:bg-zinc-600 transition"
                    :class="[{'block':header.search.expansions}, {'hidden':!header.search.expansions}]">
              <FontAwesomeIcon :icon="faSearch" class="text-zinc-300" />
            </button>
          </form>
        </li>
        <li>
          <button @click="collapse= !collapse" :class="{'hidden': header.search.expansions}" ref="btn"
                  class="flex sm:flex justify-center items-center cursor-pointer p-2 w-10 h-10">
            <FontAwesomeIcon :icon="faUser" class="text-lg" />
          </button>
          <button @click="header.search.expansions = true"  :class="[{'hidden':header.search.expansions}, {'block':!header.search.expansions}]"
                  class="block sm:hidden sm:block h-11 px-2">
            <FontAwesomeIcon :icon="faSearch" class="text-zinc-300" />
          </button>
        </li>
      </ul>
    </nav>
    <ul v-if="collapse" ref="nav" class="absolute right-0 top-full mt-2 z-50 w-full sm:w-80 overflow-hidden
    rounded-2xl bg-white border border-gray-200 shadow-xl">
      <template v-if="loading">
        <div class="animate-pulse p-4 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-32 bg-gray-200 rounded"></div>
              <div class="h-3 w-24 bg-gray-100 rounded"></div>
              <div class="h-3 w-40 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-3 space-y-2">
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <li v-if="token" class="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <img :src="user.photo_file != null ? `${api}/${user.photo_file}` : '/src/assets/default.png'" class="w-14 h-14
          rounded-full object-cover border border-gray-200 shadow-sm" alt="">
          <div class="flex flex-col min-w-0 flex-1">
            <span class="font-medium text-gray-900 truncate">{{ user.name }}</span>
            <span v-if="user.login" class="text-sm text-gray-500 truncate">@{{ user.login }}</span>
            <span class="text-xs text-gray-400 truncate">{{ user.email }}</span>
          </div>
        </li>
        <li v-if="!token" @click="$emit('modal', 1)" class="flex items-center px-4 py-3
        cursor-pointer hover:bg-gray-50 transition-colors">
          Зарегистрироваться
        </li>
        <li v-if="!token" @click="$emit('modal', 0)" class="flex items-center px-4
        py-3 cursor-pointer hover:bg-gray-50 transition-colors">
          Войти
        </li>
        <li v-if="token">
          <RouterLink to="/settings" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon :icon="faGear" class="w-4 text-gray-500" />
            <span>Личный кабинет</span>
          </RouterLink>
        </li>
        <li v-if="token && role === 1" @click="$emit('modal', 2)" class="flex items-center gap-3
        px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <FontAwesomeIcon :icon="faPlus" class="w-4 text-gray-500" />
          <span>Создать плейлист</span>
        </li>

        <li v-if="token && role === 1">
          <RouterLink to="/video/create"
          class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon :icon="faFileCirclePlus" class="w-4 text-gray-500" />
            <span>Загрузить видео</span>
          </RouterLink>
        </li>

        <li v-if="token && role === 1">
          <RouterLink
              to="/playlists"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon :icon="faList" class="w-4 text-gray-500" />
            <span>Плейлисты</span>
          </RouterLink>
        </li>
        <li v-if="token" class="border-t border-gray-100">
          <button @click="logout" class="w-full flex items-center
          gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors">
            <FontAwesomeIcon :icon="faArrowRightFromBracket" class="w-4 text-red-500"/>
            <span class="text-red-600">
              Выйти
            </span>
          </button>
        </li>
      </template>
    </ul>
  </header>
</template>
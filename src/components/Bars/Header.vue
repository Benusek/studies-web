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
import Loading from '@/components/Loaders/Loading.vue'

const emit = defineEmits(['modal', 'toggle', 'out'])
defineProps({
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
const role = inject('role')

const logout = async () => {
  await apiFetch('GET', '/logout')
  localStorage.clear()
  window.location.replace('/')
}

const sendSearch = async () => {
  if (header.value.search.value) {
    await router.replace(`/search/${header.value.search.value}`)
  }
}

</script>

<template>
  <header class="sticky top-0 z-3 select-none">
    <nav class="bg-gray-100">
      <ul class="flex justify-between items-center gap-3 border-b border-gray-200 p-2 w-full">
        <li class="flex sm:flex flex-row items-center gap-2 cursor-pointer justify-center"
            :class="{'hidden': header.search.expansions}">
          <FontAwesomeIcon :icon="faBars" class="text text-md px-4" @click="$emit('toggle','aside')" />
          <RouterLink to="/" class="flex flex-row items-center gap-1 cursor-pointer">
            <p class="font-pac">Studies</p>
          </RouterLink>
        </li>
        <li class="flex sm:w-120" :class="{'w-full': header.search.expansions}">
          <button @click="header.search.expansions = false"
                  :class="{'flex': header.search.expansions, 'hidden': !header.search.expansions}"
                  type="submit"
                  class="sm:hidden items-center justify-center p-2 p-2 w-10 h-10 text-sm font-medium cursor-pointer">
            <FontAwesomeIcon :icon="faArrowLeft" />
          </button>
          <form @submit.prevent="sendSearch" class="relative w-full font-medium">
            <input v-model="header.search.value" type="search" :class="{'hidden': !header.search.expansions}"
                   class="sm:block p-1.5 ps-3 w-full z-20 text-sm text-gray-500 bg-gray-50 rounded-full
               border border-gray-300 focus:border-gray-400 outline-none" placeholder="Поиск" />
            <button type="submit" class="hidden sm:flex items-center absolute top-0 end-0 p-2 w-10 justify-center h-full text-sm
            sm:rounded-e-full sm:text-white sm:bg-gray-500 sm:hover:bg-gray-500/80 cursor-pointer">
              <FontAwesomeIcon :icon="faSearch" />
            </button>
          </form>
        </li>
        <li>
          <button @click="collapse= !collapse" :class="{'hidden': header.search.expansions}" ref="btn"
                  class="flex sm:flex justify-center items-center cursor-pointer p-2 w-10 h-10">
            <FontAwesomeIcon :icon="faUser" class="text-lg" />
          </button>
          <button @click="header.search.expansions?sendSearch():header.search.expansions = true"
                  class="sm:hidden items-center justify-center p-2 w-10 h-10 text-sm font-medium cursor-pointer ">
            <FontAwesomeIcon :icon="faSearch" />
          </button>
        </li>
      </ul>
    </nav>
    <ul v-if="collapse" ref="nav"
        class="absolute right-0 z-2 rounded-b-xl sm:rounded-bl-xl sm:rounded-br-none ring-1 ring-gray-200
        w-full sm:w-60 md:w-70 h-auto bg-gray-100 cursor-pointer">
      <Loading v-if="loading" class="p-2" :size="10" />
      <li v-else-if="token" class="p-3 flex flex-row gap-2">
        <img
          :src="user.photo_file != null ? `http://videoapi/${user.photo_file}` : '/src/assets/default.png'"
          class="rounded-full shadow-md w-15 aspect-square text-lg m-2 hidden sm:block" alt="">
        <div class="flex flex-col text-lg justify-center rounded-t-xl leading-none gap-1 w-120 sm:w-40">
          <span class="break-words  line-clamp-1">{{ user.name }}</span>
          <div class="flex flex-col">
            <span class="text-xs text-gray-600 break-words  line-clamp-1">
              {{ user.login ? '@' + user.login : null }}
            </span>
            <span class="text-xs text-gray-600 break-words  line-clamp-1">{{ user.email }}</span>
          </div>
        </div>
      </li>
      <li v-if="!token"
          class="p-3 border-b border-gray-300 hover:bg-gray-200 transition-all duration-100 active:bg-gray-300"
          @click="$emit('modal', 1)">
        Зарегистрироваться
      </li>
      <li v-if="!token"
          class="p-3 border-b rounded-b-xl sm:rounded-br-none sm:rounded-bl-xl border-gray-300 hover:bg-gray-200 transition-all duration-100 active:bg-gray-300"
          @click="$emit('modal', 0)">Войти
      </li>
      <li v-if="token"
          class="border-b border-gray-300 hover:bg-gray-200 transition-all duration-100 active:bg-gray-300">
        <RouterLink to="/settings">
          <div class="p-3">
            <FontAwesomeIcon class="flex items-center mr-3" :icon="faGear" />
            <span>Личный кабинет</span>
          </div>
        </RouterLink>
      </li>
      <li v-if="token && role === 1" @click="$emit('modal', 3)"
          class="p-3 border-b border-gray-300 hover:bg-gray-200 transition-all duration-100 active:bg-gray-300">
        <FontAwesomeIcon class="flex items-center mr-3" :icon="faPlus" />
        <span>Создать плейлист</span>
      </li>
      <li v-if="token && role === 1" @click="$emit('modal', 2)"
          class="p-3 border-b border-gray-300 hover:bg-gray-200 transition-all duration-100 active:bg-gray-300">
        <FontAwesomeIcon class="flex items-center mr-3" :icon="faFileCirclePlus" />
        <span>Загрузить видео</span>
      </li>
      <li v-if="token && role === 1"
          class="border-b border-gray-300 hover:bg-gray-200 transition-all duration-100 active:bg-gray-300">
        <RouterLink to="/playlists">
          <div class="p-3">
            <FontAwesomeIcon class="flex items-center mr-3" :icon="faList" />
            <span class="col-span-2">Плейлисты</span>
          </div>
        </RouterLink>
      </li>
      <li v-if="token" class="p-3 hover:bg-gray-200 rounded-b-xl sm:rounded-bl-xl sm:rounded-br-none hover:bg-gray-200 transition-all duration-100
            active:bg-gray-300" @click="logout">
        <FontAwesomeIcon class="flex items-center mr-3" :icon="faArrowRightFromBracket" />
        <span class="col-span-2">Выйти</span>
      </li>
    </ul>
  </header>
</template>
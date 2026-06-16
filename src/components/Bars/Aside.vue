<script setup>

import {
  faArrowDown,
  faArrowRight,
  faArrowUp,
  faChevronRight,
  faGear,
  faList,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons'
import { inject, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  token: String,
  role: Number,
  collapse: Boolean,
  categories: Object,
  subscribe: Array
})

const id = inject('id')
const api = import.meta.env.VITE_APP_API
const getFiltered = inject('getFiltered')
const aside = ref({
  query: '',
  collapse: true
})
</script>

<template>
  <aside :class="[{'hidden sm:block': !collapse}]"
      class="sticky top-26 sm:top-18 z-50 h-[calc(45dvh-1rem)] sm:h-[calc(100dvh-5rem)] bg-white overflow-scroll
      rounded-2xl border border-gray-200 shadow-sm px-4 sm:m-2
      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <ul class="flex flex-col gap-4">
        <li>
          <div class="flex flex-col gap-2 py-2">
            <p class="text-lg font-medium">
              Категории
            </p>
            <input v-model="aside.query" type="text" placeholder="Категория"
                   class="bg-white text-xs rounded-lg border border-gray-300 p-1.5 w-full focus:border-gray-400 outline-none">
          </div>

          <div v-for="category in getFiltered(categories['all'], categories['current'], aside.query)"
               class="hover:bg-gray-200/60 active:bg-gray-200 cursor-pointer rounded-lg">
            <RouterLink :to="`/category/${category.id}`"
                        class="flex text-sm p-2 group items-center rounded-lg
                        hover:bg-neutral-100 transition-all duration-200"
                        >
              <span>{{ category.name }}</span>
            </RouterLink>
          </div>
        </li>
        <li v-if="token && role === 1" class="flex flex-col gap-2">
          <p class="text-lg font-medium">
            Аккаунт
          </p>
          <div>
            <RouterLink :to="`/channel/${id}`"
                        class="flex min-w-10 text-sm p-2 group items-center rounded-lg
                        hover:bg-neutral-100 transition-all duration-200 gap-3">
              <FontAwesomeIcon :icon="faUserCircle" />
              <span>Профиль</span>
            </RouterLink>

            <RouterLink to="/playlists"
                        class="flex min-w-10 text-sm p-2 group items-center rounded-lg
                        hover:bg-neutral-100 transition-all duration-200 gap-3">
              <FontAwesomeIcon :icon="faList" />
              <span>
                Плейлисты
              </span>
            </RouterLink>

            <RouterLink to="/settings/"
                        class="flex min-w-10 text-sm p-2 group items-center rounded-lg
                        hover:bg-neutral-100 transition-all duration-200 gap-3">
              <FontAwesomeIcon :icon="faGear" />
              <span>Настройки</span>
            </RouterLink>
          </div>

        </li>
        <li v-if="token && role === 1 && subscribe.length" class="flex flex-col gap-2">
          <p class="text-lg font-medium">
            Подписки
          </p>
          <div v-for="sub in aside.collapse?subscribe.slice(0, 3):subscribe">
            <RouterLink :to="'/channel/' + sub.id" class="flex flex-row text-sm gap-2
            items-center break-words overflow-hidden line-clamp-1 hover:bg-gray-100 rounded-lg gap-3 p-2">
              <img :src="sub.photo_file ? `${api}/${sub.photo_file}` : '/src/assets/default.png'" alt=""
                   class="rounded-full aspect-square text-lg w-7">
              <span class="break-words line-clamp-1">{{ sub.name }}</span>
            </RouterLink>
          </div>
          <div v-if="aside.collapse && subscribe.length > 3" @click="aside.collapse = false"
               class="flex flex-row shadow-xs p-2 border-b border-gray-200/80 hover:bg-gray-100
                 text-xs font-sans cursor-pointer gap-3 transition-all duration-100 active:bg-gray-200">
            <FontAwesomeIcon :icon="faArrowDown" class="text-md ms-4" />
            <span>Развернуть</span>
          </div>
          <div v-else-if="!aside.collapse && subscribe.length > 3" @click="aside.collapse = true"
               class="flex flex-row p-2 border-b border-gray-200/80 hover:bg-gray-100
                           text-xs font-sans cursor-pointer gap-3 items-center transition-all duration-100 active:bg-gray-200">
            <FontAwesomeIcon :icon="faArrowUp" class="text-md ms-4" />
            <span>Свернуть</span>
          </div>
        </li>
      </ul>
  </aside>
</template>
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
  <aside :class="[{ 'hidden sm:block': !collapse }]" class="sticky top-26 sm:top-18 z-50 h-[calc(45dvh-1rem)] sm:h-[calc(100dvh-5rem)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-y-auto px-3 py-3 sm:m-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

    <div class="flex flex-col gap-6">

      <section class="flex flex-col gap-3">
        <h2 class="text-sm font-semibold text-gray-900 px-2">
          Категории
        </h2>

        <div class="px-2">
          <input v-model="aside.query" type="text" placeholder="Поиск категории" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all">
        </div>

        <div class="flex flex-col gap-1">
          <RouterLink v-for="category in getFiltered(categories['all'], categories['current'], aside.query)" :key="category.id" :to="`/category/${category.id}`" class="flex items-center min-h-10 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
          <span class="line-clamp-1">
            {{ category.name }}
          </span>
          </RouterLink>
        </div>
      </section>

      <div class="border-t border-gray-100"></div>

      <section v-if="token && role === 1" class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-gray-900 px-2">
          Аккаунт
        </h2>

        <div class="flex flex-col gap-1">
          <RouterLink :to="`/channel/${id}`" class="flex items-center gap-3 min-h-11 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <FontAwesomeIcon :icon="faUserCircle" class="text-base" />
            <span>
            Профиль
          </span>
          </RouterLink>

          <RouterLink to="/playlists" class="flex items-center gap-3 min-h-11 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <FontAwesomeIcon :icon="faList" class="text-base" />
            <span>
            Плейлисты
          </span>
          </RouterLink>

          <RouterLink to="/settings" class="flex items-center gap-3 min-h-11 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <FontAwesomeIcon :icon="faGear" class="text-base" />
            <span>
            Настройки
          </span>
          </RouterLink>
        </div>
      </section>

      <div v-if="token && role === 1 && subscribe.length" class="border-t border-gray-100"></div>

      <section v-if="token && role === 1 && subscribe.length" class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-gray-900 px-2">
          Подписки
        </h2>

        <div class="flex flex-col gap-1">
          <RouterLink v-for="sub in aside.collapse ? subscribe.slice(0, 5) : subscribe" :key="sub.id" :to="'/channel/' + sub.id" class="flex items-center gap-3 min-h-11 rounded-xl px-3 hover:bg-gray-100 transition-colors">
            <img :src="sub.photo_file ? `${api}/${sub.photo_file}` : '/src/assets/default.png'" alt="" class="w-8 h-8 rounded-full object-cover shrink-0">

            <span class="text-sm text-gray-700 line-clamp-1">
            {{ sub.name }}
          </span>
          </RouterLink>
        </div>

        <button v-if="aside.collapse && subscribe.length > 5" @click="aside.collapse = false" class="flex items-center gap-3 min-h-11 rounded-xl px-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
          <FontAwesomeIcon :icon="faArrowDown" />
          <span>
          Показать ещё
        </span>
        </button>

        <button v-else-if="!aside.collapse && subscribe.length > 5" @click="aside.collapse = true" class="flex items-center gap-3 min-h-11 rounded-xl px-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
          <FontAwesomeIcon :icon="faArrowUp" />
          <span>
          Скрыть
        </span>
        </button>
      </section>

    </div>

  </aside>
</template>
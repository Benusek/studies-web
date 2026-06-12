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
  role: Number,
  collapse: Boolean,
  categories: Object,
  subscribe: Array
})

const api = import.meta.env.API
const token = inject('token')
const id = inject('id')
const getFiltered = inject('getFiltered')
const aside = ref({
  query: '',
  collapse: true
})
</script>

<template>
  <aside class="z-2 break-words font-medium transition-all duration-500">
    <div
      class="sticky justify-center top-16 sm:h-[calc(100vh-4rem)] overflow-auto sm:flex w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      :class="{'': collapse, 'hidden': collapse}">
      <ul class="flex flex-col pt-3.5 gap-10">
        <li v-if="!collapse">
          <RouterLink to="/">
            <p class="text-md cursor-pointer ps-3.5">
              Категории
            </p>
          </RouterLink>
          <div class="p-3">
            <input v-model="aside.query" type="text" placeholder="Категория"
                   class="bg-white text-xs rounded-full border border-gray-300 p-1.5 w-full focus:border-gray-400 outline-none">
          </div>
          <div v-for="category in getFiltered(categories['all'], categories['current'], aside.query)"
               class="hover:bg-gray-200/60 active:bg-gray-200 cursor-pointer rounded-lg">
            <RouterLink :to="`/category/${category.id}`" class="flex min-w-10 max-w-35 text-xs ps-5 py-1">
              <span class="break-words line-clamp-1">{{ category.name }}</span>
            </RouterLink>
          </div>
        </li>
        <li v-if="token && role === 1" class="flex flex-col gap-1">
            <RouterLink :to="`/channel/${id}`"
                        class="rounded-lg flex items-center p-2 cursor-pointer hover:bg-gray-200/60 active:bg-gray-200"
                        :class="{'flex-col gap-1' : collapse, 'gap-3 ps-4': !collapse}">
              <FontAwesomeIcon :icon="faUserCircle" />
              <p :class="{'text-[8px]': collapse}" class="text-xs text-center">Вы</p>
            </RouterLink>

            <RouterLink to="/playlists"
                        class="rounded-lg flex items-center p-2 cursor-pointer hover:bg-gray-200/60 active:bg-gray-200"
                        :class="{'flex-col gap-1' : collapse, 'gap-3 ps-4': !collapse}">
              <FontAwesomeIcon :icon="faList" />
              <p :class="{'text-[8px]': collapse}" class="text-xs text-center">Плейлисты</p>
            </RouterLink>


            <RouterLink to="/settings/"
                        class="flex items-center p-2 cursor-pointer hover:bg-gray-200/60 active:bg-gray-200 rounded-lg"
                        :class="{'flex-col gap-1' : collapse, 'gap-3 ps-4': !collapse}">
              <FontAwesomeIcon :icon="faGear" />
              <p :class="{'text-[8px]': collapse}" class="text-xs text-center">Личный кабинет</p>
            </RouterLink>
        </li>
        <li v-if="token && role === 1 && subscribe.length" class="flex flex-col gap-1">
          <span class="cursor-pointer"
                      :class="{'flex justify-center': collapse}">
            <p class="text-md" :class="collapse ? 'text-[10px]' : 'ps-3.5'">
              Подписки</p>
          </span>
          <div v-for="sub in aside.collapse?subscribe.slice(0, 3):subscribe">
            <RouterLink :to="'/channel/' + sub.id" class="flex flex-row text-xs gap-2 items-center break-words overflow-hidden line-clamp-1 hover:bg-gray-100 p-1 rounded-lg"
                        :class="{'justify-center': collapse, 'gap-3 ps-4': !collapse}">
              <img :src="sub.avatar ? api + sub.avatar : '/src/assets/default.png'" alt="avatar"
                   class="rounded-full aspect-square text-lg w-7">
              <span class="break-words line-clamp-1"
                    v-if="!collapse">{{ sub.name }}</span>
            </RouterLink>
          </div>
          <div v-if="aside.collapse && subscribe.length > 3" @click="aside.collapse = false"
               :class="!collapse ? 'shadow-xs' : 'shadow-sm rounded-sm mt-2'" class="flex flex-row p-2 border-b border-gray-200/80 hover:bg-gray-100
                 text-xs font-sans cursor-pointer gap-3 transition-all duration-100 active:bg-gray-200">
            <FontAwesomeIcon :icon="faArrowDown" class="text-md ms-4" />
            <span v-if="!collapse">Развернуть</span>
          </div>
          <div v-else-if="!aside.collapse && subscribe.length > 3" @click="aside.collapse = true"
               :class="{'rounded-sm mt-2' : collapse}" class="flex flex-row p-2 border-b border-gray-200/80 hover:bg-gray-100
                           text-xs font-sans cursor-pointer gap-3 items-center transition-all duration-100 active:bg-gray-200">
            <FontAwesomeIcon :icon="faArrowUp" class="text-md ms-4" />
            <span v-if="!collapse">Свернуть</span>
          </div>
        </li>
        <li v-if="token && role === 1" class="pb-10">

        </li>
      </ul>
    </div>
  </aside>
</template>
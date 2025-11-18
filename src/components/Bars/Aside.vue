<script setup>

import { faArrowDown, faArrowUp, faBook, faC, faGear, faList, faN } from '@fortawesome/free-solid-svg-icons'
import { inject, ref } from 'vue'
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  role: Number,
  collapse: Boolean,
  categories: Object,
  subscribe: Array
})

const token = inject('token')
const getFiltered = inject('getFiltered')
const aside = ref({
  query: '',
  collapse: true
})

const icons = {
  1: faWpforms,
  2: faVuejs,
  3: faN,
  4: faNodeJs,
  5: faReact,
  6: faFlutter,
  7: faGolang,
  8: faUnity,
  9: faJava,
  10: faC,
  11: faBook
}
</script>

<template>
  <aside class="z-2 bg-gray-50/45 z-2 min-w-20 break-words transition-all">
    <div
      class="sticky justify-center top-16 sm:h-[calc(100vh-4rem)] overflow-auto sm:flex w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            transition-all duration-200"
      :class="{'sm:w-20': collapse, 'hidden': collapse}">
      <ul>
        <li>
          <RouterLink to="/" :class="{'flex justify-center': collapse}">
            <p class="font-medium text-sm py-2 cursor-pointer transition-all duration-200"
               :class="!collapse ? 'ps-4' : 'text-xs'">
              Категории
            </p>
          </RouterLink>
          <div class="px-3 py-2" v-if="!collapse">
            <input v-model="aside.query" type="text" placeholder="Введите категорию"
                   @input=""
                   class="bg-white text-xs rounded-lg border border-gray-300 p-1 w-full">
          </div>
          <div :class="{'flex flex-col gap-2' : collapse}">
            <div v-for="category in getFiltered(categories['all'], categories['current'], aside.query)"
                 class="transition-all duration-100 hover:bg-gray-100 active:bg-gray-200
                 border-b border-gray-500/10 font-sans cursor-pointer"
                 :class="!collapse ? '' : 'shadow-sm rounded-sm mt-2'">
              <RouterLink :to="`/category/${category.id}`" class="flex gap-3 min-w-10 text-xs p-2">
                <FontAwesomeIcon :icon="icons[`${category.id}`]" class="text-lg ms-3" />
                <span v-if="!collapse">{{ category.name }}</span>
              </RouterLink>
            </div>
          </div>
        </li>
        <li v-if="token && role === 1">
          <RouterLink to="/" class="cursor-pointer" :class="{'flex justify-center': collapse}">
            <p class="font-medium text-sm pt-4 pb-3" :class="!collapse ? 'ps-4' : 'text-xs'">Ваш канал</p>
          </RouterLink>
          <RouterLink to="/playlists" :class="!collapse ? 'shadow-xs' : 'shadow-sm rounded-sm mt-2'"
                      class="flex items-center p-2 cursor-pointer hover:bg-gray-100 gap-3 transition-all duration-100 active:bg-gray-200">
            <FontAwesomeIcon :icon="faList" class="ms-3" />
            <p v-if="!collapse" class="text-xs">Плейлисты</p>
          </RouterLink>
        </li>
        <li v-if="token && role === 1">
          <RouterLink to="/subscribers" class="cursor-pointer"
                      :class="{'flex justify-center': collapse}">
            <p class="font-medium text-sm pt-4 pb-3" :class="collapse ? 'text-xs' : 'ps-4'">
              Подписки</p>
          </RouterLink>
          <div v-for="sub in aside.collapse?subscribe.slice(0, 3):subscribe">
            <RouterLink :to="'/channel/' + sub.id" class="flex flex-row text-xs items-center break-words overflow-hidden line-clamp-1 sm:w-full hover:bg-gray-100
                    transition-all duration-100 active:bg-gray-200">
              <img :src="sub.photo_file ? 'http://videoapi/' + sub.photo_file : '/src/assets/default.png'" alt=""
                   class="ms-2 rounded-full aspect-square w-10 text-lg p-2">
              <span class="w-20 break-words line-clamp-1 hover:bg-"
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
               :class="!collapse ? 'shadow-xs' : 'shadow-sm rounded-sm mt-2'" class="flex flex-row p-2 border-b border-gray-200/80 hover:bg-gray-100
                           text-xs font-sans cursor-pointer gap-3 items-center transition-all duration-100 active:bg-gray-200">
            <FontAwesomeIcon :icon="faArrowUp" class="text-md ms-4" />
            <span v-if="!collapse">Свернуть</span>
          </div>
        </li>
        <li v-if="token && role === 1" class="pb-10">
          <div class="cursor-default" :class="{'flex justify-center': collapse}">
            <p class="font-medium text-sm pt-4 pb-3"
               :class="{'text-xs': collapse, 'ps-4': !collapse}">Прочее</p>
          </div>
          <div :class="{'flex flex-col gap-2' : collapse}">
            <RouterLink to="/settings/"
                        class="flex items-center p-2 cursor-pointer border-b border-gray-500/10 hover:bg-gray-100 gap-3 transition-all duration-100 active:bg-gray-200"
                        :class="!collapse ? 'shadow-xs' : 'shadow-sm rounded-sm'">
              <FontAwesomeIcon :icon="faGear" class="ms-3" />
              <p v-if="!collapse" class="text-xs">Настройки</p>
            </RouterLink>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>
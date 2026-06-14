<script setup>

import Loading from '@/components/Loaders/Loading.vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCheck, faList, faPlus} from "@fortawesome/free-solid-svg-icons";
import {inject} from "vue";

defineEmits(['change'])
defineProps({
  playlists: Array,
  loading: Boolean
})
const link = inject('link')

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="pb-3">
      <h3 class="font-semibold text-lg">
        Сохранить в плейлист
      </h3>
      <p class="text-sm text-gray-500">
        Выберите один или несколько плейлистов
      </p>
    </div>
    <div class="mt-4 flex flex-col gap-2" v-if="playlists.length" v-for="playlist in playlists">
      <button
          @click="$emit('change', playlist)"
          class="max-w-90 group flex items-center justify-between p-3 rounded-xl hover:border-indigo-500
          hover:bg-indigo-50 transition cursor-pointer border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-lg bg-gray-100 flex items-center justify-center p-2">
            <FontAwesomeIcon :icon="faList"/>
          </div>
          <div class="text-left">
            <div class="font-medium line-clamp-2 leading-5 max-w-50">{{ playlist.title }}</div>
            <div class="text-xs text-gray-500">Плейлист</div>
          </div>
        </div>
        <span class="size-6 rounded-lg border flex items-center justify-center"
            :class="playlist.active ? 'bg-indigo-600 text-white' : 'border-gray-300 text-gray-300'">
          <FontAwesomeIcon :icon="faCheck" />
        </span>
      </button>
    </div>
    <template v-else>
      <div class="space-y-3 animate-pulse">
        <div v-for="n in 4" class="h-14 rounded-xl bg-gray-200"/>
      </div>
    </template>
    <button @click="link(3)"
        class="mt-4 w-full flex justify-around items-center rounded-xl border-2 border-gray-300 p-2 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer font-medium hover:text-indigo-500">
      <FontAwesomeIcon :icon="faPlus"/>
      <span>Создать новый плейлист</span>
    </button>
  </div>
</template>
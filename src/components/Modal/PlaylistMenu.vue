<script setup>

import Loading from '@/components/Loaders/Loading.vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";
import {inject} from "vue";

defineEmits(['change'])
defineProps({
  playlists: Array,
  loading: Boolean
})
const link = inject('link')

</script>

<template>
<!--  <div v-if="loading" class="flex justify-center">-->
<!--    <Loading :size="10" />-->
<!--  </div>-->
<!--  <ul v-else class="grid grid-cols-1 p-5 gap-2 overflow-auto">-->
<!--    <button v-if="playlists.length" v-for="playlist in playlists"-->
<!--            @click="$emit('change', playlist)" :disabled="loading"-->
<!--            :class="{'bg-indigo-500 active:bg-indigo-700 hover:bg-indigo-600': playlist.active}"-->
<!--            class="sm:w-auto rounded-lg bg-blue-500 active:bg-blue-700 hover:bg-blue-600-->
<!--              cursor-pointer select-none p-1 font-medium text-sm leading-snug text-white line-clamp-1 break-words text-start-->
<!--              shadow border-2">-->
<!--      {{ playlist.title }}-->
<!--    </button>-->
<!--    <p v-else>-->
<!--      Создайте плейлист, чтобы добавить видео-->
<!--    </p>-->
<!--  </ul>-->
  <div class="flex flex-col h-full">
    <div class="pb-3">
      <h3 class="font-semibold text-lg">
        Сохранить в плейлист
      </h3>

      <p class="text-sm text-gray-500">
        Выберите один или несколько плейлистов
      </p>
    </div>
    <div class="overflow-auto mt-4 flex flex-col gap-2" v-if="playlists.length" v-for="playlist in playlists">
      <button
          @click="$emit('change', playlist)"
          class="group flex items-center justify-between p-3 rounded-xl border-2 border-zinc-500 hover:border-red-500 hover:bg-red-50 transition cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-lg bg-gray-100
             flex items-center justify-center">
            <FontAwesomeIcon :icon="faList"/>
          </div>
          <div class="text-left">
            <div class="font-medium">{{ playlist.title }}</div>
            <div class="text-xs text-gray-500">Плейлист</div>
          </div>
        </div>
        <span class="size-6 rounded-full border flex items-center justify-center"
            :class="playlist.active ? 'bg-red-600 border-red-500 text-white' : 'border-gray-300'">✓
        </span>
      </button>
    </div>
    <template v-else>
      <div class="space-y-3 animate-pulse">
        <div v-for="n in 4" class="h-14 rounded-xl bg-gray-200"/>
      </div>
    </template>
    <button @click="link(3)"
        class="mt-4 w-full
           rounded-xl
           border-2 border-dashed
           border-gray-300
           p-4
           hover:border-red-500
           hover:bg-red-50">
      + Создать новый плейлист
    </button>
  </div>
</template>
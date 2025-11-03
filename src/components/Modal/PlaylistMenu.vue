<script setup>

import Loading from '@/components/Loaders/Loading.vue'

defineEmits(['change'])
defineProps({
  playlists: Array,
  loading: Boolean
})

</script>

<template>
  <div v-if="loading" class="flex justify-center">
    <Loading :size="10" />
  </div>
  <ul v-else class="grid grid-cols-1 p-5 gap-2 overflow-auto">
    <button v-if="playlists.length" v-for="playlist in playlists"
            @click="$emit('change', playlist)" :disabled="loading"
            :class="{'bg-indigo-500 active:bg-indigo-700 hover:bg-indigo-600': playlist.active}"
            class="sm:w-auto rounded-lg bg-blue-500 active:bg-blue-700 hover:bg-blue-600
              cursor-pointer select-none p-2 font-medium text-sm text-white line-clamp-1 break-words text-start
              shadow border-2">
      {{ playlist.title }}
    </button>
    <p v-else>
      Создайте плейлист, чтобы добавить видео
    </p>
  </ul>
</template>
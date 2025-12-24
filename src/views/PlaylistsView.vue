<script setup>
import { onMounted, ref } from 'vue'
import PlaylistPreview from '@/components/Previews/Playlist.vue'
import apiFetch from '@/helpers/apiFetch.js'
import NotFound from '@/components/Loaders/NotFound.vue'

const data = ref({
  isEmpty: false,
  playlists: [],
  menu: 1,
  isProcessing: false
})

onMounted(async () => {
  await pickPlaylists(1)
})

const pickPlaylists = async (menu) => {
  if (data.value.isProcessing) {
    return
  }
  data.value.isProcessing = true
  data.value.menu = menu
  switch (menu) {
    case 1:
      const my = await apiFetch('GET', `/user/${localStorage.getItem('id')}/playlist`)
      examResult(my)
      break
    case 2:
      const other = await apiFetch('GET', `/user/${localStorage.getItem('id')}/collections`)
      examResult(other)
      break
  }

  data.value.isProcessing = false
}

const examResult = (result) => {
  if (result.playlists) {
    data.value.playlists = result.playlists
    data.value.isEmpty = false
  }

  if (result.data) {
    data.value.isEmpty = true
    data.value.playlists = []
  }
  console.log(result)
}

</script>

<template>
  <div class="p-3 w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <div class="col-span-full flex flex-row gap-2 select-none">
        <div v-for="index in 2"
          class="rounded-lg p-1.25 text-xs font-medium cursor-pointer"
          :class="data.menu !== index ? 'ring-gray-400 text-gray-600 active:bg-gray-300 hover:bg-gray-200' : 'text-white bg-blue-400 active:bg-blue-400 hover:bg-blue-300'"
          @click="pickPlaylists(index)">{{ index === 1 ? 'Ваши' : 'Пользователей' }}
        </div>
      </div>
      <NotFound text="Список плейлистов пуст" :isEmpty="data.isEmpty" />
      <PlaylistPreview v-if="data.playlists.length" :playlists="data.playlists" />
    </div>
  </div>
</template>
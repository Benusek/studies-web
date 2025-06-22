<script setup>
import { inject, onMounted, ref } from 'vue'
import PlaylistPreview from '@/components/PlaylistPreview.vue'
import apiFetch from '@/helpers/apiFetch.js'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import NotFound from '@/components/NotFound.vue'

const data = ref({
  id: inject('user-id'),
  isEmpty: false,
  playlists: [],
  menu: 1,
  isProcessing: false
})

onMounted(async() => {
  await pickPlaylists(1)
})

const pickPlaylists = async(menu) => {
  if (data.value.isProcessing) {
    return
  }
  data.value.isProcessing = true
  data.value.menu = menu
  switch (menu) {
    case 1:
      const all = await apiFetch('GET', `/user/${data.value.id}/playlist`)
      examResult(all)
      break
    case 2:
      const my = await apiFetch('GET', `my-playlists`)
      examResult(my)
      break
    case 3:
      const other = await apiFetch('GET', `/user/${data.value.id}/collections`)
      examResult(other)
      break
  }

  data.value.isProcessing = false
}

const examResult = (result) => {
  if (result.playlists){
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
     <div class="rounded-sm p-1 text-white text-xs font-medium cursor-pointer"
          :class="data.menu !== 1 ? 'bg-blue-500 active:bg-blue-700 hover:bg-blue-600' : 'bg-indigo-500 active:bg-indigo-700 hover:bg-indigo-600'"
          @click="pickPlaylists(1)">Все добавленные</div>
      <div class="bg-blue-500 rounded-sm p-1 text-white text-xs font-medium cursor-pointer active:bg-blue-700 hover:bg-blue-600"
           :class="data.menu !== 2 ? 'bg-blue-500 active:bg-blue-700 hover:bg-blue-600' : 'bg-indigo-500 active:bg-indigo-700 hover:bg-indigo-600'"
           @click="pickPlaylists(2)">Ваши</div>
      <div class="bg-blue-500 rounded-sm p-1 text-white text-xs font-medium cursor-pointer active:bg-blue-700 hover:bg-blue-600"
           :class="data.menu !== 3 ? 'bg-blue-500 active:bg-blue-700 hover:bg-blue-600' : 'bg-indigo-500 active:bg-indigo-700 hover:bg-indigo-600'"
           @click="pickPlaylists(3)">Пользователей</div>
    </div>
    <NotFound :text="'Список плейлистов пуст'" :isEmpty="data.isEmpty" />
    <PlaylistPreview v-if="data.playlists.length !== 0" :playlists="data.playlists"/>
  </div>
  </div>
</template>

<style scoped>

</style>
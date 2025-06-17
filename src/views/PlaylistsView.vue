<script setup>
import { inject, onMounted, ref } from 'vue'
import PlaylistPreview from '@/components/PlaylistPreview.vue'
import apiFetch from '@/helpers/apiFetch.js'

const data = ref({
  id: inject('user-id'),
  playlists: []
})

onMounted(async() => {
  const result = await apiFetch('GET', `/user/${data.value.id}/playlist`)

  if (result.playlists){
    data.value.playlists = result.playlists
  }

  console.log(result)
})


</script>

<template>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 p-3">
    <div class="col-span-full">Мои плейлисты</div>
    <PlaylistPreview :playlists="data.playlists"/>
  </div>
</template>

<style scoped>

</style>
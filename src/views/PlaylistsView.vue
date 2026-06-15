<script setup>
import { onMounted, ref } from 'vue'
import PlaylistPreview from '@/components/Cards/PlaylistCard.vue'
import apiFetch from '@/helpers/apiFetch.js'
import NotFound from '@/components/Loaders/NotFound.vue'
import PlaylistsSkeleton from "@/components/Loaders/PlaylistsSkeleton.vue";

const data = ref({
  isEmpty: false,
  playlists: [],
  menu: 1,
  isResponse: false
})

onMounted(async () => {
  await pickPlaylists(1)
})

const pickPlaylists = async (menu) => {
  data.value.isResponse = false
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

  data.value.isResponse = true
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
  <PlaylistsSkeleton v-if="!data.isResponse" />
  <div v-else class="p-2 w-full">
    <section class="mb-4">
      <div class="inline-flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm gap-2 flex">
        <button v-for="index in 2" :key="index" @click="pickPlaylists(index)" class="h-10 rounded-xl px-5 text-sm font-medium transition cursor-pointer"
                :class="data.menu === index ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'">
          {{ index === 1 ? 'Ваши' : 'Пользователей' }}
        </button>
      </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-3xl border border-zinc-200 bg-white p-4">
      <NotFound text="Список плейлистов пуст" :isEmpty="data.isEmpty" />
      <PlaylistPreview v-if="data.playlists.length" :playlists="data.playlists" />
    </section>
  </div>
</template>
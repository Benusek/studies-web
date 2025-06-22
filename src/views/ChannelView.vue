<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import apiFetch from '@/helpers/apiFetch.js'
import NotFound from '@/components/NotFound.vue'
import VideoGridView from '@/components/VideoGridView.vue'
const route = useRoute()

const id = route.params.id
const myId = inject('user-id')
const getRelativeTime = inject('getRelativeTime')
const user = ref({})
const videos = ref([])
const playlists = ref([])
const isEmpty = ref(false)
const page = ref(1)
const text = ref('')
const other = ref(true)
const isProcessing = ref(true)
const isResponse = ref(false)
// const userId = inject('user-id')
onMounted(async () => {
  const result = await apiFetch('GET', `/user/${id}/videos`)
  if (parseInt(myId.value) === parseInt(result.user.id)) {
    other.value = false
  }

  if (result.user) {
    user.value = result.user
  }
  if (result.videos) {
    videos.value = result.videos
    isResponse.value = true
  }

  const result2 = await apiFetch('GET', `/user/${myId.value}`)
  if (result2.data) {

    if (result2.data.subscribe.findIndex((obj) => obj.id === user.value.id) !== -1) {
      user.value.isSubscribe = true
    }
  }

  if (!result.videos?.length || result.data) {
    isEmpty.value = true
    text.value = 'Список видео пуст '
  }
})

const switchPage = async(value) => {
  videos.value = []
  playlists.value = []
  switch (value) {
    case 1:
      const result = await apiFetch('GET', `/user/${id}/videos`)
      if (result.videos) {
        isEmpty.value = false
        videos.value = result.videos
      }
      if (!result.videos.length || result.data) {
        isEmpty.value = true
        text.value = 'Список видео пуст'
      }
      page.value = 1
      break
    case 2:
      const result2 = await apiFetch('GET', `/user/${id}/playlist`)
      if (result2.playlists) {
        isEmpty.value = false
        playlists.value = result2.playlists
      }
      if (!result2.playlists?.length || result2.data) {
        isEmpty.value = true
        text.value = 'Список плейлистов пуст'
      }
      page.value = 2
      break
  }

}

const FollowingUser = async() => {
  if(user.value.isSubscribe) {
    const unfollow = await apiFetch('DELETE', `/user/${user.value.id}/unfollow`)
    if (unfollow) {
      user.value.isSubscribe = false
    }
  }
  else {
    const follow = await apiFetch('GET', `/user/${user.value.id}/follow`)
    if (follow) {
      user.value.isSubscribe = true
    }
  }
}

</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-col sm:flex-row bg-gray-100/80 p-2 justify-between items-center gap-2">
      <div class="flex flex-row gap-2">
        <img class="rounded-full w-12 aspect-square"
             :src="user.photo_file ? 'http://videoapi/'+ user.photo_file : '/src/assets/default.png' "
             alt="user">
        <div class="flex flex-col">
          <span class="text-lg">{{user.name}}</span>
          <span class="text-xs text-gray-500">Отслеживают {{user.subscribers_count}}</span>
        </div>
      </div>

      <div v-if="!user.isSubscribe && other" @click="FollowingUser"
           class="px-2 py-1 text-xs text-white bg-blue-500 rounded-sm cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none">
        Подписаться
      </div>
      <div v-else-if="user.isSubscribe && other" @click="FollowingUser"
           class="py-1 px-2 text-xs text-red-400 border border-red-400 rounded-sm font-medium cursor-pointer hover:bg-gray-100 active:bg-gray-200/60 select-none">
        Отписаться
      </div>
    </div>
    <div class="flex flex-row border-b border-gray-300 shadow-sm">
      <div class="text-sm font-medium py-1 px-2  cursor-pointer select-none" @click="switchPage(1)"
           :class="page === 1 ? 'text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700': 'bg-gray-100/80 hover:bg-gray-200 active:bg-gray-300 text-gray-600'">Видео</div>
      <div class="text-sm font-medium py-1 px-2 border-x border-gray-300 cursor-pointer select-none" @click="switchPage(2)"
           :class="page === 2 ? 'text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700': 'bg-gray-100/80 hover:bg-gray-200 active:bg-gray-300 text-gray-600'">Плейлисты</div>
    </div>
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 h-auto p-2">
        <VideoGridView :videos="videos" :text="text" :isEmpty="isEmpty" :isProcessing="isProcessing" :isResponse="isResponse"/>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>
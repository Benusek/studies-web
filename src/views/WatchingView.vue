<script setup>

import { useRoute } from 'vue-router'
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Loading from '@/components/Loaders/Loading.vue'
import Video from '@/components/Loaders/Video.vue'
import Hls from 'hls.js'
import VideoPreview from '@/components/Previews/VideoCard.vue'

const getVideoPlaylistModal = inject('getVideoPlaylistModal')
const api = import.meta.env.VITE_APP_API
const route = useRoute()
const videoId = route.params.video

const data = ref({
  comment: {
    text: ''
  },
  answer: {
    text: ''
  }
})

const token = inject('token')
const id = inject('id')
const avatar = inject('avatar')

const isResponse = ref(false)
const comments = ref([])
const videoData = ref([])
onMounted(async () => {
  const result = await apiFetch('GET', `/video/${videoId}`)
  if (result) {
    videoData.value = result
  } else return
  if (token && result) {
    // if (subscribes.value && subscribes.value.findIndex((obj) => obj.id === videoData.value.video.user.id) !== -1) {
    //   videoData.value.video.user.isSubscribe = true
    // }
  }
  await getComments()
  isResponse.value = true
})

watch(isResponse, async (value) => {
  if (!value) return
  await nextTick()
  const player = document.getElementById('playerId')
  if (Hls.isSupported()) {
    const hls = new Hls({ autoStartLoad: true })
    hls.loadSource(`${api}/${videoData.value.video.video}`)
    hls.attachMedia(player)
  } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
    player.src = ''
    player.addEventListener('loadedmetadata', () => {
      player.play()
    })
  }
})

const getComments = async () => {
  const result = await apiFetch('GET', `/video/${videoId}/comment`)
  if (result.comments || result.data) comments.value = result.comments
}


const FollowingUser = async () => {
  if (videoData.value.video.user.subscribed) {
    const unfollow = await apiFetch('delete', `/user/${videoData.value.video.user.id}/unfollow`)
    if (unfollow.status) videoData.value.video.user.subscribed = false
  } else {
    const follow = await apiFetch('get', `/user/${videoData.value.video.user.id}/follow`)
    if (follow.status) videoData.value.video.user.subscribed = true
  }
}

const sendCommentForm = async () => {
  const result = await apiFetch('POST', `/video/${videoId}/comment`, data.value.comment)
  if (result.data) {
    await getComments()
    data.value.comment.text = ''
  }
}

const sendAnswerForm = async (comment) => {
  const result = await apiFetch('POST', `/comment/${comment.id}/answer`, data.value.answer)
  if (result.data) {
    await getComments()
    data.value.answer.text = ''
  }
}

const deleteCommentForm = async (comment) => {
  const result = await apiFetch('DELETE', `/comment/${comment.id}`)
  if (result.data.status) await getComments()
}

const answered = (index) => {
  switch (comments.value[index].isAnswer) {
    case true: {
      comments.value[index].isAnswer = false
      break
    }
    default: {
      comments.value[index].isAnswer = true
      break
    }
  }
  comments.value.forEach((item, i) => {
    if (i !== index) item.isAnswer = false
  })
  data.value.answer.text = null
}

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full">
    <div v-if="!isResponse" class="sm:col-span-3 flex justify-center items-center">
      <Loading :size="10" />
    </div>
    <div v-else class="flex flex-col gap-2 p-2 col-span-3">
      <video controls ref="player" id="playerId" class="aspect-[16/9] bg-black rounded-lg">
        <source />
      </video>
      <span class="text-lg font-medium">{{ videoData.video.title }}</span>
      <div class="flex flex-row items-center justify-between">
        <div class="flex gap-2">
          <RouterLink :to="'/channel/' + videoData.video.user.id"
                      class="flex flex-row items-top leading-none flex gap-2">
            <img class="rounded-full w-10 aspect-square"
                 :src="videoData.video.user.avatar ? `${api}/${videoData.video.user.avatar}` : '/src/assets/default.png'"
                 alt="user">
            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ videoData.video.user.name }}</span>
              <span
                class="text-xs font-sans text-gray-500">{{ videoData.video.user.subscribers.count }} подписчиков</span>
            </div>
          </RouterLink>
          <div v-if="videoData.video.user.id !== parseInt(id) && id" class="flex flex-row items-center font-medium"
               @click="FollowingUser">
            <div v-if="!videoData.video.user.subscribed"
                 class="p-1.5 text-xs lg:text-sm text-white bg-gray-500 rounded-xl cursor-pointer hover:bg-gray-600 active:bg-gray-700 select-none">
              Подписаться
            </div>
            <div v-else
                 class="p-1.25 text-xs lg:text-sm text-red-700 ring ring-red-700 rounded-xl cursor-pointer hover:bg-red-700/5 active:bg-gray-200/60 select-none">
              Отписаться
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-3 items-center font-medium">
          <div @click="getVideoPlaylistModal(videoData)"
               class="text-xs lg:text-sm text-gray-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-gray-400 hover:bg-gray-200/70 active:bg-gray-200">
            Сохранить
          </div>
        </div>
      </div>
      <div class="flex flex-col border-gray-300 p-2 rounded-xl border bg-gray-100">
        <span class="text-xs text-gray-600 font-medium">Видео добавлено {{ videoData.video.created_at }}</span>
        <span class="text-sm text-gray-600">{{ videoData.video.description }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <span class=" font-medium text-lg">Комментарии</span>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2 w-full" v-if="id">
            <img class="rounded-full size-8 aspect-square"
                 :src="avatar ? `${api}/${avatar}` : '/src/assets/default.png'"
                 alt="user">
            <input type="text" placeholder="Оставить комментарий..." v-model="data.comment.text"
                   @keyup.enter="sendCommentForm"
                   class="outline-none focus:border-b-gray-500 border-b border-gray-200 text-sm p-1 w-full focus:border-white">
          </div>
          <div v-if="!comments" class="">Комментариев пока нет. Будьте первым, кто оставит комментарий!</div>
          <div v-if="data.comment.text" class="flex flex-row gap-2 justify-end w-full">
            <div @click="sendCommentForm"
                 class="text-xs font-medium lg:text-sm text-gray-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-gray-400 hover:bg-gray-200/70 active:bg-gray-200">
              Отправить
            </div>
            <div @click="data.comment.text = null"
                 class="text-xs font-medium lg:text-sm text-gray-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-gray-400 hover:bg-gray-200/70 active:bg-gray-200">
              Отмена
            </div>
          </div>
        </div>
      </div>
      <ul v-for="(comment, index) in comments" class="flex flex-col gap-2.5">
        <li class="flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            <img class="rounded-full size-8 aspect-square"
                 :src="comment.user.avatar ? `${api}/${comment.user.avatar}` : '/src/assets/default.png'"
                 alt="user">
            <div class=" w-full">
              <div class="flex flex-row text-sm items-center justify-between">
                <div class="flex items-center gap-2 text-xs">
                  <span class="font-medium">{{ comment.user.name }}</span>
                  <span class="text-gray-500">{{ comment.created_at }}</span>
                </div>
                <div v-if="token && parseInt(comment.user.id) === parseInt(id)" @click="deleteCommentForm(comment)"
                     class="py-1.5 px-2.25 text-gray-600 text-xs rounded-full cursor-pointer active:text-white hover:text-red-700 hover:inset-ring-1 hover:ring-red-700 active:bg-red-600">
                  <FontAwesomeIcon :icon="faTrash" />
                </div>
              </div>
              <span class="text-xs break-words">{{ comment.text }}</span>
            </div>
          </div>
          <div class="flex flex-row gap-2">
            <div @click="answered(index)" v-if="id"
                 class="text-xs font-medium text-gray-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-gray-400 hover:bg-gray-200/70 active:bg-gray-200">
              Ответить
            </div>
            <div v-if="comment.answers.length"
                 class="text-xs font-medium text-blue-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-blue-400 hover:bg-blue-100/30 active:bg-blue-100"
                 @click="comment.openAnswers ? comment.openAnswers = false : comment.openAnswers = true">
              <span v-if="!comment.openAnswers">Ответы</span>
              <span v-else>Свернуть</span>
            </div>
          </div>
        </li>
        <li v-if="comment.isAnswer" class="flex flex-col gap-2 ms-6">
          <div class="flex gap-2 w-full items-center">
            <img class="rounded-full size-6 aspect-square"
                 :src="avatar ? `${api}/${avatar}` : '/src/assets/default.png'" alt="user">
            <input type="text" placeholder="Оставить ответ..." v-model="data.answer.text"
                   @keyup.enter="sendAnswerForm(comment)"
                   class="outline-none focus:border-b-gray-500 border-b border-gray-200 text-sm p-1 w-full focus:border-white">
          </div>
          <div class="flex gap-2 w-full justify-end">
            <div @click="sendAnswerForm(comment)"
                 class="text-[10px] font-medium lg:text-xs text-gray-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-gray-400 hover:bg-gray-200/70 active:bg-gray-200">
              Отправить
            </div>
            <div @click="data.answer.text = null; comment.isAnswer = false"
                 class="text-[10px] font-medium lg:text-xs text-gray-500 p-1.25 rounded-xl select-none cursor-pointer ring-1 ring-gray-400 hover:bg-gray-200/70 active:bg-gray-200">
              Отмена
            </div>
          </div>
        </li>
        <li v-if="comment.answers && comment.openAnswers" class="ms-6 flex flex-row w-full"
            v-for="answer in comment.answers">
          <div class="flex gap-2 items-start w-full">
            <img class="rounded-full size-6 aspect-square"
                 :src="answer.user.avatar ? `${api}/${answer.user.avatar}` : '/src/assets/default.png'"
                 alt="user">
            <div class="w-full overflow-hidden">
              <div class="flex gap-2 text-sm items-center justify-between">
                <div class="flex gap-2 items-center text-[10px]">
                  <span class="font-medium">{{ answer.user.name }}</span>
                  <span class="text-gray-500">{{ answer.created_at }}</span>
                </div>
              </div>
              <span class="text-xs break-words">{{ answer.text }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-2 px-2 pt-2" v-if="!isResponse || videoData.recommendations.length">
      <span class="text-lg font-medium">Похожее</span>
      <VideoPreview :videos="videoData.recommendations" :isResponse="isResponse" />
    </div>
  </div>
</template>
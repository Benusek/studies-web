<script setup>

import { useRoute, useRouter } from 'vue-router'
import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import VideoGridView from '@/components/VideoGridView.vue'
import Loading from '@/components/Loaders/Loading.vue'

const api = import.meta.env.VITE_APP_API
const route = useRoute()
const router = useRouter()
const relativeTime = inject('getRelativeTime')
const isResponse = ref(false)
const getVideoPlaylistModal = inject('getVideoPlaylistModal')
const photo = ref('')
const videoId = route.params.video
const data = ref({
  commentators: [],
  video: '',
  forms: {
    comment: {
      text: ''
    },
    answer: {
      text: ''
    }
  },
  videos: [],
  isVideoResponse: false
})
const comments = ref([])
const isEmpty = ref(false)
const video = ref({})
const author = ref({})

const id = localStorage.getItem('id')
const token = inject('token')
onMounted(async () => {
  const result = await apiFetch('GET', `/video/${videoId}`)
  if (result.videos) {
    video.value = JSON.parse(JSON.stringify(result.videos))
    author.value = JSON.parse(JSON.stringify(result.videos.user))
    video.value.created_at = relativeTime(video.value.created_at)
  }
  else {
    await router.replace(`/`)
  }
  if (id) {
    const result2 = await apiFetch('GET', `/user/${id}`)
    if (result2.data) {
      photo.value = result2.data.photo_file
      if (result2.data.subscribe.findIndex((obj) => obj.id === author.value.id) !== -1) {
        author.value.isSubscribe = true
      }
    }
  }


  const result3 = await apiFetch('GET', `/video/${videoId}/recommendation`)
  if (result3) {
    result3.videos.forEach((v) => {
      v.created_at = relativeTime(v.created_at)
      console.log(1)
      data.value.videos.push(v)
    })
    data.value.isVideoResponse = true
  }

  await getComments()
  if (result) {
    isResponse.value = true
  }
})

const getComments = async() => {
  const result = await apiFetch('GET', `/video/${videoId}/comment`)

  if (result.comments) {
    comments.value = result.comments
    comments.value.forEach((comment) => {
      comment.created_at = relativeTime(comment.created_at)
      comment.openAnswers = false
      comment.answers.forEach((a) => {
        a.created_at = relativeTime(a.created_at)
      })
      comment.isAnswer = false
    })
  }

  if (result.data) {
    isEmpty.value = true
  }
}

const FollowingUser = async() => {
  if(author.value.isSubscribe) {
    const unfollow = await apiFetch('DELETE', `/user/${author.value.id}/unfollow`)
    if (unfollow) {
      author.value.isSubscribe = false
    }
  }
  else {
    const follow = await apiFetch('GET', `/user/${author.value.id}/follow`)
    if (follow) {
      author.value.isSubscribe = true
    }
  }
}

const sendCommentForm = async() => {
  const result = await apiFetch('POST', `/video/${videoId}/comment`, data.value.forms.comment)
  if (result.data) {
    await getComments()
    data.value.forms.comment.text = ''
  }
}

const sendAnswerForm = async(comment) => {
  const result = await apiFetch('POST', `/comment/${comment.id}/answer`, data.value.forms.answer)
  if (result.data) {
    await getComments()
    data.value.forms.answer.text = ''
  }
}

const deleteCommentForm = async(comment) => {
  const result = await apiFetch('DELETE', `/comment/${comment.id}`)
  if (result.data) {
    await getComments()
  }
}

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full">
    <div v-if="!isResponse" class="sm:col-span-3 flex justify-center items-center">
      <Loading :size="10"/>
    </div>
    <div class="sm:col-span-3 bg-gray-100/20 my-5" v-else>
      <video controls autoplay :class="'w-full'" v-if="video.video_file" muted>
        <source :src="`${api}/${video.video_file}`" type="video/mp4">
      </video>
      <span class="ps-2 text-lg font-medium">{{ video.title }}</span>

      <div class="flex justify-between items-center p-3">
        <div class="flex flex-row items-center gap-15">
          <div>
            <RouterLink :to="'/channel/' + author.id" class="flex flex-row items-center leading-none flex gap-2">
              <img class="rounded-full w-10 aspect-square"
                   :src="author.photo_file ? `${api}/${author.photo_file}` : '/src/assets/default.png' "
                   alt="user">
              <span class="text-sm">{{ author.name }}</span>
            </RouterLink>
          </div>
          <div class="flex flex-row items-center" @click="FollowingUser">
            <div v-if="!author.isSubscribe"
              class="px-2 py-1 text-xs text-white bg-blue-500 rounded-sm cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none">
              Подписаться
            </div>
            <div v-else
              class="py-1 px-2 text-xs text-red-400 border border-red-400 rounded-sm font-medium cursor-pointer hover:bg-gray-100 active:bg-gray-200/60 select-none">
              Отписаться
            </div>
          </div>

        </div>
        <div class="flex flex-row gap-3 items-center">
          <div @click="getVideoPlaylistModal(video)"
            class="text-xs bg-white text-gray-500 px-2 py-1 rounded-lg select-none cursor-pointer border border-gray-400 hover:bg-gray-100 active:bg-gray-200">
            Добавить в плейлист
          </div>
        </div>

      </div>
      <div
        class="flex flex-col border-gray-300 m-2 p-2 relative bg-gray-100 rounded-sm border border-gray-300 shadow-sm">
        <span
          class="text-xs absolute top-[-10px] left-[-1px] text-gray-400 bg-gray-100 rounded-t-sm px-2 border-x border-t border-gray-300 select-none">Описание</span>
        <span class="text-xs text-gray-600 font-medium">Видео добавлено {{ video.created_at }}</span>
        <span class="text-sm text-gray-600">{{ video.description }}</span>
      </div>
      <div class="px-2 flex flex-col">
        <span class="pb-2">Комментарии</span>
        <div class="flex flex-row items-center leading-none flex gap-2">
          <img class="rounded-full w-8 aspect-square"
               :src="photo ? `${api}/${photo}` : '/src/assets/default.png' "
               alt="user">
          <input type="text" placeholder="Оставить комментарий..." v-model="data.forms.comment.text"
                 class=" border-b border-gray-200 text-sm p-1 w-full focus:border-white">
          <div v-if="data.forms.comment.text" @click="sendCommentForm"
            class="border text-xs py-1 px-2 rounded-lg cursor-pointer border-gray-400 text-gray-500 select-none hover:bg-gray-100 active:bg-gray-200">
            Отправить
          </div>
        </div>
      </div>
      <div v-if="comments">
        <div v-for="comment in comments">
          <div class="flex gap-2 p-2 items-center">
            <img class="rounded-full w-8 aspect-square"
                 :src="comment.user.photo_file ? `${api}/${comment.user.photo_file}` : '/src/assets/default.png' "
                 alt="user">
            <div class=" w-full">
              <div class="flex flex-row text-sm items-center justify-between">
                <div class="flex items-center gap-2">
                  <span>{{ comment.user.name }}</span>
                  <span class="text-xs text-gray-500">{{ comment.created_at }}</span>
                </div>

                <template v-if="token">
                  <div v-if="parseInt(comment.user.id) === parseInt(id)" @click="deleteCommentForm(comment)"
                       class="py-1 px-2 text-white text-[12px] bg-red-500 rounded-sm cursor-pointer hover:bg-red-600 active:bg-red-700">
                    <FontAwesomeIcon :icon="faTrash" />
                  </div>
                </template>
              </div>
              <span class="text-xs break-words">{{ comment.text }}</span>
            </div>
          </div>
          <div class="flex flex-row gap-2 ms-2">
            <div
              @click="comment.isAnswer ? comment.isAnswer = false : comment.isAnswer = true"
              class="select-none cursor-pointer hover:bg-gray-100/20 rounded-sm active:bg-gray-200/50 w-fit text-xs text-gray-500 p-1 border border-gray-500">
              Ответить
            </div>
            <div v-if="comment.answers.length"
                 class="select-none cursor-pointer hover:bg-gray-100/20 rounded-sm active:bg-gray-200/50 w-fit text-xs text-blue-500 font-medium p-1 border border-blue-500"
                 @click="comment.openAnswers ? comment.openAnswers = false : comment.openAnswers = true">
              <span v-if="!comment.openAnswers">Ответы</span>
              <span v-else>Свернуть</span>
            </div>
          </div>
          <div v-if="comment.isAnswer" class="flex flex-row items-center leading-none flex gap-2 ms-2 mt-2">
            <img class="rounded-full w-4 aspect-square"
                 :src="photo ? `${api}/${photo}` : '/src/assets/default.png' "
                 alt="user">
            <input type="text" placeholder="Оставить ответ..." v-model="data.forms.answer.text"
                   class=" border-b border-gray-200 text-sm p-1 w-full focus:border-white">
            <div @click="sendAnswerForm(comment)" v-if="data.forms.answer.text"
              class="border text-xs py-1 px-2 rounded-lg cursor-pointer border-gray-400 text-gray-500 select-none hover:bg-gray-100 active:bg-gray-200">
              Отправить
            </div>
          </div>

          <div v-if="comment.answers && comment.openAnswers" class="ms-5 flex flex-row w-full"
               v-for="answer in comment.answers">
            <div class="flex gap-2 p-2 items-start w-full">
              <img class="rounded-full w-6 aspect-square"
                   :src="answer.user.photo_file ? `${api}/${answer.user.photo_file}` : '/src/assets/default.png' "
                   alt="user">
              <div class="w-full overflow-hidden">
                <div class="flex gap-2 text-sm items-center justify-between">
                  <div class="flex gap-2 items-center">
                    <span>{{ answer.user.name }}</span>
                    <span class="text-xs text-gray-500">{{ answer.created_at }}</span>
                  </div>
                </div>
                <span class="text-xs break-words">{{ answer.text }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
    <div class="mt-5 flex flex-col gap-2" v-if="data.videos">
      <span class="text-lg font-medium f">Похожее</span>
      <VideoGridView :videos="data.videos" :isResponse="data.isVideoResponse" :isEmpty="false" :isProcessing="false" :text="''" />
    </div>

  </div>
</template>
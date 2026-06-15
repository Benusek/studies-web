<script setup>

import { useRoute } from 'vue-router'
import {inject, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Hls from 'hls.js'
import VideoPreview from '@/components/Cards/VideoCard.vue'
import Plyr from 'plyr';
import 'plyr/dist/plyr.css'
import WatchingSkeleton from "@/components/Loaders/WatchingSkeleton.vue";

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
const isReady = ref(false)
const comments = ref([])
const videoData = ref([])

onMounted(async () => {
  const result = await apiFetch('GET', `/video/${videoId}`)

  if (result) {
    videoData.value = result
    console.log(result)
    document.title = result.video.title
    isResponse.value = true
  }

  await getComments()
})

let video = null
let hls = null;
const player = ref(null)

watch(isResponse, async (value) => {
  if (!value) return
  await nextTick()
  const src = `${api}/${videoData.value.video.video}`
  if (Hls.isSupported()) {
    hls = new Hls({ autoStartLoad: true })
    const qualities = [...hls.levels.map(level => level.height)]
    video = new Plyr(player.value, {
      settings: ['quality', 'speed', 'loop'],
      quality: {
        default: qualities[qualities.length - 1],
        options: qualities,
        forced: true,
        onChange: quality => {
          const level = hls.levels.findIndex(item => item.height === quality)
          if (level !== -1) {
            hls.currentLevel = level
          }
        }
      },
      controls: [
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'settings',
        'fullscreen'
      ]
    })

    hls.attachMedia(player.value)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(src)
    })

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      isReady.value = true
    })
  } else {
    player.value.src = src
    video = new Plyr(player.value)
  }
})

onBeforeUnmount(() => {
  video?.destroy()
  hls?.destroy()
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
  <WatchingSkeleton v-if="!isResponse" />
  <div v-if="isResponse" class="flex flex-5 flex-col lg:flex-row p-2">
    <div class="px-2 flex flex-1 grow-[2.5] flex-col gap-4">
      <div class="relative w-full bg-black rounded-lg overflow-hidden">
        <video  ref="player" controls class="aspect-video inset-0 h-full w-full"/>
      </div>
      <h1 class="text-lg sm:text-xl lg:text-2xl font-semibold">
        {{ videoData.video.title }}
      </h1>

      <section class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 lg:flex-row
      lg:items-center lg:justify-between">
        <div class="flex items-center gap-3">
          <RouterLink :to="'/channel/' + videoData.video.user.id" class="flex items-center gap-3">
            <img class="size-12 rounded-full object-cover" :src="videoData.video.user.avatar
            ? `${api}/${videoData.video.user.avatar}` : '/src/assets/default.png'">
            <div>
              <div class="font-medium">{{ videoData.video.user.name }}</div>
              <div class="text-sm text-zinc-500">{{ videoData.video.user.subscribers.count }} подписчиков</div>
            </div>
          </RouterLink>

          <button v-if="videoData.video.user.id !== id && id" @click="FollowingUser"
                  class="h-10 rounded-xl px-4 text-sm cursor-pointer"
                  :class="videoData.video.user.subscribed ? 'border border-gray-300 text-zinc-900 hover:bg-zinc-100': 'bg-zinc-900 text-white font-medium'">
            {{ videoData.video.user.subscribed ? 'Отписаться' : 'Подписаться' }}
          </button>
        </div>

        <button @click="getVideoPlaylistModal(videoData.video)" class="h-10 rounded-xl border border-zinc-300 px-4 text-sm hover:bg-zinc-100 cursor-pointer">
          Сохранить
        </button>
      </section>
      <section class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div class="mb-2 text-xs text-zinc-500">
          Видео опубликовано {{ videoData.video.created_at }}
        </div>
        <div class="whitespace-pre-wrap text-sm leading-relaxed">
          {{ videoData.video.description }}
        </div>
      </section>
      <div class="flex flex-col gap-2">
        <span class=" font-medium text-lg">Комментарии</span>
        <div class="flex flex-col items-center gap-2">
          <div v-if="id" class="flex gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm w-full" >
            <img
                class="size-10 rounded-full shrink-0"
                :src="avatar ? `${api}/${avatar}` : '/src/assets/default.png'"
                alt="" >
            <div class="flex-1">
              <textarea v-model="data.comment.text" rows="2" placeholder="Написать комментарий..."
              class="w-full resize-none outline-none bg-transparent"/>
              <div v-if="data.comment.text" class="flex justify-end gap-2 mt-3">
                <button @click="data.comment.text = ''" class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
                  Отмена
                </button>
                <button @click="sendCommentForm" class="px-4 py-2 rounded-xl bg-zinc-700 text-white hover:bg-zinc-800">
                  Отправить
                </button>
              </div>
            </div>
          </div>
          <div v-if="!comments" class="text-zinc-900">Комментариев пока нет. Будьте первым, кто оставит комментарий!</div>
        </div>
      </div>
      <ul v-for="(comment, index) in comments" class="flex flex-col gap-3">
        <li class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex gap-3">
            <img class="size-10 rounded-full object-cover shrink-0"
                 :src="comment.user.avatar ? `${api}/${comment.user.avatar}` : '/src/assets/default.png'" alt="user">
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900">
                    {{ comment.user.name }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ comment.created_at }}
                  </span>
                </div>
                <button v-if="token && parseInt(comment.user.id) === id" @click="deleteCommentForm(comment)"
                    class="flex items-center justify-center size-8 rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600">
                  <FontAwesomeIcon :icon="faTrash"/>
                </button>
              </div>
              <p class="mt-2 text-sm leading-relaxed break-words text-gray-700">{{ comment.text }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button v-if="id" @click="answered(index)" class="rounded-full bg-gray-100
                px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200">
                  Ответить
                </button>
                <button v-if="comment.answers.length" @click="comment.openAnswers ? comment.openAnswers = false : comment.openAnswers = true"
                    class="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100">
                  <span v-if="!comment.openAnswers">
                    Ответы ({{ comment.answers.length }})
                  </span>
                  <span v-else>
                    Свернуть ответы
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div v-if="comment.isAnswer" class="mt-4 ml-13 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div class="flex gap-2">
              <img class="size-8 rounded-full shrink-0" :src="avatar ? `${api}/${avatar}` : '/src/assets/default.png'"
                  alt="user">
              <input type="text" v-model="data.answer.text"
                  @keyup.enter="sendAnswerForm(comment)" placeholder="Напишите ответ..."
                  class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400">
            </div>
            <div class="mt-3 flex justify-end gap-2">
              <button @click="data.answer.text = null; comment.isAnswer = false"
                  class="rounded-xl px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200">
                Отмена
              </button>
              <button @click="sendAnswerForm(comment)"
                  class="rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black">
                Отправить
              </button>
            </div>
          </div>
          <div v-if="comment.answers && comment.openAnswers" class="mt-4 ml-13 border-l-2 border-gray-200 pl-4">
            <div v-for="answer in comment.answers" class="flex gap-3 py-3 first:pt-0 last:pb-0">
              <img class="size-8 rounded-full object-cover shrink-0"
                  :src="answer.user.avatar ? `${api}/${answer.user.avatar}` : '/src/assets/default.png'" alt="user">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-medium text-gray-800">{{ answer.user.name }}</span>
                  <span class="text-xs text-gray-500">{{ answer.created_at }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-700 break-words">
                  {{ answer.text }}
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-1 flex-col gap-2 col-span-2" v-if="!isResponse || videoData.recommendations.length">
      <VideoPreview :videos="videoData.recommendations" :isResponse="isResponse" />
    </div>
  </div>
</template>
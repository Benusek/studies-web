<script setup>
import { computed, onBeforeMount, onMounted, provide, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import Toast from '@/components/Toast.vue'
import Form from '@/components/Form.vue'
import Modal from '@/components/Modal/Modal.vue'
import Header from '@/components/Bars/Header.vue'
import Aside from '@/components/Bars/Aside.vue'
import PlaylistMenu from '@/components/Modal/PlaylistMenu.vue'
import { useRoute } from 'vue-router'

const categories = ref({
  all: [],
  current: []
})
const forms = [
  {
    label: 'Авторизация',
    submit: 'Войти',
    route: '/login',
    method: 'POST',
    inputs: [
      {
        label: 'Логин',
        code: 'login',
        type: 'text'
      },
      {
        label: 'Пароль',
        code: 'password',
        type: 'password'
      }
    ]
  },
  {
    label: 'Регистрация',
    submit: 'Зарегистрироваться',
    route: '/user',
    method: 'POST',
    inputs: [
      {
        label: 'Имя',
        code: 'name',
        type: 'text'
      },
      {
        label: 'Фамилия *',
        code: 'surname',
        type: 'text'
      },
      {
        label: 'Отчество *',
        code: 'patronymic',
        type: 'text'
      },
      {
        label: 'Логин',
        code: 'login',
        type: 'text'
      },
      {
        label: 'Пароль',
        code: 'password',
        type: 'password'
      },
      {
        label: 'Почта',
        code: 'email',
        type: 'email'
      },
      {
        label: 'Аватар *',
        code: 'avatar',
        type: 'file'
      }
    ]
  },
  {
    label: 'Добавление видео',
    submit: 'Добавить',
    method: 'POST',
    route: '/video',
    inputs: [
      {
        label: 'Название',
        code: 'title',
        type: 'text'
      },
      {
        label: 'Описание',
        code: 'description',
        type: 'text'
      },
      {
        label: 'Превью *',
        code: 'thumbnail',
        type: 'file'
      },
      {
        label: 'Видео',
        code: 'video',
        type: 'file'
      },
      {
        label: 'Категория *',
        code: 'category_id',
        type: 'select',
        options: []
      },
      {
        label: 'Публичное',
        code: 'public',
        type: 'checkbox'
      }
    ]
  },
  {
    label: 'Создание плейлиста',
    submit: 'Создать',
    method: 'POST',
    route: '/playlist',
    inputs: [
      {
        label: 'Название',
        code: 'title',
        type: 'text'
      },
      {
        label: 'Описание *',
        code: 'description',
        type: 'text'
      }]
  }]

const id = ref(localStorage.getItem('id'))
const token = ref(localStorage.getItem('user_token'))
const data = ref({
  isProcessing: false,
  menu: {},
  modal: {},
  toast: {},
  user: {},
  aside: false,
  playlists: []
})

onMounted(() => {
  process(async () => {
    const response = await apiFetch('GET', `/category`)
    if (response) {
      categories.value.all = categories.value.current = response
      forms[2].inputs[4].options = categories.value.all.map(category => ({
            value: category.id,
            label: category.name
          })
      )
    }

    if (token.value) {
      const user = await apiFetch('GET', `/user/${id.value}`)
      await getUserData(user.data)
    }
  })
})

const clickOutside = (target, btn, callback) => {
  if (!target) return

  let listener = (e) => {
    if (e.target === target.value || e.composedPath().includes(target.value) || e.target === btn.value || e.composedPath().includes(btn.value)) return
    if (typeof callback === 'function') callback()
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })

  onBeforeMount(() => {
    window.removeEventListener('click', listener)
  })

  return listener
}

const updateToken = (newToken) => {
  localStorage.setItem('user_token', newToken)
  token.value = newToken
}

const getUserData = async (result) => {
  const keys = Object.keys(result)
  keys.forEach(key => {
    data.value.user[key] = result[key]
    !key.includes('subscribe') && !key.includes('subscribers') ? localStorage.setItem(key, result[key]) : null
  })
}

const process = async (func) => {
  if (typeof func === 'function') {
    if (data.value.isProcessing) {
      return
    } else data.value.isProcessing = true
    await func()
    data.value.isProcessing = false
  }
}

const getVideoPlaylistModal = (video) => {
  process(async () => {
    openModal()
    data.value.menu.active = true
    data.value.menu.video = video.id

    const playlists = await apiFetch('GET', `/user/video/${video.id}/playlist`)
    if (playlists) data.value.playlists = playlists
  })
}

const changeVideoPlaylist = (playlist) => {
  process(async () => {
    if (playlist.active) {
      await apiFetch('DELETE', `/playlist/${playlist.id}/video/${data.value.menu['video']}`)
      playlist.active = false
    } else {
      await apiFetch('GET', `/playlist/${playlist.id}/video/${data.value.menu['video']}`)
      playlist.active = true
    }
  })
}

const getFiltered = (all, massive, query) => {
  massive = []
  all.forEach((object) => {
    if (object.name.toUpperCase().startsWith(query.toUpperCase())) {
      massive.push(object)
    }
  })
  return massive
}

const showToast = (message, icon = null) => {
  data.value.toast.active = true
  data.value.toast.message = message
  if (icon) {
    data.value.toast.icon = icon
  }
}

const toggle = (menu) => {
  data.value[menu] ? data.value[menu] = false : data.value[menu] = true
}

const storeLink = (num) => {
  data.value.menu.active = false
  data.value.modal.number = num
}

const avatar = computed(() => data.value.user.photo_file)
provide('token', token)
provide('avatar', avatar)
provide('id', id.value)

provide('updateToken', updateToken)
provide('getVideoPlaylistModal', getVideoPlaylistModal)
provide('getFiltered', getFiltered)
provide('showToast', showToast)
provide('link', storeLink)

const exit = (key) => {
  data.value[key].active = false
}

const openModal = (num) => {
  data.value.modal.number = num
  data.value.modal.active = true
}
</script>

<template>
  <Header @modal="openModal" :user="data.user" :role="data.user.role_id" @toggle="toggle" @out="clickOutside" :loading="data.isProcessing" />
  <template class="flex flex-col sm:flex-row">
    <Aside :token="token" :role="data.user.role_id" :categories="categories" :subscribe="data.user.subscribe"
           :collapse="data.aside" />
    <RouterView :key="useRoute().fullPath" />
  </template>
  <transition
    enter-active-class="transition ease-in-out duration-200 transform"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <Modal v-show="true" v-if="data.modal.active"
           :label="!data.modal.number && data.modal.number !== 0?null:forms[data.modal.number].label"
           @exit="exit('modal')">
      <PlaylistMenu v-if="!data.modal.number && data.modal.number !== 0" :playlists="data.playlists"
                    :loading="data.isProcessing"
                    @change="changeVideoPlaylist" />
      <Form v-else :forms="forms[data.modal.number]" @exit="exit('modal')"/>
    </Modal>
  </transition>

  <transition
    enter-active-class="transition ease duration-1000 transform"
    enter-from-class="translate-x-100"
    enter-to-class="translate-x-0"
    leave-active-class="transition ease duration-1000 transform"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-100">
    <Toast @exit="exit('toast')" v-if="data.toast.active" :text="data.toast.message"
           :icon="data.toast.icon" :active="data.toast.active" />
  </transition>
</template>
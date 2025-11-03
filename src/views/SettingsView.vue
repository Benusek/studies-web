<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import Error from '@/components/Modal/Error.vue'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Loading from '@/components/Loaders/Loading.vue'

const showToast = inject('showToast')
const data = ref({
  user: {
    id: '',
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    email_verify: '',
    login: '',
    photo_file: '',
    subscribers_count: '',
    subscribers: [],
    subscribe: []
  },
  edit: {
    form: {},
    errors: {},
    fileURL: '',
    isProcessing: true
  },
  isProcessing: false,
  isResponse: false,
  menu: 1
})

onMounted(async () => {
  const result = await apiFetch('GET', `/user/${localStorage.getItem('id')}`)
  if (result) {
    data.value.isResponse = true
    if (result.data) {
      data.value.user = JSON.parse(JSON.stringify(result.data))
      data.value.user.created = new Date(result.data.created)

      for (const key in result.data) {
        if (key !== 'subscribers' && key !== 'subscribe' && key !== 'subscribers_count' && key !== 'email_verify') {
          data.value.edit.form[key] = result.data[key]
        }
      }

      data.value.edit.form.photo_file = null
    }
  }
})

const changeFile = event => {
  data.value.edit.form.photo_file = event.target.files[0]
  data.value.edit.fileURL = URL.createObjectURL(event.target.files[0])
}

const sendForm = async () => {
  if (data.value.isProcessing) {
    return
  }

  data.value.isProcessing = true
  data.value.edit.errors = {}
  const formData = new FormData()
  for (const key in data.value.edit.form) {
    if (data.value.edit.form[key] !== data.value.user[key] && key !== 'photo_file') {
      formData.append(key, data.value.edit.form[key])
    } else if (key === 'photo_file' && data.value.edit.form.photo_file) {
      console.log(data.value.edit.form.photo_file)
      formData.append(key, data.value.edit.form[key])
    }
  }

  const result = await apiFetch('POST', `/user/${id.value}`, formData)
  console.log(result)

  if (result.error) {
    data.value.edit.errors = result.error.errors
  }

  if (result.data) {
    showToast('Данные успешно обновлены', faPen)
  }
  data.value.isProcessing = false
}

</script>

<template>
  <div class="p-5 w-full">
    <Loading v-if="!data.isResponse" :size="10" />
    <form @submit.prevent="sendForm" v-else
          class="flex flex-col bg-gray-100/30 shadow-sm border border-gray-200 rounded-[15px] p-[10px] gap-3 min-w-[200px]"
          :class="{'animate-pulse': !data.isResponse}">
      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">
        <span class="text-lg font-medium">Изображение пользователя</span>
        <ul class="grid grid-cols-1 p-1 gap-6">
          <li class="flex flex-col gap-3 justify-center">
            <Error :errors="data.edit.errors.photo_file" />
            <label for="photo"
                   class="cursor-pointer bg-gray-100 flex flex-row justify-center items-center p-2 rounded-lg gap-3  border border-gray-200 shadow-sm">
              <div class="relative">
                <img
                  :src="!data.edit.fileURL ? data.user.photo_file ? `http://videoapi/${data.user.photo_file}` : '/src/assets/default.png' : data.edit.fileURL"
                  alt="large image"
                  class="rounded-full w-20 aspect-square object-cover border border-gray-200 shadow-md hover:brightness-80 bg-gray-300" />
              </div>
              <input type="file" id="photo" class="hidden" accept="image/*" @change="changeFile">
              <div class="flex flex-col gap-2 w-[55%]">
                <p v-if="data.edit.form.photo_file"
                   class="flex justify-center text-gray-700 bg-white h-fit py-1 text-sm w-auto rounded-xl line-clamp-1 break-words text-xs px-2">
                  {{ data.edit.form.photo_file.name }}
                </p>
                <p v-else
                   class="flex justify-center text-gray-700 bg-white h-fit py-1 px-2 text-sm rounded-xl border border-gray-200 shadow-xs">
                  Выбрать файл
                </p>
                <span class="text-xs break-words b">Поддерживаемые форматы: JPEG, PNG или GIF</span>
              </div>
            </label>
          </li>
        </ul>
      </div>
      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">
        <span class="text-lg font-medium">Профиль</span>
        <ul class="grid grid-cols-1 md:grid-cols-2 p-5 gap-6">
          <li class="flex flex-col gap-3 justify-center">
            <div class="relative flex flex-col">
              <label for="name" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"
                     :class="{'text-red-600/70': data.edit.errors.name }">Имя</label>
              <input v-model="data.edit.form.name" type="text" name="" id="name"
                     class="border border-gray-300 rounded-lg p-1.5 text-xs"
                     :class="{'border border-red-600/70': data.edit.errors.name }">
              <Error :errors="data.edit.errors.name" />
            </div>
            <div class="relative flex flex-col">
              <label for="surname" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"
                     :class="{'text-red-600/70': data.edit.errors.surname }">Фамилия</label>
              <input v-model="data.edit.form.surname" type="text" id="surname"
                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs"
                     :class="{'border border-red-600/70': data.edit.errors.surname }">
              <span class="text-xs bg-white text-gray-500">(необязательно)</span>
              <Error :errors="data.edit.errors.surname" />
            </div>
            <div class="relative flex flex-col">
              <label for="patronymic" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"
                     :class="{'text-red-600/70': data.edit.errors.patronymic }">Отчество </label>
              <input v-model="data.edit.form.patronymic" type="text" id="patronymic"
                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs w-full"
                     :class="{'border border-red-600/70': data.edit.errors.patronymic }">

              <span class="text-xs bg-white text-gray-500">(необязательно)</span>
              <Error :errors="data.edit.errors.patronymic" />
            </div>
          </li>
          <li class="flex flex-col gap-3 justify-end pb-4">
            <div>
              <label for="login" class="bg-white text-sm px-1 text-gray-500">Дата регистрации</label>
              <div class="relative flex flex-col">
                <span
                  class="border border-b rounded-sm bg-gray-100 border-gray-100 p-1 text-xs text-gray-500">{{ data.user.created
                  }}</span>
              </div>
            </div>
            <div class="relative flex flex-col">
              <label for="login" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"
                     :class="{'text-red-600/70': data.edit.errors.login }">Логин</label>
              <input v-model="data.edit.form.login" type="text" id="login"
                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs"
                     :class="{'border border-red-600/70': data.edit.errors.login }">
              <Error :errors="data.edit.errors.login" />
            </div>

          </li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">
        <span class="text-lg font-medium">Безопасность</span>
        <ul class="grid grid-cols-1 p-5 gap-6">
          <li class="relative flex flex-col">
            <label for="password" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                   :class="{'text-red-600/70': data.edit.errors.password }">Пароль</label>
            <input v-model="data.edit.form.password" type="password" autocomplete="on" id="password"
                   placeholder="••••••••••"
                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                   :class="{'border border-red-600/70': data.edit.errors.password }">
            <Error :errors="data.edit.errors.password" />
          </li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">
        <span class="text-lg font-medium">Подтверждение и обратная связь</span>
        <ul class="grid grid-cols-1 p-5 gap-6">
          <li class="relative flex flex-col">
            <label for="email" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                   :class="{'text-red-600/70': data.edit.errors.email }">Почта</label>
            <input v-model="data.edit.form.email" type="email" id="email"
                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                   :class="{'border border-red-600/70': data.edit.errors.email }">
            <Error :errors="data.edit.errors.email" />
            <span v-if="data.user.email_verify" class="text-green-600 text-xs">Подтверждена</span>
            <span v-else class="text-red-600 text-xs">Не подтверждена</span>
          </li>
        </ul>
      </div>
      <button :disabled="data.isProcessing"
              class="bg-blue-500 text-white py-1 rounded-lg cursor-pointer font-medium text-sm hover:bg-blue-600 active:bg-blue-700">
        Подтвердить
      </button>
    </form>
  </div>

</template>

<style scoped>

</style>
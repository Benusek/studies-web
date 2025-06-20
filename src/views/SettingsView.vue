<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import Error from '@/components/Error.vue'
import { faPen } from '@fortawesome/free-solid-svg-icons'

const showToast = inject('showToast')
const id = inject('user-id')
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
  const result = await apiFetch('GET', `/user/${id.value}`)
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
      }
      else if (key === 'photo_file' && data.value.edit.form.photo_file) {
        console.log(data.value.edit.form.photo_file)
        formData.append(key, data.value.edit.form[key])
      }
  }

  const result = await apiFetch('POST', `/user/${id.value}`, formData)
  console.log(result)

  if (result.error) {
    data.value.edit.errors = result.error.errors
  }

  if(result.data) {
    showToast('Данные успешно обновлены', faPen)
  }
  data.value.isProcessing = false
}

</script>

<template>
  <div class="p-5 w-[100%] flex justify-center">
    <svg v-if="!data.isResponse" aria-hidden="true" class="inline m-10 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
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
                  class="border border-b rounded-sm bg-gray-100 border-gray-100 p-1 text-xs text-gray-500">{{ data.user.created }}</span>
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
          <li class="relative flex flex-col">
            <label for="confirm_password" class=" absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                   :class="{'text-red-600/70': data.edit.errors.password }">Пароль</label>
            <input v-model="data.edit.form.password" type="password" autocomplete="on" id="confirm_password"
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
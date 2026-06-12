<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import Error from '@/components/Modal/Error.vue'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Loading from '@/components/Loaders/Loading.vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const api = import.meta.env.VITE_APP_API
const showToast = inject('showToast')

const data = ref({
  user: null,
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
      data.value.edit.form = result.data
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

  const result = await apiFetch('POST', `/user/${localStorage.getItem('id')}`, formData)
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
    <div class="max-w-6xl w-full mx-auto p-4 md:p-6">
      <Loading v-if="!data.isResponse" :size="10" />
      <form v-else @submit.prevent="sendForm" class="space-y-6">
        <section class="border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg">
          <div
              class="flex flex-col lg:flex-row items-center gap-6">
            <div class="relative shrink-0">
              <img :src="!data.edit.fileURL ? data.user.photo_file ? `${api}/${data.user.photo_file}` : '/src/assets/default.png' : data.edit.fileURL"
                  alt="" class="size-32 rounded-full object-cover">
              <label for="photo" class="absolute bottom-0 right-0 bg-zinc-500 hover:bg-zinc-600 rounded-full size-8 flex cursor-pointer transition">
                <FontAwesomeIcon :icon="faPen" class="self-center mx-auto text-white" />
              </label>
              <input id="photo" type="file" class="hidden" accept="image/*" @change="changeFile">
            </div>
            <div class="flex-1 text-center lg:text-left">
              <h1 class="text-2xl md:text-3xl font-bold">
                {{ data.user.name }}
              </h1>
              <p class="text-zinc-700 mt-1">
                @{{ data.user.login }}
              </p>
              <p class="text-sm text-zinc-500 mt-2">
                Зарегистрирован {{ data.user.created }}
              </p>
              <div class="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                <div class="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">
                   Подписано на канал {{ data.user.subscribers.count }} человек
                </div>
              </div>
            </div>
          </div>
          <Error :errors="data.edit.errors.photo_file" />
        </section>
        <section class="shadow-lg border border-gray-100 shadow rounded-3xl p-6">
          <h2 class="text-lg font-semibold mb-6">
            Профиль
          </h2>
          <div class="grid md:grid-cols-2 gap-5">
            <div class="relative flex flex-col max-w-xs">
                <label for="name" class="text-sm pl-1">Имя</label>
                <input v-model="data.edit.form.name" id="name" type="text"
                       class="border border-gray-300 rounded-lg p-1.5 bg-gray-50"
                       :class="{'border border-red-600/70': data.edit.errors.email}">
                <Error :errors="data.edit.errors.name" />
            </div>
            <div class="relative flex flex-col max-w-xs">
              <label class="text-sm pl-1">
                Фамилия
              </label>
              <input v-model="data.edit.form.surname" id="surname" type="text" class="border border-gray-300 rounded-lg p-1.5 bg-gray-50"
                     :class="{'border border-red-600/70': data.edit.errors.email}">
              <Error :errors="data.edit.errors.surname" />
            </div>
            <div class="relative flex flex-col max-w-xs">
              <label for="patronymic" class="text-sm pl-1">
                Отчество
              </label>
              <input v-model="data.edit.form.patronymic" id="patronymic" type="text"
                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-50"
                     :class="{'border border-red-600/70': data.edit.errors.email}">
              <Error :errors="data.edit.errors.patronymic" />
            </div>
            <div class="relative flex flex-col max-w-xs">
              <label for="login" class="text-sm pl-1">
                Логин
              </label>
              <input v-model="data.edit.form.login" id="login" type="text"
                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-50"
                     :class="{'border border-red-600/70': data.edit.errors.email}">
              <Error :errors="data.edit.errors.login" />
            </div>
          </div>
        </section>
        <section class="border border-gray-100 rounded-3xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold mb-3">
            Безопасность
          </h2>
          <div class="relative flex flex-col max-w-xs">
            <input v-model="data.edit.form.password" id="password" type="password" placeholder="Новый пароль" autocomplete="on"
                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-50"
                   :class="{'border border-red-600/70': data.edit.errors.email}">
            <Error :errors="data.edit.errors.password" />
          </div>
        </section>
        <section class="border border-gray-100 rounded-3xl p-6 shadow-lg">
          <h2 class="text-lg font-semibold mb-3">
            Email
          </h2>
          <div class="relative flex flex-col max-w-xs">
            <input v-model="data.edit.form.email" id="email" type="email"
                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-50"
                   :class="{'border border-red-600/70': data.edit.errors.email}">
            <Error :errors="data.edit.errors.email" />
          </div>
        </section>
        <div class="flex justify-between">
          <RouterLink :to="'/channel/' + data.user.id" :disabled="data.isProcessing" class="min-w-[220px] h-12 rounded-2xl bg-zinc-600 hover:bg-zinc-700
            disabled:bg-zinc-500 disabled:cursor-not-allowed text-white font-semibold transition flex items-center
            justify-center cursor-pointer">
            <Loading v-if="data.isProcessing" :size="5"/>
            <span v-else>
              Перейти к профилю
            </span>
          </RouterLink>
          <button :disabled="data.isProcessing" class="min-w-[220px] h-12 rounded-2xl bg-zinc-600 hover:bg-zinc-700
            disabled:bg-zinc-500 disabled:cursor-not-allowed text-white font-semibold transition flex items-center
            justify-center cursor-pointer">
            <Loading v-if="data.isProcessing" :size="5"/>
            <span v-else>
              Сохранить изменения
            </span>
          </button>
        </div>
      </form>
    </div>

<!--  <div class="p-5 w-full">-->
<!--    <Loading v-if="!data.isResponse" :size="10" />-->
<!--    <form @submit.prevent="sendForm" v-else-->
<!--          class="flex flex-col bg-gray-100/30 shadow-sm border border-gray-200 rounded-[15px] p-[10px] gap-3 min-w-[200px]"-->
<!--          :class="{'animate-pulse': !data.isResponse}">-->
<!--      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">-->
<!--        <span class="text-lg font-medium">Изображение пользователя</span>-->
<!--        <ul class="grid grid-cols-1 p-1 gap-6">-->
<!--          <li class="flex flex-col gap-3 justify-center">-->
<!--            <Error :errors="data.edit.errors.photo_file" />-->
<!--            <label for="photo"-->
<!--                   class="cursor-pointer bg-gray-100 flex flex-row justify-center items-center p-2 rounded-lg gap-3  border border-gray-200 shadow-sm">-->
<!--              <div class="relative">-->
<!--                <img-->
<!--                  :src="!data.edit.fileURL ? data.user.photo_file ? `${api}/${data.user.photo_file}` : '/src/assets/default.png' : data.edit.fileURL"-->
<!--                  alt="large image"-->
<!--                  class="rounded-full w-20 aspect-square object-cover border border-gray-200 shadow-md hover:brightness-80 bg-gray-300" />-->
<!--              </div>-->
<!--              <input type="file" id="photo" class="hidden" accept="image/*" @change="changeFile">-->
<!--              <div class="flex flex-col gap-2 w-[55%]">-->
<!--                <p v-if="data.edit.form.photo_file"-->
<!--                   class="flex justify-center text-gray-700 bg-white h-fit py-1 text-sm w-auto rounded-xl line-clamp-1 break-words text-xs px-2">-->
<!--                  {{ data.edit.form.photo_file.name }}-->
<!--                </p>-->
<!--                <p v-else-->
<!--                   class="flex justify-center text-gray-700 bg-white h-fit py-1 px-2 text-sm rounded-xl border border-gray-200 shadow-xs">-->
<!--                  Выбрать файл-->
<!--                </p>-->
<!--                <span class="text-xs break-words b">Поддерживаемые форматы: JPEG, PNG или GIF</span>-->
<!--              </div>-->
<!--            </label>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">-->
<!--        <span class="text-lg font-medium">Профиль</span>-->
<!--        <ul class="grid grid-cols-1 md:grid-cols-2 p-5 gap-6">-->
<!--          <li class="flex flex-col gap-3 justify-center">-->
<!--            <div class="relative flex flex-col">-->
<!--              <label for="name" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"-->
<!--                     :class="{'text-red-600/70': data.edit.errors.name }">Имя</label>-->
<!--              <input v-model="data.edit.form.name" type="text" name="" id="name"-->
<!--                     class="border border-gray-300 rounded-lg p-1.5 text-xs"-->
<!--                     :class="{'border border-red-600/70': data.edit.errors.name }">-->
<!--              <Error :errors="data.edit.errors.name" />-->
<!--            </div>-->
<!--            <div class="relative flex flex-col">-->
<!--              <label for="surname" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"-->
<!--                     :class="{'text-red-600/70': data.edit.errors.surname }">Фамилия</label>-->
<!--              <input v-model="data.edit.form.surname" type="text" id="surname"-->
<!--                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs"-->
<!--                     :class="{'border border-red-600/70': data.edit.errors.surname }">-->
<!--              <span class="text-xs bg-white text-gray-500">(необязательно)</span>-->
<!--              <Error :errors="data.edit.errors.surname" />-->
<!--            </div>-->
<!--            <div class="relative flex flex-col">-->
<!--              <label for="patronymic" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"-->
<!--                     :class="{'text-red-600/70': data.edit.errors.patronymic }">Отчество </label>-->
<!--              <input v-model="data.edit.form.patronymic" type="text" id="patronymic"-->
<!--                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs w-full"-->
<!--                     :class="{'border border-red-600/70': data.edit.errors.patronymic }">-->

<!--              <span class="text-xs bg-white text-gray-500">(необязательно)</span>-->
<!--              <Error :errors="data.edit.errors.patronymic" />-->
<!--            </div>-->
<!--          </li>-->
<!--          <li class="flex flex-col gap-3 justify-end pb-4">-->
<!--            <div>-->
<!--              <label for="login" class="bg-white text-sm px-1 text-gray-500">Дата регистрации</label>-->
<!--              <div class="relative flex flex-col">-->
<!--                <span-->
<!--                  class="border border-b rounded-sm bg-gray-100 border-gray-100 p-1 text-xs text-gray-500">{{ data.user.created-->
<!--                  }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="relative flex flex-col">-->
<!--              <label for="login" class="absolute bg-white text-xs top-[-10px] left-5 px-1 text-gray-500"-->
<!--                     :class="{'text-red-600/70': data.edit.errors.login }">Логин</label>-->
<!--              <input v-model="data.edit.form.login" type="text" id="login"-->
<!--                     class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs"-->
<!--                     :class="{'border border-red-600/70': data.edit.errors.login }">-->
<!--              <Error :errors="data.edit.errors.login" />-->
<!--            </div>-->

<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

<!--      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">-->
<!--        <span class="text-lg font-medium">Безопасность</span>-->
<!--        <ul class="grid grid-cols-1 p-5 gap-6">-->
<!--          <li class="relative flex flex-col">-->
<!--            <label for="password" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"-->
<!--                   :class="{'text-red-600/70': data.edit.errors.password }">Пароль</label>-->
<!--            <input v-model="data.edit.form.password" type="password" autocomplete="on" id="password"-->
<!--                   placeholder="••••••••••"-->
<!--                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"-->
<!--                   :class="{'border border-red-600/70': data.edit.errors.password }">-->
<!--            <Error :errors="data.edit.errors.password" />-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

<!--      <div class="bg-white p-4 rounded-[5px] border border-gray-200 shadow-sm">-->
<!--        <span class="text-lg font-medium">Подтверждение и обратная связь</span>-->
<!--        <ul class="grid grid-cols-1 p-5 gap-6">-->
<!--          <li class="relative flex flex-col">-->
<!--            <label for="email" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"-->
<!--                   :class="{'text-red-600/70': data.edit.errors.email }">Почта</label>-->
<!--            <input v-model="data.edit.form.email" type="email" id="email"-->
<!--                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"-->
<!--                   :class="{'border border-red-600/70': data.edit.errors.email }">-->
<!--            <Error :errors="data.edit.errors.email" />-->
<!--            <span v-if="data.user.email_verify" class="text-green-600 text-xs">Подтверждена</span>-->
<!--            <span v-else class="text-red-600 text-xs">Не подтверждена</span>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      <button :disabled="data.isProcessing"-->
<!--              class="bg-blue-500 text-white py-1 rounded-lg cursor-pointer font-medium text-sm hover:bg-blue-600 active:bg-blue-700">-->
<!--        Подтвердить-->
<!--      </button>-->
<!--    </form>-->
<!--  </div>-->
</template>
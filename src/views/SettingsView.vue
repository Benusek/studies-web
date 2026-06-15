<script setup>

import { inject, onMounted, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import Error from '@/components/Modal/Error.vue'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Loading from '@/components/Loaders/Loading.vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import SettingsSkeleton from "@/components/Loaders/SettingsSkeleton.vue";

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
      <template v-if="!data.isResponse">
        <SettingsSkeleton />
      </template>
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
          <RouterLink :to="'/channel/' + data.user.id" :disabled="data.isProcessing"
                      class="min-w-[220px] h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-500
                      disabled:cursor-not-allowed text-white font-semibold transition flex items-center
                      justify-center cursor-pointer">
            <Loading v-if="data.isProcessing" :size="5"/>
            <span v-else>
              Перейти к профилю
            </span>
          </RouterLink>
          <button :disabled="data.isProcessing" class="min-w-[220px] h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800
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
</template>
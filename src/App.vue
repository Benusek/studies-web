<script setup>

import { onMounted, provide, ref } from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {
  faArrowLeft, faArrowRightFromBracket,
  faBars, faBook,
  faC,
  faGear, faHeadset,
  faList,
  faN,
  faPlus,
  faSearch,
  faUser, faUserPlus, faXmark
} from '@fortawesome/free-solid-svg-icons'
import {
  faFlutter,
  faGolang,
  faJava,
  faNodeJs,
  faReact,
  faUnity,
  faVuejs,
  faWpforms
} from "@fortawesome/free-brands-svg-icons";
import apiFetch from "@/helpers/apiFetch.js";
import Error from "@/components/Error.vue";
import Toast from '@/components/Toast.vue'
import router from '@/router/index.js'

const allCategories = ref([])
const data = ref({
  lists: {
    isOpenList: false,
    isOpenAside: false,
    searchExpansion: false,
    isProcessing: false
  },
  modals: {
    isRegistration: false,
    isAuthorization: false
  },
  forms: {
    registration: {
      form: {
        name: '',
        surname: '',
        patronymic: '',
        login: '',
        password: '',
        email: '',
        photo_file: ''
      },
      fileURL: '',
      errors: {}
    },
    authorization: {
      form: {
        login: '',
        password: ''
      },
      errors:{}
    },
    toast: {
      active: false,
      message: '',
      icon: Object
    }
  },
  user: {
    name: '',
    surname: '',
    patronymic: '',
    login: '',
    email: '',
    photo_file: '',
    subscribers_count: '',
    subscribers: [],
    subscribe: []
  },
  videoQuery: '',
  categoryQuery: '',
})

const id = ref(localStorage.getItem('user-id'))
const token = ref(localStorage.getItem('user-token'))
const roleId = ref(localStorage.getItem('user-role'))
const updateToken = (newToken) => {
  updateValue('user-token', newToken)
  updateRoleId(null)
  updateId(null)
  token.value = newToken
}

const updateRoleId = (newRoleId) => {
  updateValue('user-role', newRoleId)
  roleId.value = newRoleId
}

const updateId = (newId) => {
  updateValue('user-id', newId)
  id.value = newId
}

const updateValue = (storageId, newValue) => {
  if (!newValue) {
    localStorage.removeItem(storageId)
  }
  else {
    localStorage.setItem(storageId, newValue)
  }
}

provide('token', token)
provide('user-role', roleId)
provide('updateToken', updateToken)

const logout = async() => {
  await apiFetch('GET', '/logout')
  updateToken(null)
  await router.replace('/')
}

const updateToastStatus = () => {
  data.value.forms.toast.active = false
}

onMounted(async () => {
  const result = await apiFetch('GET', `/category`)
  if (result) {
    allCategories.value = result
    categories.value = result
  }
  await getInfo()
})

const icons = {
  1: faWpforms,
  2: faVuejs,
  3: faN,
  4: faNodeJs,
  6: faReact,
  7: faFlutter,
  8: faGolang,
  9: faUnity,
  11: faJava,
  10: faC,
  12: faBook
}
const categories = ref([])

const getCategories = () => {
  categories.value = []
  allCategories.value.forEach((category) => {
    if (category.name.toUpperCase().startsWith(data.value.categoryQuery.toUpperCase())) {
      categories.value.push(category)
    }
  })
}

const sendSearch = async (expansion = false) => {
  const result = await apiFetch('GET', `/video/start/0/count/30?query=${data.value.videoQuery}`)
  console.log(result);
}

const registerForm = async (form) => {
  if (data.value.lists.isProcessing) {
    return
  }
  data.value.lists.isProcessing = true
  data.value.forms.registration.errors = {}
  const formData = new FormData()
  for (const key in form) {
      if (form[key] !== '' && key !== 'photo_file') {
        formData.append(key, form[key])
      }
  }

  const result = await apiFetch('POST', '/user', formData)
  console.log(result)
  if (result?.error) {
    data.value.forms.registration.errors = result.error.errors
  }

  if (result?.data) {
    data.value.modals.isRegistration = false
    showToast('Вы успешно зарегистрировались', faUserPlus)
  }
  data.value.lists.isProcessing = false
}

const authForm = async (form) => {
  if (data.value.lists.isProcessing) {
    return
  }

  data.value.lists.isProcessing = true
  data.value.forms.authorization.errors = {}
  const result = await apiFetch('POST', '/login', form)

  console.log(result)
  if (result?.error) {
    data.value.forms.authorization.errors = result.error.errors
  }

  if (result?.data) {
    updateToken(result.data.user_token)
    updateRoleId(result.data.role_id)
    updateId(result.data.user_id)
    await getInfo()
    data.value.modals.isAuthorization = false
    showToast('Успешный вход', faUser)
  }

  data.value.lists.isProcessing = false
}

const showToast = (message, icon) => {
  data.value.forms.toast.active = true
  data.value.forms.toast.message = message
  data.value.forms.toast.icon = icon
}

const getInfo = async() => {
  if (localStorage.getItem('user-id')) {
    const information = await apiFetch('GET', `/user/${localStorage.getItem('user-id')}`)
    if (information?.data) {
      data.value.user = information.data
      console.log(data.value.user)
    }
  }
}

const toggleUser = () => {
  data.value.lists.isOpenList === true ? data.value.lists.isOpenList = false : data.value.lists.isOpenList = true
}

const toggleAside = () => {
  data.value.lists.isOpenAside === true ? data.value.lists.isOpenAside = false : data.value.lists.isOpenAside = true
}

const changeFile = event => {
  data.value.forms.registration.form.photo_file = event.target.files[0]
  data.value.forms.registration.fileURL = URL.createObjectURL(event.target.files[0])
}

</script>

<template>
  <div class="min-w-min">
    <header class="sticky top-0 z-3">
      <nav class="bg-gray-100">
        <ul class="flex justify-between gap-3 border-b border-gray-200 p-2 w-full">
          <RouterLink to="/" class="flex sm:flex flex-row items-center gap-2"
                      :class="{'hidden': data.lists.searchExpansion}">
            <FontAwesomeIcon :icon="faBars" class="text text-xl p-2" @click="toggleAside"/>
            <img src="/src/assets/logo.svg" alt="logo" class="w-10">
            <p class="">Studies</p>
          </RouterLink>
          <li class="flex sm:w-120" :class="{'w-full': data.lists.searchExpansion}">
            <button @click="data.lists.searchExpansion = false"
                    :class="{'flex': data.lists.searchExpansion, 'hidden': !data.lists.searchExpansion}"
                    type="submit"
                    class="sm:hidden items-center justify-center p-2 p-2 w-10 h-10 text-sm font-medium cursor-pointer">
              <FontAwesomeIcon :icon="faArrowLeft"/>
            </button>
            <form @submit.prevent="sendSearch" class="relative w-full h-[33px]">
              <input v-model="data.videoQuery" type="search" :class="{'hidden': !data.lists.searchExpansion}"
                     class=" sm:block p-1.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg
              rounded-s-gray-100 border border-gray-300" placeholder="Поиск"/>
              <button type="submit" class="hidden sm:flex items-center absolute top-0 end-0 p-2 h-full text-sm font-medium
            sm:rounded-e-lg sm:text-white sm:bg-blue-700 sm:border sm:border-blue-700 sm:hover:bg-blue-800
            cursor-pointer">
                <FontAwesomeIcon :icon="faSearch"/>
              </button>
            </form>
          </li>
          <li>
            <button @click="toggleUser" :class="{'hidden': data.lists.searchExpansion}"
                    class="flex sm:flex justify-center items-center cursor-pointer p-2 w-10 h-10">
              <FontAwesomeIcon :icon="faUser" class="text-lg"/>
            </button>
            <button @click="data.lists.searchExpansion = true; sendSearch(true)"
                    class="sm:hidden items-center justify-center p-2 w-10 h-10 text-sm font-medium cursor-pointer ">
              <FontAwesomeIcon :icon="faSearch"/>
            </button>
          </li>
        </ul>
      </nav>
      <ul v-if="data.lists.isOpenList"
          class="absolute right-0 z-2 rounded-bl-xl shadow-xl w-full sm:w-60 md:w-70 h-auto bg-gray-100 cursor-pointer">
        <li v-if="token" class="p-3 flex flex-row gap-2">
          <img :src="data.user.photo_file != null ? `http://videoapi/${data.user.photo_file}` : '/src/assets/default.png'" class="rounded-full w-20 h-20 text-lg p-2 hidden sm:block" alt="">
          <div class="flex flex-col text-lg justify-center rounded-t-xl leading-none gap-1 w-120 sm:w-40">
            <span class="break-words  line-clamp-1">{{data.user.name}}</span>
            <div class="flex flex-col">
              <span class="text-xs text-gray-600 break-words  line-clamp-1">{{ '@' + data.user.login}}</span>
              <span class="text-xs text-gray-600 break-words  line-clamp-1">{{data.user.email}}</span>
            </div>

          </div>
        </li>
        <li v-if="!token" class="p-3 border-b border-gray-300 hover:bg-gray-200" @click="data.modals.isRegistration = true">
          Зарегистрироваться
        </li>
        <li v-if="!token" class="p-3 border-b rounded-bl-xl border-gray-300 hover:bg-gray-200" @click="data.modals.isAuthorization = true"> Войти</li>
        <li v-if="token" class="p-3 border-b border-gray-300 hover:bg-gray-200">
          <FontAwesomeIcon class="flex items-center mr-3" :icon="faGear"/>
          <span>Личный кабинет</span>
        </li>
        <li v-if="token && parseInt(roleId) === 2" class="p-3 border-b border-gray-300 hover:bg-gray-200">
          <FontAwesomeIcon class="p-x mr-3" :icon="faHeadset"/>
          <span>Жалобы</span>
        </li>
        <li v-if="token && parseInt(roleId) === 1" class="p-3 border-b border-gray-300 hover:bg-gray-200">
          <FontAwesomeIcon class="flex items-center mr-3" :icon="faPlus"/>
          <span>Добавить видео</span>
        </li>
        <li v-if="token && parseInt(roleId) === 1" class="p-3 border-b border-gray-300 hover:bg-gray-200">
          <FontAwesomeIcon class="flex items-center mr-3" :icon="faList"/>
          <span class="col-span-2">Плейлисты</span>
        </li>
        <li v-if="token" class="p-3 hover:bg-gray-200 rounded-bl-xl border-b border-gray-300 hover:bg-gray-200" @click="logout">
          <FontAwesomeIcon class="flex items-center mr-3" :icon="faArrowRightFromBracket"/>
          <span class="col-span-2">Выйти</span>
        </li>
      </ul>
    </header>

<!--Тело страницы-->
  <!--Левая панель-->
    <div class="flex flex-col sm:flex-row">
      <main class="z-2 g-gray-100 z-2 min-w-20 break-words">
        <div class="sticky justify-center top-16 max-h-[calc(100vh-4rem)] overflow-auto sm:flex w-full"
             :class="{'sm:w-20': data.lists.isOpenAside, 'hidden': data.lists.isOpenAside}">
          <ul>
            <li>
              <RouterLink to="/"><p class="font-medium text-sm pt-2 cursor-pointer"
                                    :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">
                Категории</p></RouterLink>
              <div class="px-3 py-2" v-if="!data.lists.isOpenAside">
                <input v-model="data.categoryQuery" type="text" placeholder="Поиск по категориям" @input="getCategories"
                       class="bg-white text-xs rounded-lg border border-gray-300 p-1 w-full">
              </div>
              <div v-for="category in categories"
                   class="flex p-2 min-w-10 border-b border-gray-200/80 hover:bg-gray-100
                 shadow-xs text-xs font-sans gap-3 cursor-pointer"
                   :class="{'w-15': data.lists.isOpenAside}">
                <div class="flex items-center justify-center ms-3 ">
                  <FontAwesomeIcon :icon="icons[`${category.id}`]" class="text-lg"/>
                </div>
                <div v-if="!data.lists.isOpenAside">
                  <span>{{ category.name }}</span>
                </div>
              </div>
            </li>
            <li>
              <RouterLink to="/">
                <p class="font-medium text-xs pt-2 cursor-pointer" :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">Плейлисты</p>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/">
                <p class="font-medium text-xs pt-2 cursor-pointer" :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">Ваш канал</p>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/">
                <p class="font-medium text-xs pt-2 cursor-pointer" :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">Подписки</p>
              </RouterLink>
            </li>
          </ul>
        </div>
      </main>
      <!--Основное тело-->
      <RouterView/>
    </div>
<!--Модальное окно регистрации-->
    <transition
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
      <template v-if="data.modals.isRegistration">
        <div class="fixed flex justify-center sm:items-center top-0 bottom-0 right-0 left-0 z-4">
          <div class="flex items-center justify-center fixed bg-black/30 top-0 right-0 left-0 bottom-0"
               @click="data.modals.isRegistration = false; data.lists.isFileImage = false; data.forms.registration.form.photo_file = ''"/>
          <form v-show="data.modals.isRegistration" @submit.prevent="registerForm(data.forms.registration.form)"
                class="relative sm:rounded-xl bg-white w-full sm:w-auto h-full sm:h-fit overflow-auto">
            <div class="flex justify-between items-center border-b border-b-gray-200 p-3 text-lg font-semibold">
              <p class="">Регистрация</p>
              <FontAwesomeIcon :icon="faXmark" class="cursor-pointer hover:text-black/60" @click="data.modals.isRegistration = false; data.lists.isFileImage = false; data.forms.registration.form.photo_file = ''"/>
            </div>

            <ul class="grid grid-cols-1 md:grid-cols-2 p-5 gap-6">
              <li class="flex flex-col gap-3 justify-center">
                <div class="relative flex flex-col">
                  <label for="name" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                         :class="{'text-red-600/70': data.forms.registration.errors.name }">Имя</label>
                  <input v-model="data.forms.registration.form.name" type="text" name="" id="name"
                         class="border border-gray-300 rounded-lg p-1.5 text-xs"
                         :class="{'border border-red-600/70': data.forms.registration.errors.name }">
                  <Error :errors="data.forms.registration.errors.name"/>
                </div>
                <div class="relative flex flex-col">
                  <label for="surname" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                         :class="{'text-red-600/70': data.forms.registration.errors.surname }">Фамилия</label>
                  <input v-model="data.forms.registration.form.surname" type="text" id="surname"
                         class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs"
                         :class="{'border border-red-600/70': data.forms.registration.errors.surname }">
                  <span class="text-xs bg-white text-gray-500">(необязательно)</span>
                  <Error :errors="data.forms.registration.errors.surname"/>
                </div>
                <div class="relative flex flex-col">
                  <label for="patronymic" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                         :class="{'text-red-600/70': data.forms.registration.errors.patronymic }">Отчество </label>
                  <input v-model="data.forms.registration.form.patronymic" type="text" id="patronymic"
                         class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs"
                         :class="{'border border-red-600/70': data.forms.registration.errors.patronymic }">
                  <span class="text-xs bg-white text-gray-500">(необязательно)</span>
                  <Error :errors="data.forms.registration.errors.patronymic"/>
                </div>
              </li>

              <li class="flex flex-col gap-3 justify-center">
                <Error :errors="data.forms.registration.errors.photo_file"/>
                <label for="photo" class="cursor-pointer">
                  <div class="relative flex flex-row items-end gap-4 justify-center">
                    <img :src="data.forms.registration.form.photo_file ? data.forms.registration.fileURL : '/src/assets/default.png'"
                         alt="large image" class="rounded-full aspect-square w-20 h-20 object-cover border border-gray-200 shadow-md hover:brightness-80 bg-gray-300"/>
                    <img :src="data.forms.registration.form.photo_file ? data.forms.registration.fileURL : '/src/assets/default.png'"
                         alt="medium image" class="rounded-full aspect-square w-15 h-15 object-cover border border-gray-200 shadow-md hover:brightness-80 bg-gray-300"/>
                    <img :src="data.forms.registration.form.photo_file ? data.forms.registration.fileURL : '/src/assets/default.png'"
                         alt="small image" class="rounded-full aspect-square w-10 h-10 object-cover border border-gray-200 shadow-md hover:brightness-80 bg-gray-300"/>
                  </div>
                  <input type="file" id="photo" class="hidden" accept="image/*" @change="changeFile">
                  <p v-if="data.forms.registration.form.photo_file" class="flex justify-center text-gray-700 mt-2 w-50 line-clamp-1 break-words">
                    {{ data.forms.registration.form.photo_file.name }}
                  </p>
                  <p v-else class="flex justify-center text-gray-700 mt-2">Файл не
                    выбран</p>
                </label>
              </li>
              <li class="relative flex flex-col">
                <label for="login" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                       :class="{'text-red-600/70': data.forms.registration.errors.login }">Логин</label>
                <input v-model="data.forms.registration.form.login" type="text" id="login"
                       class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                       :class="{'border border-red-600/70': data.forms.registration.errors.login }">
                <Error :errors="data.forms.registration.errors.login"/>
              </li>
              <li class="relative flex flex-col">
                <label for="password" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                       :class="{'text-red-600/70': data.forms.registration.errors.password }">Пароль</label>
                <input v-model="data.forms.registration.form.password" type="password" autocomplete="on" id="password"
                       placeholder="••••••••••"
                       class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                       :class="{'border border-red-600/70': data.forms.registration.errors.password }">
                <Error :errors="data.forms.registration.errors.password"/>
              </li>
              <li class="relative flex flex-col sm:col-span-2">
                <label for="email" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                       :class="{'text-red-600/70': data.forms.registration.errors.email }">Почта</label>
                <input v-model="data.forms.registration.form.email" type="email" id="email"
                       class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                       :class="{'border border-red-600/70': data.forms.registration.errors.email }">
                <Error :errors="data.forms.registration.errors.email"/>
              </li>
              <li class="sm:col-span-2 grid grid-cols-1 gap-2">
                <button type="submit" :disabled="data.lists.isProcessing"
                    class="relative w-full bg-blue-500 rounded-xl h-8 p-1 text-white font-medium cursor-pointer hover:bg-blue-400 flex justify-center">
                  <span v-if="!data.lists.isProcessing">Зарегистрироваться</span>
                  <svg v-else aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-black absolute top-1.5" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </button>

                <button @click.prevent="data.modals.isRegistration = false; data.lists.isFileImage = false; data.forms.registration.form.photo_file = ''"
                        class="w-full bg-blue-500 rounded-xl p-1 text-white font-medium cursor-pointer hover:bg-blue-400">
                  Закрыть
                </button>
              </li>
            </ul>
          </form>
        </div>
      </template>
    </transition>

<!--Модальное окно входа-->
    <transition
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
      <template v-if="data.modals.isAuthorization">
        <div class="fixed flex justify-center sm:items-center top-0 bottom-0 right-0 left-0 z-4">
          <div class="flex items-center justify-center fixed bg-black/30 top-0 right-0 left-0 bottom-0"
               @click="data.modals.isAuthorization = false;"/>
          <form v-show="data.modals.isAuthorization" @submit.prevent="authForm(data.forms.authorization.form)"
                class="relative sm:rounded-xl bg-white w-full sm:w-auto h-full sm:h-fit overflow-auto">
            <div class="flex justify-between items-center border-b border-b-gray-200 p-3 text-lg font-semibold">
              <p class="">Вход</p>
              <FontAwesomeIcon :icon="faXmark" class="cursor-pointer hover:text-black/60" @click="data.modals.isAuthorization = false"/>
            </div>
            <ul class="grid grid-cols-1 p-5 gap-6">
              <li class="relative flex flex-col">
                <label for="login" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                       :class="{'text-red-600/70': data.forms.authorization.errors.login }">Логин</label>
                <input v-model="data.forms.authorization.form.login" type="text" id="login"
                       class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                       :class="{'border border-red-600/70': data.forms.authorization.errors.login }">
                <Error :errors="data.forms.authorization.errors.login"/>
              </li>
              <li class="relative flex flex-col">
                <label for="password" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500"
                       :class="{'text-red-600/70': data.forms.authorization.errors.password }">Пароль</label>
                <input v-model="data.forms.authorization.form.password" type="password" autocomplete="on" id="password"
                       placeholder="••••••••••"
                       class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
                       :class="{'border border-red-600/70': data.forms.authorization.errors.password }">
                <Error :errors="data.forms.authorization.errors.password"/>
              </li>
              <li class="grid gap-2">
                <button :disabled="data.lists.isProcessing"
                    class="relative w-full bg-blue-500 h-8 rounded-xl p-1 text-white font-medium cursor-pointer hover:bg-blue-400 flex justify-center">
                  <span v-if="!data.lists.isProcessing">Войти</span>
                  <svg v-else aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-black absolute top-1.5" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </button>
                <button @click.prevent="data.modals.isAuthorization = false"  :disabled="data.lists.isProcessing"
                        class="w-full bg-blue-500 rounded-xl p-1 text-white font-medium cursor-pointer hover:bg-blue-400">
                  Закрыть
                </button>
              </li>
            </ul>
          </form>
        </div>
      </template>
    </transition>

    <Toast @update="updateToastStatus" v-if="data.forms.toast.active" :text="data.forms.toast.message" :icon="data.forms.toast.icon" :active="data.forms.toast.active" />
  </div>
</template>

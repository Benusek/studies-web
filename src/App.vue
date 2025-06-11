<script setup>

import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {
  faArrowLeft,
  faBars, faBook,
  faC,
  faGear,
  faList,
  faN,
  faPlus,
  faSearch,
  faUser, faUserCircle
} from "@fortawesome/free-solid-svg-icons";
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

const allCategories = ref([])
const data = ref({
  lists: {
    isOpenList: false,
    isOpenAside: false,
    isFileImage: false,
    searchExpansion: false,
  },
  modals: {
    isRegistration: false,
    isAuthorization: false
  },
  forms: {
    registration: {
      name: '',
      surname: '',
      patronymic: '',
      login: '',
      password: '',
      email: '',
      photo_file: ''
    },
    authorization: {
      login: '',
      password: ''
    },
    errors: {}
  },

  videoQuery: '',
  categoryQuery: '',
})

onMounted(async () => {
  const result = await apiFetch('GET', `/category`)
  if (result) {
    allCategories.value = result
    categories.value = result
  }
})

const icons = {
  'C#': faWpforms,
  'Vue': faVuejs,
  'Next.js': faN,
  'Node.js': faNodeJs,
  'React': faReact,
  'Flutter': faFlutter,
  'Go': faGolang,
  'Unity': faUnity,
  'Java': faJava,
  'C++': faC,
  'Прочее': faBook
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

const sendForm = async (form) => {
  data.value.forms.errors = {}

  const formData = new FormData()
  for (const key in form) {
    formData.append(key, form[key])
  }

  const result = await apiFetch('POST', '/user', formData, true)
  console.log(result)
  if (result?.error) {
    data.value.forms.errors = result.error.errors
  }
}

const toggleUser = () => {
  data.value.lists.isOpenList === true ? data.value.lists.isOpenList = false : data.value.lists.isOpenList = true
}

const toggleAside = () => {
  data.value.lists.isOpenAside === true ? data.value.lists.isOpenAside = false : data.value.lists.isOpenAside = true
}

const uploadUserPhoto = (input, large, medium, small) => {
  data.value.lists.isFileImage = true
  const images = [large, medium, small]
  const file = input.target.files
  if (file) {
    images.forEach(image => {
      image.src = URL.createObjectURL(new Blob(file))
    })
  }
  file.length === 0 ? data.value.lists.isFileImage = false : null
}

const changeFile = event => {
  data.value.forms.registration.photo_file = event.target.files[0]
}

</script>

<template>
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
        class="absolute right-0 z-2 rounded-xl shadow-xl w-full sm:w-60 md:w-70 h-auto bg-gray-100 cursor-pointer">
      <li class="p-3 flex flex-row gap-2">
        <div class="rounded-full w-[50px] h-[50px] text-lg bg-gray-500 p-2 hidden sm:block"/>
        <div class="flex flex-col text-lg justify-center rounded-t-xl leading-none">
          <span>ITujh</span>
          <span class="text-sm">tujhustify@gmail.com</span>
        </div>
      </li>
      <li class="p-3 border-b border-gray-300 hover:bg-gray-200" @click="data.modals.isRegistration = true">
        Зарегистрироваться
      </li>
      <li class="p-3 border-b border-gray-300 hover:bg-gray-200"> Войти</li>
      <li class="p-3 border-b border-gray-300 hover:bg-gray-200">
        <FontAwesomeIcon class="flex items-center mr-3" :icon="faGear"/>
        <span>Личный кабинет</span>
      </li>
      <li class="p-3 border-b border-gray-300 hover:bg-gray-200">
        <FontAwesomeIcon class="flex items-center mr-3" :icon="faPlus"/>
        <span>Добавить видео</span>
      </li>
      <li class="p-3 hover:bg-gray-200 rounded-b-xl">
        <FontAwesomeIcon class="flex items-center mr-3" :icon="faList"/>
        <span class="col-span-2">Плейлисты</span>
      </li>
    </ul>
  </header>
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
                <FontAwesomeIcon :icon="icons[category.name]" class="text-lg"/>
              </div>
              <div v-if="!data.lists.isOpenAside">
                <span>{{ category.name }}</span>
              </div>
            </div>
          </li>
          <li>
            <RouterLink to="/"><p class="font-medium text-xs pt-2 cursor-pointer"
                                  :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">
              Плейлисты</p></RouterLink>
          </li>
          <li>
            <RouterLink to="/"><p class="font-medium text-xs pt-2 cursor-pointer"
                                  :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">Ваш
              канал</p></RouterLink>
          </li>
          <li>
            <RouterLink to="/"><p class="font-medium text-xs pt-2 cursor-pointer"
                                  :class="{'text-xs': data.lists.isOpenAside, 'ps-3': !data.lists.isOpenAside}">
              Подписки</p></RouterLink>
          </li>
        </ul>
      </div>
    </main>
    <RouterView/>
  </div>

  <transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
  <template v-if="data.modals.isRegistration">
    <div class="fixed flex justify-center items-center top-0 bottom-30 right-0 left-0 z-4">
      <div class="flex items-center justify-center fixed bg-black/30 top-0 right-0 left-0 bottom-0"
           @click="data.modals.isRegistration = false; data.lists.isFileImage = false"/>



      <form v-show="data.modals.isRegistration" @submit.prevent="sendForm(data.forms.registration)" class="relative rounded-xl bg-white">
        <p class="flex justify-center border-b border-b-gray-200 p-3 text-lg font-semibold">Регистрация</p>
        <ul class="grid grid-cols-1 md:grid-cols-2 p-5 gap-6">
          <li class="flex flex-col gap-3 justify-center">
            <div class="relative flex flex-col">
              <label for="name" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500">Имя</label>
              <input v-model="data.forms.registration.name" type="text" name="" id="name" class="border border-gray-300 rounded-lg p-1.5 text-xs">
            </div>
            <div class="relative flex flex-col">
              <label for="surname" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500">Фамилия</label>
              <input v-model="data.forms.registration.surname" type="text" id="surname" class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs">
            </div>
            <div class="relative flex flex-col">
              <label for="patronymic" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500">Отчество</label>
              <input v-model="data.forms.registration.patronymic" type="text" id="patronymic" class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 text-xs">
            </div>
          </li>

          <li class="flex flex-col gap-3">
            <label for="photo" class="cursor-pointer">
            <div class="relative flex flex-row items-end gap-4 justify-center" :class="{'hidden': !data.lists.isFileImage}">
              <img src="#" alt="large image"
                   class="rounded-full aspect-square w-20 h-20 object-cover border border-gray-200 shadow-md hover:brightness-60"
                   ref="largeImg"/>
              <img src="#" alt="medium image"
                   class="rounded-full aspect-square w-15 h-15 object-cover border border-gray-200 shadow-md hover:brightness-60"
                   ref="mediumImg"/>
              <img src="#" alt="small image"
                   class="rounded-full aspect-square w-10 h-10 object-cover border border-gray-200 shadow-md hover:brightness-60"
                   ref="smallImg"/>
            </div>
            <div class="flex flex-row items-end gap-4 justify-center" :class="{'hidden': data.lists.isFileImage}">
              <FontAwesomeIcon class="py-1.5 col-span-1 text-7xl text-gray-300 hover:brightness-60" :icon="faUserCircle"/>
              <FontAwesomeIcon class="py-1.5 col-span-1 text-5xl text-gray-300 hover:brightness-60" :icon="faUserCircle"/>
              <FontAwesomeIcon class="py-1.5 col-span-1 text-3xl text-gray-300 hover:brightness-60" :icon="faUserCircle"/>
            </div>
            <input type="file" id="photo" class="hidden"
                   @change="changeFile($event)" @input="uploadUserPhoto($event, $refs.largeImg, $refs.mediumImg, $refs.smallImg)">

              <p class="flex justify-center text-gray-700 mt-2" v-if="!data.forms.registration.photo_file">Файл не выбран</p>
              <p v-else class=" justify-center text-gray-700 mt-2 w-50 line-clamp-1 break-words">{{ data.forms.registration.photo_file.name }}</p>
            </label>
          </li>
          <li class="relative flex flex-col">
            <label for="login" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500">Логин</label>
            <input v-model="data.forms.registration.login" type="text" id="login" class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20">
          </li>
          <li class="relative flex flex-col">
            <label for="password" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500">Пароль</label>
            <input v-model="data.forms.registration.password" type="password" autocomplete="on" id="password" placeholder="••••••••••"
                   class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20">
          </li>
          <li class="relative flex flex-col md:col-span-2">
            <label for="email" class="absolute bg-white text-sm top-[-10px] left-5 px-1 text-gray-500">Почта</label>
            <input v-model="data.forms.registration.email" type="email" id="email" class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20">
          </li>
          <li class="sm:col-span-2">
            <button
                class="w-full bg-blue-500 rounded-xl p-1 text-white font-medium cursor-pointer hover:bg-blue-400">
              Зарегистрироваться
            </button>
          </li>
        </ul>
      </form>

    </div>

    <!--      </div>-->
    <!--    </div>-->

  </template>
  </transition>
</template>

<style scoped>
</style>

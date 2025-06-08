<script setup>

import {ref} from "vue";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import ApiFetch from "@/helpers/apiFetch.js";
import {faArrowLeft, faSearch, faUser} from "@fortawesome/free-solid-svg-icons";

const searchQuery = ref('')
const searchExpansion = ref(false)

const sendSearch = async() => {
  const result = await ApiFetch('GET', `/video/start/0/count/30?query=${searchQuery.value}`)
  console.log(result);
}

const isRegistration = ref(false)
const isEntry = ref(false)
</script>

<template>
  <header>
    <nav>
      <ul class="flex justify-between gap-3 border-b border-gray-200 p-3 w-full">
        <RouterLink to="/" class="flex sm:flex flex-row items-center" :class="{'hidden': searchExpansion}">
          <img src="/src/assets/logo.svg" alt="logo" class="w-10">
          <p class="">Studies</p>
        </RouterLink>
        <li class="flex sm:w-120" :class="{'w-full': searchExpansion}" >
          <button @click="searchExpansion = false"  :class="{'flex': searchExpansion, 'hidden': !searchExpansion}" type="submit" class="sm:hidden items-center p-2 text-sm font-medium cursor-pointer">
            <FontAwesomeIcon :icon="faArrowLeft"/>
          </button>
          <form @submit.prevent="sendSearch" class="relative w-full h-[38px]">
            <input v-model="searchQuery"  type="search" :class="{'hidden': !searchExpansion}" class=" sm:block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg
              rounded-s-gray-100 border border-gray-300" placeholder="Поиск"/>
            <button type="submit" class="hidden sm:flex items-center absolute top-0 end-0 p-2 h-full text-sm font-medium
            sm:rounded-e-lg sm:text-white sm:bg-blue-700 sm:border sm:border-blue-700 sm:hover:bg-blue-800
            cursor-pointer">
              <FontAwesomeIcon :icon="faSearch"/>
            </button>
          </form>
        </li>
        <li>
          <button :class="{'hidden': searchExpansion}" class="flex sm:flex justify-center items-center cursor-pointer p-2 w-10 h-10">
            <FontAwesomeIcon :icon="faUser" class="text-lg"/>
          </button>
          <button @click="searchExpansion = true" class="sm:hidden items-center justify-center p-2 w-10 h-10 text-sm font-medium cursor-pointer ">
            <FontAwesomeIcon :icon="faSearch"/>
          </button>
        </li>
      </ul>
    </nav>
  </header>
  {{searchQuery}}

  <RouterView/>

  <!--  <button data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">-->
  <!--    Toggle modal-->
  <!--  </button>-->

  <!--  <div id="authentication-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">-->
  <!--    <div class="relative p-4 w-full max-w-md max-h-full">-->
  <!--      &lt;!&ndash; Modal content &ndash;&gt;-->
  <!--      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">-->
  <!--        &lt;!&ndash; Modal header &ndash;&gt;-->
  <!--        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">-->
  <!--          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">-->
  <!--            Sign in to our platform-->
  <!--          </h3>-->
  <!--          <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">-->
  <!--            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">-->
  <!--              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>-->
  <!--            </svg>-->
  <!--            <span class="sr-only">Close modal</span>-->
  <!--          </button>-->
  <!--        </div>-->
  <!--        &lt;!&ndash; Modal body &ndash;&gt;-->
  <!--        <div class="p-4 md:p-5">-->
  <!--          <form class="space-y-4" action="#">-->
  <!--            <div>-->
  <!--              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>-->
  <!--              <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />-->
  <!--            </div>-->
  <!--            <div>-->
  <!--              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>-->
  <!--              <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />-->
  <!--            </div>-->
  <!--            <div class="flex justify-between">-->
  <!--              <div class="flex items-start">-->
  <!--                <div class="flex items-center h-5">-->
  <!--                  <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />-->
  <!--                </div>-->
  <!--                <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>-->
  <!--              </div>-->
  <!--              <a href="#" class="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>-->
  <!--            </div>-->
  <!--            <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>-->
  <!--            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">-->
  <!--              Not registered? <a href="#" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>-->
  <!--            </div>-->
  <!--          </form>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style scoped>
</style>

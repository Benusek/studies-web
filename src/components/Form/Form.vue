<script setup>
import Error from '@/components/Modal/Error.vue'
import { inject, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import {removeFile, changeFile} from '@/helpers/fileHandler.js'
import FileUpload from '@/components/Modal/FileUpload.vue'

const updateToken = inject('updateToken')
const showToast = inject('showToast')
const getData = inject('getData')

const form = ref({
  data: {},
  errors: {},
  isProcess: false,
  drop: false
})

const emit = defineEmits(['exit'])
const props = defineProps({
  forms: Object,
})

const post = async () => {
  if (form.value.isProcess) return
  form.value.isProcess = true
  form.value.errors = {}

  const formData = new FormData()
  for (const key in form.value.data) {
    if (form.value.data[key]) {
      formData.append(key, form.value.data[key])
      console.log(key, form.value.data[key])
    }
  }
  const result = await apiFetch(props.forms.method, props.forms.route, formData)

  if (result.error?.message && !result.error?.errors) {
    form.value.errors.password = [result.error.message]
    form.value.errors.login = []
  } else if (result.error?.message && result.error?.errors) {
    form.value.errors = result.error.errors
  }

  if (result.data) {
    if (result.data.user_token) {
      updateToken(result.data.user_token)
      getData(result.data.user)
    }
    exit(result.data.message)
  }
  console.log(result)
  form.value.isProcess = false
}

const exit = async (message) => {
  emit('exit')
  showToast(message, faCheck)
}

</script>

<template>
  <form @submit.prevent="post" class="gap-4 grid grid-cols-1 md:grid-cols-2">
    <li v-for="input in forms.inputs" class="list-none" :class="{'col-span-full': input.type.includes('file')}">
      <div v-if="!input.type.includes('file')">
        <label :for="input.code" class="text-zinc-500 px-1 text-xs">
          {{ input.label }}
        </label>
        <input v-model="form.data[input.code]" :type="input.type" :id="input.code" class="border border-gray-300 peer w-full rounded-lg p-1.5 bg-zinc-100"
            :class="{'border border-red-600/70': form.errors[input.code]}"
            :autocomplete="input.type.includes('password') ? 'on' : null">
      </div>
      <FileUpload
        v-else
        :errors="form.errors[input.code] || []"
        :file="form.data"
        :type="input.code"
        :name="input.label"
        @change="(event, key, source) => changeFile(event, key, form.data, source)"
        @remove="(key) => removeFile(key, form.data, form.errors)"
      />
      <Error :errors="form.errors[input.code]" />
    </li>
    <button :disabled="form.isProcess"  class="relative disabled:opacity-70 w-full bg-indigo-600 rounded-lg p-1.5
    items-center text-white font-medium cursor-pointer hover:bg-indigo-700 col-span-full">
      <span>
        {{ forms['submit'] }}
      </span>
    </button>
  </form>
</template>
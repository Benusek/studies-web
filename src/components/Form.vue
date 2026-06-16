<script setup>
import Error from '@/components/Modal/Error.vue'
import { inject, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import File from '@/components/Modal/FileUpload.vue'

const updateToken = inject('updateToken')
const showToast = inject('showToast')
const getData = inject('getData')

const form = ref({
  data: {},
  errors: {},
  isProcess: false,
  drop: false,
  progress: null
})

//TODO: Repeating from CreateVideoView.vue
const changeFile = (event, key, target) => {
  if (event[target].files.length) {
    form.value.data[key] = event[target].files[0]
    form.value.data[key + 'name'] = event[target].files[0].name

    if (form.value.data[key + 'blob']) {
      URL.revokeObjectURL(form.value.data[key + 'blob'])
    }

    form.value.data[key + 'blob'] =
        URL.createObjectURL(event[target].files[0])
  }
}

const removeFile = (key) => {
  if (form.value.data[key + 'blob']) {
    URL.revokeObjectURL(form.value.data[key + 'blob'])
  }

  delete form.value.data[key]
  delete form.value.data[key + 'blob']
  delete form.value.data[key + 'name']

  if (form.value.errors[key]) {
    delete form.value.errors[key]
  }
}

const emit = defineEmits(['exit'])
const props = defineProps({
  forms: Object
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
  form.value.isProcess = false
}

const exit = (message) => {
  emit('exit')
  message.message ? showToast(message.message, faCheck) : null
}

</script>

<template>
  <form @submit.prevent="post()" class="flex flex-col gap-4 grid grid-cols-1 lg:grid-cols-2">
    <li v-for="input in forms.inputs" class="relative flex flex-col" :class="{'col-span-full': input.type.includes('file')}">
      <div
          v-if="!input.type.includes('file')"
          :class="{
    'flex justify-around border border-gray-300 rounded-lg p-1.5':
      input.type.includes('checkbox')}">
        <label :for="input.code" class="text-gray-500 select-none cursor-text" :class="{ 'text-red-600/70': form.errors[input.code], 'top-[-18px] px-1 text-xs': form.data[input.code] && !input.type.includes('checkbox'),
      'peer-focus:text-xs peer-focus:top-[-18px] peer-focus:px-1 transition-all duration-300 absolute top-1.5 left-2': !input.type.includes('checkbox'), '': input.type.includes('checkbox')}">
          {{ input.label }}
        </label>
        <select
            v-if="input.type === 'select'"
            v-model="form.data[input.code]"
            :id="input.code"
            class="peer w-full border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
            :class="{ 'border-red-600/70': form.errors[input.code] }">
          <option value="" disabled>Выберите категорию</option>
          <option
              v-for="option in input.options"
              :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <input
            v-else
            v-model="form.data[input.code]"
            :type="input.type"
            :id="input.code"
            class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
            :class="{'border border-red-600/70': form.errors[input.code], 'w-auto': input.type.includes('checkbox'), 'peer w-full': !input.type.includes('checkbox')}"
            :autocomplete="input.type.includes('password') ? 'on' : null">
      </div>
      <File v-else :file="form.data" :type="input.code" :name="input.label" @change="changeFile" @remove="removeFile"/>
      <Error :errors="form.errors[input.code]" />
    </li>
    <div v-if="form.progress !== 100 & form.progress !== null" class="space-y-2 col-span-full">
      <div class="flex justify-between text-sm">
        <div class="text-xs">
          <span>Загрузка видео {{ form.progress }}%</span>
        </div>
        <span class="text-xs text-zinc-400">{{ form.uploaded }} MB / {{ form.total }} MB</span>
      </div>
      <div class="h-2 bg-slate-700/30 rounded-full overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-300"
             :style="{ width: `${form.progress}%` }"/>
      </div>
    </div>
    <button :disabled="form.isProcess"
            class="relative disabled:opacity-70 w-full bg-indigo-600 rounded-lg p-1.5 items-center text-white font-medium cursor-pointer hover:bg-indigo-700 col-span-full">
      <span>{{ forms['submit'] }}</span>
    </button>
  </form>
</template>
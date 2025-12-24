<script setup>
import Error from '@/components/Modal/Error.vue'
import { inject, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Loading from '@/components/Loaders/Loading.vue'
import File from '@/components/Modal/File.vue'
import Resumable from 'resumablejs'

const api = import.meta.env.VITE_APP_API

const token = inject('token').value
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

const emit = defineEmits(['exit'])
const props = defineProps({
  forms: Object
})

const changeFile = (event, key, target) => {
  if (event[target].files.length) {
    form.value.data[key] = event[target].files[0]
    form.value.data[key + 'name'] = event[target].files[0].name
    if (form.value.data[key + 'blob']) URL.revokeObjectURL(form.value.data[key + 'blob'])
    form.value.data[key + 'blob'] = URL.createObjectURL(event[target].files[0])
  }
}

const post = async () => {
  if (form.value.isProcess) return
  form.value.isProcess = true
  form.value.errors = {}

  const formData = new FormData()
  for (const key in form.value.data) {
    if (form.value.data[key]) {
      formData.append(key, form.value.data[key])
    }
  }

  switch (props.forms['route']) {
    case '/video': {
      formData.delete('video')
      //TODO: Incorrect int value "true" in database - Radio only true or false
      formData.append('public', 1)
      const result = await apiFetch('POST', '/meta', formData)

      if (result.errors) {
        form.value.errors = result['errors']
        break
      }

      const meta = result.data['upload_token']
      const r = new Resumable({
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        target: `${api}/api/video`,
        chunkSize: 10 * 1024 * 1024,
        testChunks: false,
        maxChunkRetries: 0,
        query: { 'upload_token': meta }
      })
      r.addFile(form.value.data['video'])
      r.on('fileAdded', function(file, event) {
        r.upload()
      })
      r.on('fileProgress', function(file) {
        form.value.progress = Math.floor(file.progress(true) * 100)
      })
      r.on('fileError', function(file, err) {
        form.value.errors = JSON.parse(err)['errors']
      })
      r.on('chunkingError', function(file, message) {
        console.error('Chunk error:', message)
      })
      r.on('fileSuccess', function(file, message) {
        exit(JSON.parse(message).data)
      })
      break
    }
    default: {
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
      break
    }
  }
  form.value.isProcess = false
}

const exit = (message) => {
  emit('exit')
  message.message ? showToast(message.message, faCheck) : null
}

</script>

<template>
  <form @submit.prevent="post()" class="flex flex-col gap-4 grid grid-cols-1 md:grid-cols-2">
    <li v-for="input in forms.inputs" class="relative flex flex-col" :class="{'col-span-full': input.type.includes('file')}">
      <div v-if="!input.type.includes('file')"
           :class="{'flex justify-around border border-gray-300 rounded-lg p-1.5':input.type.includes('checkbox')}">
        <label
          :for="input.code" class="text-gray-500 select-none cursor-text"
          :class="{'text-red-600/70': form.errors[input.code], 'top-[-18px] px-1 text-xs ': form.data[input.code] && !input.type.includes('checkbox'),
          'peer-focus:text-xs peer-focus:top-[-18px] peer-focus:px-1 transition-all duration-300 absolute top-1.5 left-2': !input.type.includes('checkbox'),
          '': input.type.includes('checkbox')}">
          {{ input.label }}
        </label>
        <input v-model="form.data[input.code]" :type="input.type" :id="input.code"
               class="border border-gray-300 rounded-lg p-1.5 bg-gray-100/20"
               :class="{'border border-red-600/70': form.errors[input.code], 'w-auto': input.type.includes('checkbox'), 'peer w-full':!input.type.includes('checkbox')}"
               :autocomplete="input.type.includes('password')?'on':null">
      </div>
      <File v-else :file="form.data" :type="input.code" :name="input.label" @change="changeFile"/>
      <Error :errors="form.errors[input.code]" />
    </li>
    <div v-if="form.progress !== 100 & form.progress !== null" class="flex flex-col gap-1 md:col-span-2 lg:col-span-full">
      <p class="text-xs self-center">Загрузка видео на сервер</p>
      <div
        class="w-full bg-gray-400 rounded rounded-full border-2 border-gray-400 overflow-hidden relative flex justify-center">
        <div class="bg-green-500 h-full flex left-0 absolute transition-all duration-100 ease-in"
             :style="{'width': `${form.progress}%`}"></div>
        <p class="text-white text-xs font-medium p-1 relative">{{ form.progress }}%</p>
      </div>
    </div>
    <button :disabled="form.isProcess"
            class=" relative h-8 w-full bg-blue-500 rounded-xl p-1 text-white font-medium cursor-pointer hover:bg-blue-400 flex justify-center md:col-span-2 lg:col-span-full">
      <span v-if="!form.isProcess">{{ forms['submit'] }}</span>
      <Loading v-else :size="6" />
    </button>
  </form>
</template>
<script setup>
import Error from '@/components/Modal/Error.vue'
import { inject, ref } from 'vue'
import apiFetch from '@/helpers/apiFetch.js'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Loading from '@/components/Loaders/Loading.vue'
import File from '@/components/Modal/File.vue'
import Resumable from 'resumablejs';

const api = import.meta.env.VITE_APP_API

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
  forms: Object
})

const changeFile = (event, key, target) => {
  if (event[target].files.length) {
    form.value.data[key] = event[target].files[0]
    form.value.data[key + 'name'] = event[target].files[0].name
    form.value.data[key + 'blob'] = URL.createObjectURL(event[target].files[0])
  }
}

const token = inject('token')
const post = async () => {
  if (form.value.isProcess) return
  form.value.isProcess = true
  form.errors = {}

  const formData = new FormData()
  for (const key in form.value.data) {
    if (form.value.data[key]) {
      formData.append(key, form.value.data[key])
    }
  }

  if (props.forms['route'] === '/video' && props.forms['method'] === 'POST') {
    const r = new Resumable({
      headers: {'Authorization': `Bearer ${localStorage.getItem('user_token')}`, "Accept": "application/json"},
      target: `${api}/api/video`,
      chunkSize: 10 * 1024 * 1024,
      testChunks: false,
      maxChunkRetries: 0,
      fileParameterName: 'video',
      query: {
        title: form.value.data['title'] ? form.value.data['title'] : '',
        description: form.value.data['description'] ? form.value.data['description'] : '',
        category_id: form.value.data['category_id'] ? form.value.data['category_id'] : '',
      },
    })
    r.addFile(form.value.data['video'])
    r.on('fileAdded', function(file, event) {
      r.upload()
    })
    r.on('fileProgress', function(file){
      console.log(file.progress() * 100)
    })
    r.on('fileError', function(file, err){
      form.value.errors = JSON.parse(err)['errors']
    })
    r.on('chunkingError', function (file, message) {
      console.error("Chunk error:", message);
    });
  }
  else {
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
      emit('exit')
      result.data.message ? showToast(result.data.message, faCheck) : null
    }
  }


  form.value.isProcess = false
}

</script>

<template>
  <form @submit.prevent="post()" class="flex flex-col gap-5">
    <li v-for="input in forms.inputs" class="relative flex flex-col">
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
      <File v-else :file="form.data" :type="input.code" :name="input.label" @change="changeFile" @drop="changeFile" />
      <Error :errors="form.errors[input.code]" />
    </li>
    <button :disabled="form.isProcess"
            class="relative w-full bg-blue-500 rounded-xl p-1 text-white font-medium cursor-pointer hover:bg-blue-400 flex justify-center">
      <span v-if="!form.isProcess">{{ forms.submit }}</span>
      <Loading v-else :size="6" />
    </button>
<!--    <div class="w-full bg-neutral-quaternary rounded-full h-2.5">-->
<!--      <div class="bg-blue-400 h-2.5 rounded-full" style="width: 4%"></div>-->
<!--    </div>-->
<!--    1%-->
  </form>
</template>
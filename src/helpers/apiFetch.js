export default async function(method, url, body = null) {
  const api = import.meta.env.VITE_APP_API
  const options = {
    method,
    headers: {
      Accept: 'application/json'
    }
  }
  localStorage.getItem('user_token') ? options.headers.Authorization = `Bearer ${localStorage.getItem('user_token')}` : null

  if (body) {
    if (body instanceof FormData) {
      options.body = body
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    }
  }
  const response = await fetch(`${api}/api${url}`, options)

  console.log(response)
  if (response.status === 403) {
    localStorage.clear()
    window.location.replace('/')
  }

  try {
    return await response.json()
  } catch (e) {
    return null
  }
}
export default async function(method, url, body = null) {
    const options = {
        method,
        headers: {
            Accept: 'application/json',
        }
    }

    if (localStorage.getItem('user-token')) {
        options.headers.Authorization = `Bearer ${localStorage.getItem('user-token')}`
    }



    if (body) {
        if (body instanceof FormData) {
            options.body = body
        }
        else {
            options.headers['Content-Type'] = 'application/json'
            options.body = JSON.stringify(body)
        }
    }

    const response = await fetch (`http://videoapi/api-video${url}`, options)

    console.log(response);
    if (response.status === 403) {
        localStorage.removeItem('user-token')
        localStorage.removeItem('user-id')
        localStorage.removeItem('user-role')
        window.location.replace('/')
    }

    try {
        return await response.json()
    }
    catch (e) {
        return null;
    }
}
export default async function(method, url, body = null, isBlob = false) {
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
    if (response.status === 401) {
        localStorage.removeItem('user-token')
        window.location.replace('/auth')
    }

    try {
        // if (isBlob && await response.status !== 422) {
        //     return await response.blob()
        // }
        return await response.json()
    }
    catch (e) {
        return null;
    }
}
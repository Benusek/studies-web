export const changeFile = (event, key, form) => {
    const file = event.target.files?.[0]

    if (!file) {
        return
    }

    form.data[key] = file
    form.data[key + 'name'] = file.name

    if (form.data[key + 'blob']) {
        URL.revokeObjectURL(
            form.data[key + 'blob']
        )
    }

    form.data[key + 'blob'] =
        URL.createObjectURL(file)
}


export const removeFile = (key, form) => {

    if (form.value.data[key + 'blob']) {
        URL.revokeObjectURL(
            form.value.data[key + 'blob']
        )
    }


    delete form.value.data[key]
    delete form.value.data[key + 'blob']
    delete form.value.data[key + 'name']


    if (form.value.errors[key]) {
        delete form.value.errors[key]
    }
}
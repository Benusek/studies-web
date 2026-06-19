export const changeFile = (event, key, form, source = 'target') => {
    const file =
      source === 'dataTransfer'
        ? event.dataTransfer?.files?.[0]
        : event.target?.files?.[0]

    if (!file) return
    console.log(file)
    form[key] = file
    form[key + 'name'] = file.name

    if (form[key + 'blob']) {
        URL.revokeObjectURL(form[key + 'blob'])
    }

    form[key + 'blob'] = URL.createObjectURL(file)
    console.log(form[key + 'blob'])
}

export const removeFile = (key, form, errors = null) => {
    if (form[key + 'blob']) {
        URL.revokeObjectURL(form[key + 'blob'])
    }

    delete form[key]
    delete form[key + 'blob']
    delete form[key + 'name']

    if (errors?.[key]) {
        delete errors[key]
    }
}
export default function toggleTag(tags, id) {
    const index = tags.indexOf(id)

    if (index === -1) {
        tags.push(id)
    } else {
        tags.splice(index, 1)
    }
}
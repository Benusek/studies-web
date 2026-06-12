import { ref } from 'vue'
import Hls from 'hls.js'

export function useHlsVideo(api) {
    const activeVideoEl = ref(null)
    const activeHls = ref(null)

    const stop = (videos = []) => {
        if (activeVideo.value) {
            activeVideo.value.pause()
        }

        if (activeHls.value) {
            activeHls.value.destroy()
        }

        activeVideoEl.value = null
        activeHls.value = null

        videos.forEach(v => {
            v.isHover = false
            v.progress = 0
            v.isMuted = true
        })
    }

    const play = async (video, el) => {
        if (activeVideoEl.value && activeVideoEl.value !== el) {
            stop()
        }

        if (!Hls.isSupported()) return

        const hls = new Hls({ autoStartLoad: true })

        activeVideoEl.value = el
        activeHls.value = hls

        hls.loadSource(`${api}/${video.video}`)
        hls.attachMedia(el)

        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
            try {
                await el.play()
                video.isMuted = true
                video.isHover = true
            } catch {
                // autoplay blocked
            }
        })
    }

    return {
        play,
        stop,
        activeVideoEl
    }
}
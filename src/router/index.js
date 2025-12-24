import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChannelView from '@/views/ChannelView.vue'
import PlaylistsView from '@/views/PlaylistsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import SearchView from '@/views/SearchView.vue'
import WatchingView from '@/views/WatchingView.vue'
import PlaylistVideosView from '@/views/PlaylistVideosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Главная'
      }
    },
    {
      path: '/category/:category',
      name: 'category',
      component: HomeView
    },
    {
      path: '/search/:query',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/channel/:id',
      name: 'channel',
      component: ChannelView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        forAuth: true
      }
    },
    {
      path: '/watch/:video',
      name: 'watch',
      component: WatchingView,
      meta: {
        forAuth: false
      }
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: PlaylistsView,
      meta: {
        forAuth: true
      }
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      component: PlaylistVideosView,
    },
  ],
})

router.afterEach((to) => {
    document.title = to.meta['title'] || 'Studies'
})

router.beforeResolve(async to => {
  if (to.meta['forAuth'] && !localStorage.getItem('user_token')) {
    await router.replace('/')
  }
})

export default router

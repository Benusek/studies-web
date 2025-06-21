import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChannelView from '@/views/ChannelView.vue'
import MyReportsView from '@/views/MyReportsView.vue'
import PlaylistsView from '@/views/PlaylistsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import SubscribersView from '@/views/SubscribersView.vue'
import ReportsView from '@/views/ReportsView.vue'
import SearchView from '@/views/SearchView.vue'
import WatchingView from '@/views/WatchingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/category/:category',
      name: 'category',
      component: HomeView,
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
      path: '/subscribers',
      name: 'subscribers',
      component: SubscribersView,
      meta: {
        forAuth: true
      }
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
    // {
    //   path: '/my-reports',
    //   name: 'my-reports',
    //   component: MyReportsView,
    //   meta: {
    //     forAuth: true
    //   }
    // },
    {
      path: '/playlists',
      name: 'playlists',
      component: PlaylistsView,
      meta: {
        forAuth: true
      }
    },
    // {
    //   path: '/reports',
    //   name: 'reports',
    //   component: ReportsView,
    //   meta: {
    //     forAuth: true
    //   }
    // }
  ],
})

router.beforeResolve(async to => {
  console.log(to)
  if (to.meta.forAuth && !localStorage.getItem('user-token')) {
    await router.replace('/')
  }
})

export default router

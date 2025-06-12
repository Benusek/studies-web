import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    }
  ],
})

router.beforeResolve(async to => {
  console.log(to)
  if (to.meta.forAuth && !localStorage.getItem('user-token')) {
    await router.replace('/')
  }
})

export default router

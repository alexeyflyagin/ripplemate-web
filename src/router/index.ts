import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import MainView from '@/views/main/MainView/MainView.vue'
import { useAuthStore } from '@/stores/domain/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      meta: { state: 'authorized' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { state: 'guest' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { state: 'guest' },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (
    to.meta.state === 'authorized' &&
    !authStore.isAuthenticated
  ) {
    return { name: 'login' }
  }

  if (
    to.meta.state === 'guest' &&
    authStore.isAuthenticated
  ) {
    return { name: 'main' }
  }
})

export default router

import {
  createRouter,
  createWebHistory,
  type RouteLocationNamedRaw,
} from 'vue-router'
import MainView from '@/views/main/MainView/MainView.vue'
import HomeView from '@/views/main/HomeView/HomeView.vue'
import FlowView from '@/views/main/FlowView/FlowView.vue'
import { useAuthStore } from '@/stores/domain/auth'
import { useWorkspaceStore } from '@/stores/domain/workspace'
import AuthView from '@/views/auth/AuthView.vue'
import { useAccountStore } from '@/stores/domain/account'

declare module 'vue-router' {
  interface RouteMeta {
    isPublic?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: { render: () => null },
    },
    {
      path: '/w/:workspaceId',
      component: MainView,
      children: [
        {
          path: '',
          name: 'library',
          component: HomeView,
        },
        {
          path: 'flow',
          name: 'flow',
          component: FlowView,
        },
      ],
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: AuthView,
    },
    {
      path: '/auth',
      name: 'auth',
      meta: { isPublic: true },
      component: AuthView,
    },
    {
      path: '/register',
      name: 'register',
      meta: { isPublic: true },
      component: AuthView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { isPublic: true },
      component: AuthView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      meta: { isPublic: true },
      component: AuthView,
    },
  ],
})

function authorizedHome(): RouteLocationNamedRaw {
  const workspaceStore = useWorkspaceStore()
  const first = workspaceStore.workspaces[0]
  if (first) {
    return {
      name: 'library',
      params: { workspaceId: first.id },
    }
  }
  return { name: 'root' }
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const accountStore = useAccountStore()
  const isPublic = to.meta.isPublic ?? false

  if (authStore.isAuthorized) {
    await authStore.initializeUserData()
  }

  if (
    to.name !== 'verify-email' &&
    authStore.isAuthorized &&
    !accountStore.account?.is_verified
  ) {
    return { name: 'verify-email' }
  }

  if (
    accountStore.account?.is_verified &&
    authStore.isAuthorized &&
    to.name === 'root'
  ) {
    return authorizedHome()
  }

  if (isPublic && authStore.isAuthorized) {
    return authorizedHome()
  }

  if (!isPublic && !authStore.isAuthorized) {
    return { name: 'auth' }
  }
})

export default router

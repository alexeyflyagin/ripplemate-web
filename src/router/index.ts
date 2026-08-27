import {
  createRouter,
  createWebHistory,
  type RouteLocationNamedRaw,
} from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import MainView from '@/views/main/MainView/MainView.vue'
import HomeView from '@/views/main/HomeView/HomeView.vue'
import FlowView from '@/views/main/FlowView/FlowView.vue'
import { useAuthStore } from '@/stores/domain/auth'
import { useWorkspaceStore } from '@/stores/domain/workspace'

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
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { isPublic: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegisterView,
      meta: { isPublic: true },
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
  const auth = useAuthStore()
  const isPublic = to.meta.isPublic ?? false

  if (auth.isAuthorized) {
    await auth.initializeUserData()
  }

  if (!isPublic && !auth.isAuthorized) {
    return { name: 'login' }
  }

  if (isPublic && auth.isAuthorized) {
    return authorizedHome()
  }

  if (to.name === 'root' && auth.isAuthorized) {
    const target = authorizedHome()
    if (target.name !== 'root') {
      return target
    }
  }
})

export default router

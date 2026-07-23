import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AccountRead } from '@/api/types'
import { getAccount as getAccountApi } from '@/api/repositories/account'

export const useAccountStore = defineStore(
  'account',
  () => {
    const account = ref<AccountRead>()

    async function getAccount() {
      account.value = await getAccountApi()
    }

    return {
      account,
      getAccount,
    }
  },
)

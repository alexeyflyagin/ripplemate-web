import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AccountRead } from '@/api/types'
import { getAccount as getAccountApi } from '@/api/repositories/account'
import {
  requestVerifyEmail as requestVerifyEmailApi,
  verifyEmail as verifyEmailApi,
} from '@/api/repositories/verification'

export const useAccountStore = defineStore(
  'account',
  () => {
    const account = ref<AccountRead>()

    async function getAccount() {
      account.value = await getAccountApi()
    }

    async function requestVerifyEmail() {
      if (!account.value) return
      await getAccount()
      return requestVerifyEmailApi({
        email: account.value.email,
      })
    }

    function verifyEmail(code: string) {
      if (!account.value) return
      return verifyEmailApi({
        email: account.value.email,
        code,
      }).then(() => {
        if (account.value) account.value.is_verified = true
      })
    }

    return {
      account,
      getAccount,
      requestVerifyEmail,
      verifyEmail,
    }
  },
)

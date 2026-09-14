import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type {
  UseFocusTrapOptions,
  UseFocusTrapReturn,
} from '@vueuse/integrations/useFocusTrap'
import { onBeforeUnmount, onMounted } from 'vue'

// Stack of active traps; activating one fully deactivates (not pauses) the one below it,
// since pause() leaves listeners in place and they still fight over focus.
const trapStack: UseFocusTrapReturn[] = []

function registerTrap(trap: UseFocusTrapReturn) {
  if (trapStack.includes(trap)) return
  trapStack.at(-1)?.deactivate({ returnFocus: false })
  trapStack.push(trap)
}

function unregisterTrap(trap: UseFocusTrapReturn) {
  const index = trapStack.lastIndexOf(trap)
  if (index === -1) return
  trapStack.splice(index, 1)
  trapStack.at(-1)?.activate()
}

// Drop-in replacement for `useFocusTrap` that coordinates with other traps from this composable.
export function useManagedFocusTrap(
  target: Parameters<typeof useFocusTrap>[0],
  options?: UseFocusTrapOptions,
): UseFocusTrapReturn {
  const { immediate, ...restOptions } = options ?? {}

  const trap = useFocusTrap(target, restOptions)

  const activate: UseFocusTrapReturn['activate'] = (
    ...args
  ) => {
    registerTrap(trap)
    return trap.activate(...args)
  }

  const deactivate: UseFocusTrapReturn['deactivate'] = (
    ...args
  ) => {
    unregisterTrap(trap)
    return trap.deactivate(...args)
  }

  if (immediate) {
    onMounted(() => activate())
  }

  onBeforeUnmount(() => {
    // Always deactivate on unmount so the trap below it in the stack reactivates.
    trap.deactivate({ returnFocus: false })
    unregisterTrap(trap)
  })

  return {
    ...trap,
    activate,
    deactivate,
  }
}

import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type {
  UseFocusTrapOptions,
  UseFocusTrapReturn,
} from '@vueuse/integrations/useFocusTrap'
import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Global stack of currently registered focus traps.
 *
 * Whenever a new trap is activated, the previously active trap (the one
 * on top of the stack) is FULLY deactivated (not just paused). When the
 * top trap is deactivated/unmounted, the next one down the stack is
 * fully re-activated. This lets any number of nested overlays (dialogs
 * inside menus, menus inside sidebars, etc.) each keep their own
 * `useFocusTrap` instance without fighting each other over focus.
 *
 * This deliberately uses deactivate()/activate() rather than focus-trap's
 * own pause()/unpause(). pause() only flips an internal flag and leaves
 * the rest of the trap's state/listeners in place, which in practice
 * still ends up reacting to focus changes it shouldn't once another trap
 * is active on top of it. A full deactivate() tears down the trap's
 * document-level listeners entirely, so only ever one trap's listeners
 * exist at a time — there is nothing left for it to fight with.
 */
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

/**
 * Drop-in replacement for VueUse's `useFocusTrap` that coordinates with
 * every other trap created via this composable, so nested/stacked
 * overlays never end up with two active traps fighting for focus at the
 * same time.
 *
 * Usage is identical to `useFocusTrap` — including `options.immediate`.
 */
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
    // Always deactivate on unmount, regardless of whether the
    // consumer remembered to call `deactivate()` itself. This is what
    // actually unregisters the trap's own document-level listeners
    // and hands focus control back to the trap below it in the
    // stack. Consumers should NOT call `deactivate()` themselves
    // just because an item was clicked/handled — only call it when
    // the overlay is actually about to close/unmount. Deactivating
    // while the overlay stays open leaves it fully interactive but
    // unprotected, while the trap underneath (e.g. a parent sidebar)
    // becomes active again and fights over focus with content that
    // lives outside its own DOM subtree.
    trap.deactivate({ returnFocus: false })
    unregisterTrap(trap)
  })

  return {
    ...trap,
    activate,
    deactivate,
  }
}

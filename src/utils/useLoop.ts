export function useLoop() {
  let loopId: number | null = null
  let stopTimeout: number | undefined = undefined

  function startLoop(
    action: () => void,
    timeout?: number,
    lastUsing?: boolean,
  ) {
    if (loopId) return

    function loop() {
      action()
      loopId = requestAnimationFrame(loop)
    }

    clearTimeout(stopTimeout)
    stopTimeout = setTimeout(() => {
      stopLoop()
      if (lastUsing) action()
    }, timeout)

    loopId = requestAnimationFrame(loop)
  }

  function stopLoop() {
    if (loopId === null) return
    cancelAnimationFrame(loopId)
    loopId = null
  }

  return { startLoop, stopLoop }
}

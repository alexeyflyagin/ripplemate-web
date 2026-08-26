export function mergeObject<
  T extends Record<string, unknown>,
>(target: T, source: Partial<T>): T {
  const toUpdate = Object.fromEntries(
    Object.entries(source).filter(
      ([_, val]) => val !== undefined,
    ),
  )
  return { ...target, ...toUpdate }
}

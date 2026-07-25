export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item)
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<K, T[]>,
  )
}

export function groupByMap<T, K extends string | number, V>(
  array: T[],
  keyFn: (item: T) => K,
  mapFn: (item: T) => V,
): Record<K, V[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item)
      if (!acc[key]) acc[key] = []
      acc[key].push(mapFn(item))
      return acc
    },
    {} as Record<K, V[]>,
  )
}

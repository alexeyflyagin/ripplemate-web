export function getNextInArray<T>(
  array: readonly T[],
  current: T,
): T {
  let index = array.indexOf(current)
  index = index === -1 ? 0 : index + 1
  if (index >= array.length) index %= array.length
  return array[index]!
}

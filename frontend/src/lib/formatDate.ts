export const formatDate = (dateStr: string, interval: string): string => {
  const date = new Date(dateStr)

  const dd = String(date.getUTCDate()).padStart(2, '0')
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = date.getUTCFullYear()

  let result = `${dd}.${mm}.${yyyy}`

  if (interval === 'HOUR') {
    const hh = String(date.getUTCHours()).padStart(2, '0')
    const min = String(date.getUTCMinutes()).padStart(2, '0')
    result += ` ${hh}:${min}`
  }

  return result
}

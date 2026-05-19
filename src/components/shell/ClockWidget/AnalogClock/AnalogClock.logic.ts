export type HandAngles = {
  hour: number
  minute: number
  second: number
}

export function getHandAngles(date: Date): HandAngles {
  const seconds = date.getSeconds()
  const minutes = date.getMinutes()
  const hours = date.getHours()

  return {
    second: seconds * 6,
    minute: minutes * 6 + seconds * 0.1,
    hour: (hours % 12) * 30 + minutes * 0.5,
  }
}

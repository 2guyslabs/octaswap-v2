import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStringNumber(
  input: string,
  intWithDecimals: boolean
): string {
  const number = parseFloat(input)

  if (number > 0) {
    if (number < 1) {
      // Remove leading zeros and truncate to 4 decimals
      const formatted = parseFloat(input)
        .toFixed(10)
        .replace(/\.?0+$/, '')
      return formatted
    } else {
      // Remove decimals
      return intWithDecimals ? number.toFixed(3) : Math.ceil(number).toString()
    }
  } else {
    return input // Return the input as is if it's not greater than 0
  }
}

export function getFormattedDate(timestamp: number): string {
  const date = new Date(timestamp * 1000) // Convert seconds to milliseconds

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const formattedDate = date.toLocaleDateString('en-US', options)

  return formattedDate
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return (
      thousands.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      ',' +
      remainder.toString().padStart(3, '0')
    )
  } else if (num < 1000000000) {
    const millions = Math.floor(num / 1000000)
    const remainder = Math.floor((num % 1000000) / 1000)
    const thousands = Math.floor(num % 1000)
    return (
      millions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
      '.' +
      remainder.toString().padStart(3, '0') +
      '.' +
      thousands.toString().padStart(3, '0')
    )
  } else {
    return 'Number is too large'
  }
}

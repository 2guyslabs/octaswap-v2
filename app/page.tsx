import { redirect } from 'next/navigation'

export default function Home() {
  redirect('https://app.octaswap.io/swap')
  return
}

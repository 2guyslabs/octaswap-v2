'use client'

import { config } from '@/config/wagmiConfig'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config} initialState={config.state}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

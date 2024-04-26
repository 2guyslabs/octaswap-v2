'use client'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { octa, octaTestnet } from '@/config/chains'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '746a2937d30938bc999b7f8f4c21d4ca'

// 2. Create wagmiConfig
const metadata = {
  name: 'OctaSwap',
  description: 'OctaSwap',
  url: 'https://octaswap.io', // origin must match your domain & subdomain
  icons: ['https://octaswap.io/logos/ocs-logo.svg'],
}

const config = createConfig({
  chains: [octa, octaTestnet],
  transports: {
    [octa.id]: http(),
    [octaTestnet.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
  ssr: true,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  themeVariables: {
    '--w3m-accent': '#7c3aed',
  },
})

export function WalletConnect({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

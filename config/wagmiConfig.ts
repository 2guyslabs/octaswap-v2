import { http, createConfig } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'
import { octa, octaTestnet } from './chains'

export const config = createConfig({
  ssr: true,
  chains: [octa],
  transports: {
    [octaTestnet.id]: http(),
    [octa.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: '5f8ccd61aa262f2019367d2406df4124',
    }),
  ],
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

import { type Chain } from 'viem'

const octa = {
  id: 800001,
  name: 'Octa Space',
  nativeCurrency: { name: 'Octa Space', symbol: 'OCTA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.octa.space/'] },
  },
  blockExplorers: {
    default: {
      name: 'Octa Explorer',
      url: 'https://scan.octa.space',
    },
  },
} as const satisfies Chain

const octaTestnet = {
  id: 800002,
  name: 'Octa Testnet',
  nativeCurrency: { name: 'Octa', symbol: 'OCTA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.octa.space'] },
  },
  blockExplorers: {
    default: {
      name: 'Octa Explorer',
      url: 'https://testnet-explorer.octa.space',
    },
  },
  testnet: true,
} as const satisfies Chain

export { octa, octaTestnet }

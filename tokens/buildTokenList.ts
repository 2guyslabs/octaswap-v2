import { version } from '@/package.json'
import tokenList from '@/tokens/octaSwapToken.json'

export function buildTokenList() {
  const parsed = version.split('.')
  const octaSwapList = {
    name: 'Octaswap Default',
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2],
    },
    tags: {},
    logoURI: 'http://localhost/logos/lbc-logo.png',
    keywords: ['octaswap', 'default'],
    tokens: [...tokenList].sort((t1, t2) => {
      if (t1.chainId === t2.chainId) {
        return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1
      }
      return t1.chainId < t2.chainId ? -1 : 1
    }),
  }
  return octaSwapList
}

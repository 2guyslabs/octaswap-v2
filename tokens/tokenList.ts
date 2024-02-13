import octaSwapTokenList from './tokenList.json'

export type Token = ReturnType<typeof matchToken>

const getTokenList = octaSwapTokenList.tokens

export const NATIVE_OCTA = {
  chainId: 800001,
  name: 'Octa Space',
  symbol: 'OCTA',
  decimals: 18,
  logoURI: '/logos/octa-logo.svg',
}

export function matchToken(symbol: string) {
  return getTokenList.find((token) => {
    if (symbol === NATIVE_OCTA.symbol) {
      return token.symbol === 'WOCTA'
    } else {
      return token.symbol === symbol
    }
  })
}

export function matchAddress(address: string) {
  return getTokenList.find((token) => token.address === address)
}

export function tokenList() {
  const mergeList = [NATIVE_OCTA, ...getTokenList.map(({ address, ...rest }) => rest)]
    .sort((t1, t2) => {
      if (t1.chainId === t2.chainId) {
        return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1
      }
      return t1.chainId < t2.chainId ? -1 : 1
    })
    .map(({ chainId, ...rest }) => rest)

  return mergeList
}

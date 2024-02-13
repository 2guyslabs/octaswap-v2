import { Token, matchToken } from '@/tokens/tokenList'
import { useReadContract } from 'wagmi'
import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/factory'

export default function usePair(tokenA: Token, tokenB: Token) {
  const { data: pairAddress } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'getPair',
    args: [tokenA?.address as `0x${string}`, tokenB?.address as `0x${string}`],
  })

  return pairAddress
}

import { useReadContract } from 'wagmi'
import usePair from './usePair'
import { PAIR_ABI } from '@/contracts/pair'
import { Token } from '@/tokens/tokenList'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'

export default function useReserves(tokenA: Token, tokenB: Token) {
  const { data: reserves } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'getReserves',
    query: {
      refetchInterval: 500,
    },
    args: [tokenA?.address as `0x${string}`, tokenB?.address as `0x${string}`],
  })

  const [reserveIn, reserveOut] = reserves ?? [BigInt(0), BigInt(0)]

  return { reserveIn, reserveOut }
}

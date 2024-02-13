import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/factory'
import { Token } from '@/tokens/tokenList'
import { useReadContract } from 'wagmi'
import usePair from './usePair'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'
import { parseEther } from 'viem'
import { PAIR_ABI } from '@/contracts/pair'

export default function useQuote(amountIn: bigint, amountOut: bigint, tokenA: Token, tokenB: Token) {
  const pairAddress = usePair(tokenA, tokenB)

  const { data: reserves } = useReadContract({
    abi: PAIR_ABI,
    address: pairAddress,
    functionName: 'getReserves',
    query: {
      refetchInterval: 500,
    },
  })

  const [reserveIn, reserveOut] = reserves ?? [BigInt(0), BigInt(0)]

  const { data: quoteRateAToB } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [amountIn, reserveIn, reserveOut],
  })

  const { data: quoteRateBToA } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [amountOut, reserveOut, reserveIn],
  })

  const { data: quoteRateAToBFixed } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), reserveIn, reserveOut],
  })

  const { data: quoteRateBToAFixed } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), reserveOut, reserveIn],
  })

  return { quoteRateAToB, quoteRateBToA, quoteRateAToBFixed, quoteRateBToAFixed }
}

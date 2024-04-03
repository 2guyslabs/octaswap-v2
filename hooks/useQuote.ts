import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/factory'
import { Token } from '@/tokens/tokenList'
import { useReadContract } from 'wagmi'
import usePair from './usePair'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'
import { parseEther } from 'viem'
import { PAIR_ABI } from '@/contracts/pair'
import useReserves from './useReserves'

export default function useQuote(amountIn: bigint, amountOut: bigint, tokenA: Token, tokenB: Token) {
  const { reserveIn, reserveOut } = useReserves(tokenA, tokenB)

  const { data: quoteIn } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [amountOut, reserveOut, reserveIn],
  })

  const { data: quoteOut } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [amountIn, reserveIn, reserveOut],
  })

  const { data: quoteInPerOne } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), reserveOut, reserveIn],
  })

  const { data: quoteOutPerOne } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), reserveIn, reserveOut],
  })

  return { quoteIn, quoteOut, quoteInPerOne, quoteOutPerOne }
}

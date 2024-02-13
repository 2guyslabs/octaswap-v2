import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'
import { Token, matchToken } from '@/tokens/tokenList'
import { parseEther } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

export default function useAmounts(amountAInput: bigint, tokenA: Token, amountBInput: bigint, tokenB: Token) {
  const path = [tokenA?.address as `0x${string}`, tokenB?.address as `0x${string}`]

  const { data: amountsIn } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'getAmountsIn',
    args: [amountBInput, path],
    query: {
      enabled: !!amountBInput,
    },
  })

  const { data: amountsOut } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'getAmountsOut',
    args: [amountAInput, path],
    query: {
      enabled: !!amountAInput,
    },
  })

  return { amountsIn, amountsOut }
}

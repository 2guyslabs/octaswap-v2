import { Token } from '@/tokens/tokenList'
import { useAccount, useSimulateContract } from 'wagmi'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'

export default function useRemoveLiquidityTokens(tokenA: Token, tokenB: Token, liquidityAmount: bigint) {
  const { address } = useAccount()

  const tokenToRemoveWithEth = tokenA?.symbol === 'WOCTA' ? tokenB : tokenA
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes from now

  const { data: removeLiquidityETH } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'removeLiquidityETH',
    args: [tokenToRemoveWithEth?.address as `0x${string}`, liquidityAmount, BigInt(0), BigInt(0), address as `0x${string}`, BigInt(deadline)],
  })

  const { data: removeLiquidity } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'removeLiquidity',
    args: [tokenA?.address as `0x${string}`, tokenB?.address as `0x${string}`, liquidityAmount, BigInt(0), BigInt(0), address as `0x${string}`, BigInt(deadline)],
  })

  const removeLiquidityConfig = removeLiquidityETH || removeLiquidity

  return removeLiquidityConfig
}

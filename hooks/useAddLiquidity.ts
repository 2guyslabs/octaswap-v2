import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'
import { Token } from '@/tokens/tokenList'
import { useAccount, useSimulateContract } from 'wagmi'

export default function useAddLiquidity(amountA: bigint, amountB: bigint, rateA: bigint, rateB: bigint, tokenA: Token, tokenB: Token) {
  const { address } = useAccount()

  const etherAmount = tokenA?.symbol === 'WOCTA' ? amountA || rateA : amountB || rateB
  const amountToAddWithEth = tokenA?.symbol === 'WOCTA' ? rateB || amountB : rateA || amountA
  const tokenToAddWithEth = tokenA?.symbol === 'WOCTA' ? tokenB : tokenA

  const deadline = Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes from now

  const { data: addLiquidityETH } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'addLiquidityETH',
    args: [tokenToAddWithEth?.address as `0x${string}`, amountToAddWithEth, BigInt(0), BigInt(0), address as `0x${string}`, BigInt(deadline)],
    value: etherAmount,
  })

  const { data: addLiquidity } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'addLiquidity',
    args: [tokenA?.address as `0x${string}`, tokenB?.address as `0x${string}`, amountA, amountB, BigInt(0), BigInt(0), address as `0x${string}`, BigInt(deadline)],
  })

  const addLiquidityConfig = addLiquidityETH || addLiquidity

  return addLiquidityConfig
}

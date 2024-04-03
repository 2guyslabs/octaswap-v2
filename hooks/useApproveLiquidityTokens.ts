import { PAIR_ERC_ABI } from '@/contracts/pairErc'
import { Token } from '@/tokens/tokenList'
import { useAccount, useReadContract, useSimulateContract } from 'wagmi'
import usePair from './usePair'
import { ROUTER_ADDRESS } from '@/contracts/router'

export default function useApproveLiquidityTokens(tokenA: Token, tokenB: Token, liquidityAmount: bigint) {
  const { address } = useAccount()
  const pairAddress = usePair(tokenA, tokenB)

  const { data: liquidityAllowance } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'allowance',
    args: [address as `0x${string}`, ROUTER_ADDRESS],
    query: {
      refetchInterval: 500,
    },
  })

  const { data: approveLiquidityTokens } = useSimulateContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'approve',
    args: [ROUTER_ADDRESS, liquidityAmount],
    query: {
      refetchInterval: 500,
    },
  })

  const isLiquidityAllowance = liquidityAllowance ? BigInt(liquidityAllowance) >= liquidityAmount : false

  return { isLiquidityAllowance, approveLiquidityTokens }
}

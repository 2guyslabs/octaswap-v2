import { ROUTER_ADDRESS } from '@/contracts/router'
import { formatStringNumber } from '@/lib/utils'
import { Token } from '@/tokens/tokenList'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useAccount, useReadContract, useSimulateContract } from 'wagmi'

export default function useApproveLiquidity(amountIn: bigint, amountOut: bigint, rateA: bigint, rateB: bigint, currentTokenA: Token, currentTokenB: Token) {
  const { address } = useAccount()

  const formattedRateA = parseEther(formatStringNumber(formatEther(rateA ?? BigInt(0)), false))
  const formattedRateB = parseEther(formatStringNumber(formatEther(rateB ?? BigInt(0)), false))

  const amountToApprove = currentTokenA?.symbol === 'WOCTA' ? formattedRateA || amountOut : formattedRateB || amountIn
  const tokenToApprove = currentTokenA?.symbol === 'WOCTA' ? currentTokenB : currentTokenA

  const { data: tokenAllowance } = useReadContract({
    abi: erc20Abi,
    address: tokenToApprove?.address as `0x${string}`,
    functionName: 'allowance',
    args: [address as `0x${string}`, ROUTER_ADDRESS],
    query: {
      refetchInterval: 500,
    },
  })

  const { data: approveTokensConfig } = useSimulateContract({
    abi: erc20Abi,
    address: tokenToApprove?.address as `0x${string}`,
    functionName: 'approve',
    args: [ROUTER_ADDRESS, amountToApprove],
    query: {
      refetchInterval: 500,
    },
  })

  const isAllowance = tokenAllowance ? BigInt(tokenAllowance) >= amountToApprove : false

  return { isAllowance, approveTokensConfig }
}

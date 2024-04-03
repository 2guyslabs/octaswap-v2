import { ROUTER_ADDRESS } from '@/contracts/router'
import { formatStringNumber } from '@/lib/utils'
import { Token } from '@/tokens/tokenList'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useAccount, useReadContract, useSimulateContract } from 'wagmi'

export default function useApproveLiquidity(amountIn: bigint, amountOut: bigint, rateA: bigint, rateB: bigint, currentTokenA: Token, currentTokenB: Token) {
  const { address } = useAccount()

  const formattedRateA = parseEther(formatStringNumber(formatEther(rateA ?? BigInt(0)), false))
  const formattedRateB = parseEther(formatStringNumber(formatEther(rateB ?? BigInt(0)), false))

  const amountToApproveWithEth = currentTokenA?.symbol === 'WOCTA' ? formattedRateB || amountOut : formattedRateA || amountIn
  const tokenToApproveWithEth = currentTokenA?.symbol === 'WOCTA' ? currentTokenB : currentTokenA

  const amountToApproveWithTokens = formattedRateA || amountIn || formattedRateB || amountOut
  const tokenToApproveWithTokens = currentTokenA || currentTokenB

  const { data: tokenAllowanceWithEth } = useReadContract({
    abi: erc20Abi,
    address: tokenToApproveWithEth?.address as `0x${string}`,
    functionName: 'allowance',
    args: [address as `0x${string}`, ROUTER_ADDRESS],
    query: {
      refetchInterval: 500,
    },
  })

  const { data: approveTokensConfigWithEth } = useSimulateContract({
    abi: erc20Abi,
    address: tokenToApproveWithEth?.address as `0x${string}`,
    functionName: 'approve',
    args: [ROUTER_ADDRESS, amountToApproveWithEth],
    query: {
      refetchInterval: 500,
    },
  })

  const { data: tokenAllowanceWithTokens } = useReadContract({
    abi: erc20Abi,
    address: tokenToApproveWithTokens?.address as `0x${string}`,
    functionName: 'allowance',
    args: [address as `0x${string}`, ROUTER_ADDRESS],
    query: {
      refetchInterval: 500,
    },
  })

  const { data: approveTokensConfigWithTokens } = useSimulateContract({
    abi: erc20Abi,
    address: tokenToApproveWithTokens?.address as `0x${string}`,
    functionName: 'approve',
    args: [ROUTER_ADDRESS, amountToApproveWithTokens],
    query: {
      refetchInterval: 500,
    },
  })

  const isAllowance = tokenAllowanceWithEth
    ? BigInt(tokenAllowanceWithEth) >= amountToApproveWithEth
    : false || tokenAllowanceWithTokens
      ? BigInt(tokenAllowanceWithTokens) >= amountToApproveWithTokens
      : false

  const approveTokensConfig = approveTokensConfigWithEth || approveTokensConfigWithTokens

  return { isAllowance, approveTokensConfig }
}

import { ROUTER_ADDRESS } from '@/contracts/router'
import { formatStringNumber } from '@/lib/utils'
import { Token } from '@/tokens/tokenList'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useAccount, useReadContract, useSimulateContract } from 'wagmi'

export default function useApprove(amountIn: bigint, rateA: bigint, currentTokenA: Token) {
  const { address } = useAccount()

  const formattedRate = parseEther(formatStringNumber(formatEther(rateA ?? BigInt(0)), false))
  const amount = amountIn || formattedRate

  const { data: tokenAllowance } = useReadContract({
    abi: erc20Abi,
    address: currentTokenA?.address as `0x${string}`,
    functionName: 'allowance',
    args: [address as `0x${string}`, ROUTER_ADDRESS],
    query: {
      refetchInterval: 500,
    },
  })

  const { data: approveTokensConfig } = useSimulateContract({
    abi: erc20Abi,
    address: currentTokenA?.address as `0x${string}`,
    functionName: 'approve',
    args: [ROUTER_ADDRESS, amount],
    query: {
      refetchInterval: 500,
    },
  })

  const isAllowance = tokenAllowance ? BigInt(tokenAllowance) >= amount : false

  return { isAllowance, approveTokensConfig }
}

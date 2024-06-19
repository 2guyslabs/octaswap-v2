import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'
import { Token } from '@/tokens/tokenList'
import { useAccount, useSimulateContract } from 'wagmi'

export default function useSwap(
  amountAinput: bigint,
  amountBInput: bigint,
  tokenA: Token,
  tokenB: Token,
  amountsIn: bigint,
  amountsOut: bigint
) {
  const { address } = useAccount()

  const path = [
    tokenA?.address as `0x${string}`,
    tokenB?.address as `0x${string}`,
  ]

  const deadline = Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes from now

  const { data: swapExactTokensForTokensConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapExactTokensForTokens',
    args: [
      amountAinput,
      amountsOut,
      path,
      address as `0x${string}`,
      BigInt(deadline),
    ],
    query: {
      enabled: tokenB?.symbol !== 'OCTA' && tokenB?.symbol !== 'WOCTA',
    },
  })

  const { data: swapTokensForExactTokensConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapTokensForExactTokens',
    args: [
      amountBInput,
      amountsIn,
      path,
      address as `0x${string}`,
      BigInt(deadline),
    ],
    query: {
      enabled: tokenB?.symbol !== 'OCTA' && tokenB?.symbol !== 'WOCTA',
    },
  })

  const { data: exactEthforTokensConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapExactETHForTokens',
    args: [amountsOut, path, address as `0x${string}`, BigInt(deadline)],
    value: amountAinput,
  })

  const { data: tokensForExactEthConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapTokensForExactETH',
    args: [
      amountBInput,
      amountsIn,
      path,
      address as `0x${string}`,
      BigInt(deadline),
    ],
    query: {
      enabled: tokenB?.symbol === 'OCTA' || tokenB?.symbol === 'WOCTA',
    },
  })

  const { data: exactTokensforEthConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapExactTokensForETH',
    args: [
      amountAinput,
      amountsOut,
      path,
      address as `0x${string}`,
      BigInt(deadline),
    ],
  })

  const { data: ethForExactTokensConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapETHForExactTokens',
    args: [amountBInput, path, address as `0x${string}`, BigInt(deadline)],
    value: amountsIn,
  })

  const { data: swapExactTokensForTokensWithFeeConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    args: [
      amountAinput,
      amountsOut,
      path,
      address as `0x${string}`,
      BigInt(deadline),
    ],
    query: {
      enabled: tokenB?.symbol !== 'OCTA' && tokenB?.symbol !== 'WOCTA',
    },
  })

  const { data: exactEthforTokensWithFeeConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
    args: [amountsOut, path, address as `0x${string}`, BigInt(deadline)],
    value: amountAinput,
  })

  const { data: exactTokensForEthWithFeeConfig } = useSimulateContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    account: address,
    functionName: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
    args: [
      amountBInput,
      amountsIn,
      path,
      address as `0x${string}`,
      BigInt(deadline),
    ],
    query: {
      enabled: tokenB?.symbol === 'OCTA' || tokenB?.symbol === 'WOCTA',
    },
  })

  const swapConfig =
    swapExactTokensForTokensConfig ||
    swapTokensForExactTokensConfig ||
    exactEthforTokensConfig ||
    tokensForExactEthConfig ||
    exactTokensforEthConfig ||
    ethForExactTokensConfig ||
    swapExactTokensForTokensWithFeeConfig ||
    exactEthforTokensWithFeeConfig ||
    exactTokensForEthWithFeeConfig

  return swapConfig
}

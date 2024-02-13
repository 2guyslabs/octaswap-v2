import { useReadContract } from 'wagmi'
import { ROUTER_ABI, ROUTER_ADDRESS } from '@/contracts/router'
import { parseEther } from 'viem'

export default function useNewRate(amountIn: bigint, amountOut: bigint) {
  const { data: newRateAToB } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), amountIn, amountOut],
  })

  const { data: newRateBToA } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'quote',
    args: [parseEther('1'), amountOut, amountIn],
  })

  return { newRateAToB, newRateBToA }
}

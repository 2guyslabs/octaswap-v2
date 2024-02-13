import { useAccount, useReadContract } from 'wagmi'
import useAllPools from './useAllPools'
import { PAIR_ABI } from '@/contracts/pair'
import { useEffect, useState } from 'react'
import { PAIR_ERC_ABI } from '@/contracts/pairErc'

export type PoolData = {
  reserve: readonly [bigint, bigint, number] | undefined
  inputTokenAddress: `0x${string}` | undefined
  outputTokenAddress: `0x${string}` | undefined
  totalSupply: bigint | undefined
  totalPoolTokens: bigint | undefined
}

export type PoolsData = PoolData[]

export default function usePools() {
  const [poolIndex, setPoolIndex] = useState(0)
  const [myPoolsData, setMyPoolsData] = useState<PoolsData>([])

  const { address } = useAccount()
  const allPoolAddresses = useAllPools()

  const poolAddress = allPoolAddresses[poolIndex]

  const { data: pairReserve } = useReadContract({
    abi: PAIR_ABI,
    address: poolAddress,
    functionName: 'getReserves',
    query: {
      refetchInterval: 500,
    },
  })

  const { data: tokenA } = useReadContract({
    abi: PAIR_ABI,
    address: poolAddress,
    functionName: 'token0',
    query: {
      refetchInterval: 500,
    },
  })

  const { data: tokenB } = useReadContract({
    abi: PAIR_ABI,
    address: poolAddress,
    functionName: 'token1',
    query: {
      refetchInterval: 500,
    },
  })

  const { data: pairTotalSuppply } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: poolAddress,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 500,
    },
  })

  const { data: totalPoolTokens } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: poolAddress,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      refetchInterval: 500,
    },
  })

  useEffect(() => {
    if (pairReserve && tokenA && tokenB && pairTotalSuppply && totalPoolTokens) {
      const poolData: PoolData = {
        reserve: pairReserve,
        inputTokenAddress: tokenA,
        outputTokenAddress: tokenB,
        totalSupply: pairTotalSuppply,
        totalPoolTokens: totalPoolTokens,
      }

      // Check if poolData already exists in myPoolsData
      const poolDataExists = myPoolsData.some((data) => data.inputTokenAddress === poolData.inputTokenAddress && data.outputTokenAddress === poolData.outputTokenAddress)

      if (!poolDataExists) {
        setMyPoolsData((mpd) => [...mpd, poolData])
      }

      if (poolIndex < allPoolAddresses.length - 1) {
        setPoolIndex((pi) => pi + 1)
      }
    }
  }, [pairReserve, tokenA, tokenB, pairTotalSuppply, totalPoolTokens, poolIndex, allPoolAddresses.length, myPoolsData])

  return myPoolsData
}

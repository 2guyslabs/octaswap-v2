import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/factory'
import { PAIR_ABI } from '@/contracts/pair'
import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'

export default function useAllPools() {
  const [lengthCount, setLengthCount] = useState(0)
  const [allPairAddress, setAllPairAddress] = useState<`0x${string}`[]>([])

  const { data: allPairsLength } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'allPairsLength',
  })

  const { data: pairAddress } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'allPairs',
    args: [BigInt(lengthCount)],
  })

  useEffect(() => {
    if (pairAddress) {
      setAllPairAddress((apa) => [...apa, pairAddress])
      if (lengthCount < Number(allPairsLength) - 1) {
        setLengthCount((lc) => lc + 1)
      }
    }
  }, [pairAddress, lengthCount, allPairsLength])

  return allPairAddress
}

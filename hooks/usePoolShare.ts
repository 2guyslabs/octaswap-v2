import { useAccount, useReadContract } from 'wagmi'
import usePair from './usePair'
import { PAIR_ERC_ABI } from '@/contracts/pairErc'
import { Token } from '@/tokens/tokenList'

export default function usePoolShare(currentTokenA: Token, currentTokenB: Token) {
  const { address } = useAccount()

  const pairAddress = usePair(currentTokenA, currentTokenB)

  const { data: pairTotalSupply } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 500,
    },
  })

  const { data: myPairTotalTokens } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      refetchInterval: 500,
    },
  })

  const poolShare = (Number(myPairTotalTokens) / Number(pairTotalSupply)) * 100

  return poolShare
}

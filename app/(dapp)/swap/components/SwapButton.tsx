/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/ui/button'
import useReserves from '@/hooks/useReserves'
import useSwap from '@/hooks/useSwap'
import { Token } from '@/tokens/tokenList'
import { useEffect, useState } from 'react'
import { zeroAddress } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'

export default function SwapButton({
  pair,
  amountIn,
  amountOut,
  currentTokenA,
  currentTokenB,
  isAllowance,
  onApprove,
  onSwap,
  isTxPending,
  isTxLoading,
}: {
  pair: `0x${string}` | undefined
  amountIn: bigint
  amountOut: bigint
  currentTokenA: Token
  currentTokenB: Token
  isAllowance: boolean
  onApprove: () => void
  onSwap: () => void
  isTxPending: boolean
  isTxLoading: boolean
}) {
  const isPairExist = pair !== zeroAddress
  const isAmount = amountIn > BigInt(0) || amountOut > BigInt(0)

  const { reserveIn, reserveOut } = useReserves(currentTokenA, currentTokenB)

  const { isConnected, isDisconnected } = useAccount()

  const disabledState =
    isDisconnected ||
    !isPairExist ||
    !isAmount ||
    isTxPending ||
    isTxLoading ||
    !reserveIn ||
    !reserveOut

  const onClick = isAllowance
    ? onSwap
    : currentTokenA?.symbol === 'OCTA' || currentTokenA?.symbol === 'WOCTA'
      ? onSwap
      : onApprove

  const isNativePair = isAllowance
    ? 'Swap'
    : currentTokenA?.symbol === 'OCTA' || currentTokenA?.symbol === 'WOCTA'
      ? 'Swap'
      : 'Approve'
  const renderText = isConnected
    ? isPairExist && reserveIn && reserveOut
      ? isAmount
        ? isNativePair
        : 'Input amount to swap'
      : 'No liquidity'
    : 'Not connected'

  return (
    // @ts-ignore
    <Button
      className='w-full'
      size='lg'
      disabled={disabledState}
      onClick={onClick}
    >
      {renderText}
    </Button>
  )
}

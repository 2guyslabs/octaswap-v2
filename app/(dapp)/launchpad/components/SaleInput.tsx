'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  OCTADOGE_SALE_ABI,
  OCTADOGE_SALE_ADDRESS,
} from '@/contracts/octadogesale'
import {
  REFUND_ESCROW_ABI,
  REFUND_ESCROW_ADDRESS,
} from '@/contracts/refundEscrow'
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { parseEther } from 'viem'
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

export default function SaleInput() {
  const [buyAmount, setBuyAmount] = useState('')

  const { address } = useAccount()

  const { data: isSaleOpen } = useReadContract({
    abi: OCTADOGE_SALE_ABI,
    address: OCTADOGE_SALE_ADDRESS,
    functionName: 'isOpen',
  })

  const { data: isSaleHasClosed } = useReadContract({
    abi: OCTADOGE_SALE_ABI,
    address: OCTADOGE_SALE_ADDRESS,
    functionName: 'hasClosed',
  })

  const { data: isGoalReached } = useReadContract({
    abi: OCTADOGE_SALE_ABI,
    address: OCTADOGE_SALE_ADDRESS,
    functionName: 'goalReached',
  })

  const { data: refundAmount } = useReadContract({
    abi: REFUND_ESCROW_ABI,
    address: REFUND_ESCROW_ADDRESS,
    functionName: 'depositsOf',
    args: [address as `0x${string}`],
  })

  const { data: buyTokensConfig } = useSimulateContract({
    abi: OCTADOGE_SALE_ABI,
    address: OCTADOGE_SALE_ADDRESS,
    functionName: 'buyTokens',
    args: [address as `0x${string}`],
    value: parseEther(buyAmount),
    query: {
      enabled: Boolean(buyAmount),
    },
  })

  const { data: claimRefundConfig } = useSimulateContract({
    abi: OCTADOGE_SALE_ABI,
    address: OCTADOGE_SALE_ADDRESS,
    functionName: 'claimRefund',
    args: [address as `0x${string}`],
    query: {
      enabled: !isGoalReached,
    },
  })

  const {
    writeContract,
    data: hash,
    isPending: isBuyPending,
  } = useWriteContract()
  const { isLoading: isPurchasing, isSuccess: isPurchaseSuccess } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handleBuyAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const validation = /^$|^\d+$/
    const value = e.target.value

    if (validation.test(value)) {
      setBuyAmount(e.target.value)
    } else {
      return
    }
  }

  const handlePurchase = () => {
    // @ts-ignore
    writeContract(buyTokensConfig?.request)
  }

  const handleRefund = () => {
    // @ts-ignore
    writeContract(claimRefundConfig?.request)
  }

  const onClick = isSaleOpen
    ? handlePurchase
    : isSaleHasClosed && isGoalReached
      ? () => {}
      : handleRefund

  useEffect(() => {
    if (isPurchasing) {
      toast.loading('Transaction in progress...')
    }

    if (!isPurchasing) {
      toast.dismiss()
    }

    if (isPurchaseSuccess) {
      toast.success('Transaction successful!')
    }
  })

  return (
    <div className='space-y-3'>
      <Input
        disabled={!isSaleOpen || isSaleHasClosed}
        type='text'
        placeholder='How much you want to buy?'
        className='p-6'
        value={buyAmount}
        onChange={handleBuyAmount}
      />
      <Button
        className='w-full'
        size='lg'
        disabled={
          isPurchasing ||
          isBuyPending ||
          (!isSaleOpen && !isSaleHasClosed) ||
          (isSaleHasClosed && isGoalReached) ||
          (!isSaleOpen && isSaleHasClosed && Boolean(refundAmount))
        }
        onClick={onClick}
      >
        {isSaleOpen
          ? 'Purchase'
          : isSaleHasClosed
            ? isGoalReached
              ? 'Sale Finish'
              : 'Claim Refund'
            : 'Sale not open yet'}
      </Button>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OCTAINU_ADDRESS } from '@/contracts/octainu'
import { OCTAINU_SALE_ABI, OCTAINU_SALE_ADDRESS } from '@/contracts/octainusale'
import {
  REFUND_ESCROW_ABI,
  REFUND_ESCROW_ADDRESS,
} from '@/contracts/refundEscrow'
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { erc20Abi, parseEther } from 'viem'
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import Countdown from 'react-countdown'

export default function SaleInput() {
  const { address } = useAccount()
  const [buyAmount, setBuyAmount] = useState('')

  const { data: isSaleOpen } = useReadContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'isOpen',
    query: {
      refetchInterval: 1000,
    },
  })

  const { data: isSaleHasClosed } = useReadContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'hasClosed',
    query: {
      refetchInterval: 1000,
    },
  })

  const { data: isGoalReached } = useReadContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'goalReached',
    query: {
      refetchInterval: 1000,
    },
  })

  const { data: isFinalized } = useReadContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'finalized',
    query: {
      refetchInterval: 1000,
    },
  })

  const { data: openingTime, isLoading: isLoadingOpeningTime } =
    useReadContract({
      abi: OCTAINU_SALE_ABI,
      address: OCTAINU_SALE_ADDRESS,
      functionName: 'openingTime',
      query: {
        refetchInterval: 1000,
      },
    })

  const { data: saleBalance } = useReadContract({
    abi: erc20Abi,
    address: OCTAINU_ADDRESS,
    functionName: 'balanceOf',
    args: [OCTAINU_SALE_ADDRESS],
    query: {
      refetchInterval: 1000,
    },
  })

  const { data: refundAmount } = useReadContract({
    abi: REFUND_ESCROW_ABI,
    address: REFUND_ESCROW_ADDRESS,
    functionName: 'depositsOf',
    args: [address as `0x${string}`],
    query: {
      refetchInterval: 1000,
    },
  })

  const { data: buyTokensConfig } = useSimulateContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'buyTokens',
    args: [address as `0x${string}`],
    value: parseEther(buyAmount),
    query: {
      enabled: !!buyAmount,
    },
  })

  const { data: claimRefundConfig } = useSimulateContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'claimRefund',
    args: [address as `0x${string}`],
    query: {
      enabled: isSaleHasClosed && !isGoalReached,
    },
  })

  const { data: claimTokensConfig } = useSimulateContract({
    abi: OCTAINU_SALE_ABI,
    address: OCTAINU_SALE_ADDRESS,
    functionName: 'withdrawTokens',
    args: [address as `0x${string}`],
    query: {
      enabled: isSaleHasClosed && isGoalReached,
    },
  })

  const {
    writeContract,
    data: hash,
    isPending: isBuyPending,
  } = useWriteContract()

  const { isLoading: isPurchasingLoading, isSuccess: isPurchaseSuccess } =
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

  // @ts-ignore
  const handlePurchase = () => writeContract(buyTokensConfig?.request)
  // @ts-ignore
  const handleRefund = () => writeContract(claimRefundConfig?.request)
  // @ts-ignore
  const handleClaimTokens = () => writeContract(claimTokensConfig?.request)

  const saleOpenTimestamp = Number(openingTime) * 1000

  const btnDisableState = isBuyPending || (isSaleHasClosed && !isFinalized)

  const onClick = () => {
    if (isSaleOpen) {
      handlePurchase()
    } else if (isSaleHasClosed && !isGoalReached) {
      handleRefund()
    } else {
      handleClaimTokens()
    }
  }

  return (
    <div className='space-y-3'>
      <Input
        type='text'
        placeholder='How much you want to buy?'
        className='p-6'
        value={buyAmount}
        onChange={handleBuyAmount}
        disabled={!isSaleOpen || isSaleHasClosed}
      />
      {isLoadingOpeningTime ? (
        <Button className='w-full'>Loading...</Button>
      ) : (
        <Countdown
          date={saleOpenTimestamp}
          renderer={(props) =>
            props.completed ? (
              isSaleOpen ? (
                <Button
                  className='w-full'
                  disabled={btnDisableState}
                  onClick={onClick}
                >
                  Purchase
                </Button>
              ) : isGoalReached ? (
                <Button
                  className='w-full'
                  disabled={btnDisableState}
                  onClick={onClick}
                >
                  Claim Tokens
                </Button>
              ) : (
                <Button
                  className='w-full'
                  disabled={btnDisableState}
                  onClick={onClick}
                >
                  Claim Refund
                </Button>
              )
            ) : (
              <Button className='w-full' size='lg' disabled>
                {props.days}d:{props.hours}h:{props.minutes}m:{props.seconds}s
              </Button>
            )
          }
        />
      )}
      {/* <Button className='w-full' size='lg' onClick={onClick}>
        Purchase
      </Button> */}
    </div>
  )
}

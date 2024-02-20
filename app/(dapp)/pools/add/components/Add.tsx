'use client'

import useQuote from '@/hooks/useQuote'
import { Token, matchToken } from '@/tokens/tokenList'
import { ChangeEvent, useEffect, useState } from 'react'
import { formatEther, parseEther, zeroAddress } from 'viem'
import AddInputSelector from './AddInputSelector'
import { PlusIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/components/ui/card'
import { formatStringNumber } from '@/lib/utils'
import usePoolShare from '@/hooks/usePoolShare'
import useNewRate from '@/hooks/useNewRate'
import usePair from '@/hooks/usePair'
import { Button } from '@/components/ui/button'
import useAddLiquidity from '@/hooks/useAddLiquidity'
import useApproveLiquidity from '@/hooks/useApproveLiquidity'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'sonner'

function AddButton({
  amountIn,
  amountOut,
  isPairAddress,
  invalidPair,
  isAllowance,
  onApprove,
  onAdd,
  isTxPending,
  isTxLoading,
}: {
  onApprove: () => void
  onAdd: () => void
  amountIn: bigint
  amountOut: bigint
  isPairAddress: boolean
  invalidPair: boolean
  isAllowance: boolean
  isTxPending: boolean
  isTxLoading: boolean
}) {
  const { isConnected, isDisconnected } = useAccount()

  const isAmount = isPairAddress ? amountIn > BigInt(0) || amountOut > BigInt(0) : amountIn > BigInt(0) && amountOut > BigInt(0)

  const disableState = isDisconnected || invalidPair || !isAmount || isTxPending || isTxLoading

  const renderText = isConnected ? (invalidPair ? 'Invalid pair' : isAmount ? (isAllowance ? 'Add liquidity' : 'Approve') : 'Enter an amount') : 'Not connected'

  const onClick = isAllowance ? onAdd : onApprove

  return (
    <Button className='w-full rounded-[0.8rem]' size='lg' disabled={disableState} onClick={onClick}>
      {renderText}
    </Button>
  )
}

function PoolShare({ poolShare }: { poolShare: number }) {
  return (
    <div className='flex basis-full flex-col items-center justify-center sm:basis-auto'>
      <p className='font-medium'>{poolShare ? poolShare : 0}%</p>
      <p className='text-sm text-muted-foreground'>Pool Share</p>
    </div>
  )
}

function PoolPrice({
  currentTokenA,
  currentTokenB,
  fixedQuoteRateA,
  fixedQuoteRateB,
  newRateAToB,
  newRateBToA,
}: {
  currentTokenA: Token
  currentTokenB: Token
  fixedQuoteRateA: bigint
  fixedQuoteRateB: bigint
  newRateAToB: bigint | undefined
  newRateBToA: bigint | undefined
}) {
  const quoteRateAToBFormatted = formatStringNumber(formatEther(fixedQuoteRateA), true)
  const quoteRateBToAFormatted = formatStringNumber(formatEther(fixedQuoteRateB), true)

  const newRateAToBFormatted = formatStringNumber(formatEther(newRateAToB ?? BigInt(0)), true)
  const newRateBToAFormatted = formatStringNumber(formatEther(newRateBToA ?? BigInt(0)), true)

  const pairAddress = usePair(currentTokenA, currentTokenB)
  const isPairAddress = pairAddress !== zeroAddress

  return (
    <>
      <div className='flex flex-col'>
        <p className='font-medium'>{isPairAddress ? quoteRateBToAFormatted : newRateBToAFormatted}</p>
        <p className='text-sm text-muted-foreground'>
          {currentTokenA?.symbol} per {currentTokenB?.symbol}{' '}
        </p>
      </div>
      <div className='flex flex-col'>
        <p className='font-medium'>{isPairAddress ? quoteRateAToBFormatted : newRateAToBFormatted}</p>
        <p className='text-sm text-muted-foreground'>
          {currentTokenB?.symbol} per {currentTokenA?.symbol}
        </p>
      </div>
    </>
  )
}

function PricesAndPoolShare({
  currentTokenA,
  currentTokenB,
  fixedQuoteRateA,
  fixedQuoteRateB,
  newRateAToB,
  newRateBToA,
  poolShare,
}: {
  currentTokenA: Token
  currentTokenB: Token
  fixedQuoteRateA: bigint
  fixedQuoteRateB: bigint
  newRateAToB: bigint | undefined
  newRateBToA: bigint | undefined
  poolShare: number
}) {
  return (
    <Card className='mt-7 rounded-lg'>
      <div className='px-5 py-3'>
        <p className='text-sm font-medium'>Prices and Pool Share</p>
      </div>
      <CardContent className='p-0'>
        <Card className='rounded-lg'>
          <CardContent className='p-4'>
            <div className='flex flex-wrap items-center justify-around gap-y-3 sm:gap-y-0'>
              <PoolPrice
                currentTokenA={currentTokenA}
                currentTokenB={currentTokenB}
                fixedQuoteRateA={fixedQuoteRateA}
                fixedQuoteRateB={fixedQuoteRateB}
                newRateAToB={newRateAToB}
                newRateBToA={newRateBToA}
              />
              <PoolShare poolShare={poolShare} />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default function Add() {
  const [amountAInput, setAmountAInput] = useState('')
  const [amountBInput, setAmountBInput] = useState('')
  const [selectedTokenA, setSelectedTokenA] = useState('OCTA')
  const [selectedTokenB, setSelectedTokenB] = useState('OCS')
  const [quoteRateA, setQuoteRateA] = useState('')
  const [quoteRateB, setQuoteRateB] = useState('')
  const [fixedQuoteRateA, setFixedQuoteRateA] = useState(BigInt(0))
  const [fixedQuoteRateB, setFixedQuoteRateB] = useState(BigInt(0))
  const [isApprovePending, setIsApprovePending] = useState(false)

  const amountIn = parseEther(amountAInput)
  const amountOut = parseEther(amountBInput)

  const currentTokenA = matchToken(selectedTokenA)
  const currentTokenB = matchToken(selectedTokenB)

  const pairAddress = usePair(currentTokenA, currentTokenB)
  const isPairAddress = pairAddress !== zeroAddress
  const invalidPair = currentTokenA?.symbol === currentTokenB?.symbol

  const { quoteRateAToB, quoteRateBToA, quoteRateAToBFixed, quoteRateBToAFixed } = useQuote(amountIn, amountOut, currentTokenA, currentTokenB)

  const rateA = quoteRateAToB ?? BigInt(0)
  const rateB = quoteRateBToA ?? BigInt(0)

  const valueA = !amountAInput ? quoteRateA : amountAInput
  const valueB = !amountBInput ? quoteRateB : amountBInput

  const poolShare = usePoolShare(currentTokenA, currentTokenB)
  const { newRateAToB, newRateBToA } = useNewRate(amountIn, amountOut)

  const { isAllowance, approveTokensConfig } = useApproveLiquidity(amountIn, amountOut, rateA, rateB, currentTokenA, currentTokenB)

  const addLiquidityConfig = useAddLiquidity(amountIn, amountOut, rateA, rateB, currentTokenA, currentTokenB)

  const { writeContract, isPending: isInitTxPending, data: hash, isError: isInitTxError, error } = useWriteContract()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSwitchToken = () => {
    const tempAmount = amountAInput
    const tempToken = selectedTokenA

    setAmountAInput(amountBInput)
    setAmountBInput(tempAmount)

    setSelectedTokenA(selectedTokenB)
    setSelectedTokenB(tempToken)
  }

  const createHandler =
    (setAmountInput: (value: string) => void, setOtherAmountInput: (value: string) => void, setRateToken: (value: string) => void, setOtherRateToken: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (!/^(?:\d*\.\d+|\d+\.?|)$/.test(value)) {
        return
      }

      if (quoteRateAToBFixed && quoteRateBToAFixed) {
        setAmountInput(value)
        setOtherAmountInput('')

        if (value === '') {
          setOtherAmountInput('')
          setRateToken('')
          setOtherRateToken('')
        }
      } else {
        setAmountInput(value)
      }
    }

  const handleValueA = createHandler(setAmountAInput, setAmountBInput, setQuoteRateA, setQuoteRateB)
  const handleValueB = createHandler(setAmountBInput, setAmountAInput, setQuoteRateB, setQuoteRateA)

  const handleOnApprove = () => {
    // @ts-ignore
    writeContract(approveTokensConfig?.request)
  }

  const handleOnAdd = () => {
    // @ts-ignore
    writeContract(addLiquidityConfig?.request)
    setIsApprovePending(true)
  }

  // useEffect(() => {
  //   if (rateA) {
  //     const fmtdQuoteRateAToB = formatStringNumber(formatEther(rateA), true)
  //     setQuoteRateA(fmtdQuoteRateAToB)
  //   }

  //   if (rateB) {
  //     const fmtdQuoteRateBToA = formatStringNumber(formatEther(rateB), true)
  //     setQuoteRateB(fmtdQuoteRateBToA)
  //   }

  //   if (quoteRateBToAFixed) {
  //     setFixedQuoteRateA(quoteRateBToAFixed)
  //   }

  //   if (quoteRateAToBFixed) {
  //     setFixedQuoteRateB(quoteRateAToBFixed)
  //   }
  // }, [rateA, rateB, quoteRateAToBFixed, quoteRateBToAFixed])

  useEffect(() => {
    if (!isInitTxPending && !isInitTxError && isApprovePending) {
      setAmountAInput('')
      setAmountBInput('')
      setQuoteRateA('')
      setQuoteRateB('')
      setIsApprovePending(false)
    }
  }, [isInitTxPending, isInitTxError, isApprovePending, isAllowance])

  useEffect(() => {
    if (isTxLoading) {
      toast.loading('Transaction in progress...')
    }

    if (!isTxLoading) {
      toast.dismiss()
    }

    if (isTxSuccess) {
      toast.success('Transaction successful!')
    }
  }, [isTxLoading, isTxSuccess])

  return (
    <div className='mt-2 space-y-5'>
      <div>
        <AddInputSelector value={valueA} onAmountChange={handleValueA} currency={selectedTokenA} onSetToken={setSelectedTokenA} disabledToken={selectedTokenB} />
        <div className='my-4 text-center'>
          <Button variant='ghost' size='icon' onClick={handleSwitchToken}>
            <UpdateIcon />
          </Button>
        </div>
        <AddInputSelector value={valueB} onAmountChange={handleValueB} currency={selectedTokenB} onSetToken={setSelectedTokenB} disabledToken={selectedTokenA} />
        {invalidPair ? null : (
          <PricesAndPoolShare
            currentTokenA={currentTokenA}
            currentTokenB={currentTokenB}
            fixedQuoteRateA={fixedQuoteRateA}
            fixedQuoteRateB={fixedQuoteRateB}
            newRateAToB={newRateAToB}
            newRateBToA={newRateBToA}
            poolShare={poolShare}
          />
        )}
      </div>
      <AddButton
        amountIn={amountIn}
        amountOut={amountOut}
        isPairAddress={isPairAddress}
        invalidPair={invalidPair}
        isAllowance={isAllowance}
        onApprove={handleOnApprove}
        onAdd={handleOnAdd}
        isTxPending={isInitTxPending}
        isTxLoading={isTxLoading}
      />
    </div>
  )
}

'use client'

import useQuote from '@/hooks/useQuote'
import { Token, matchToken } from '@/tokens/tokenList'
import { ChangeEvent, useEffect, useState } from 'react'
import { formatEther, parseEther, zeroAddress } from 'viem'
import AddInputSelector from './AddInputSelector'
import { ArrowDownIcon, PlusIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/components/ui/card'
import { formatStringNumber } from '@/lib/utils'
import usePoolShare from '@/hooks/usePoolShare'
import useNewRate from '@/hooks/useNewRate'
import usePair from '@/hooks/usePair'
import { Button } from '@/components/ui/button'
import useAddLiquidity from '@/hooks/useAddLiquidity'
import useApproveLiquidity from '@/hooks/useApproveLiquidity'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { toast } from 'sonner'
import useReserves from '@/hooks/useReserves'
import { Pair } from '@uniswap/v2-sdk'

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

  const isAmount = isPairAddress
    ? amountIn > BigInt(0) || amountOut > BigInt(0)
    : amountIn > BigInt(0) && amountOut > BigInt(0)

  const disableState =
    isDisconnected || invalidPair || !isAmount || isTxPending || isTxLoading

  const renderText = isConnected
    ? invalidPair
      ? 'Invalid pair'
      : isAmount
        ? isAllowance
          ? 'Add liquidity'
          : 'Approve'
        : 'Enter an amount'
    : 'Not connected'

  const onClick = isAllowance ? onAdd : onApprove

  return (
    <Button
      className='w-full rounded-[0.8rem]'
      size='lg'
      disabled={disableState}
      onClick={onClick}
    >
      {renderText}
    </Button>
  )
}

function PoolShare({ myPoolShare }: { myPoolShare: number }) {
  return (
    <div className='flex basis-full flex-col items-center justify-center sm:basis-auto'>
      <p className='font-medium'>{myPoolShare ? myPoolShare : 0}%</p>
      <p className='text-sm text-muted-foreground'>Pool Share</p>
    </div>
  )
}

function PoolPrice({
  amountIn,
  amountOut,
  currentTokenA,
  currentTokenB,
  fixedQuoteInRate,
  fixedQuoteOutRate,
}: {
  amountIn: bigint
  amountOut: bigint
  currentTokenA: Token
  currentTokenB: Token
  fixedQuoteInRate: bigint
  fixedQuoteOutRate: bigint
}) {
  const quoteRateAToBFormatted = formatStringNumber(
    formatEther(fixedQuoteInRate),
    true
  )
  const quoteRateBToAFormatted = formatStringNumber(
    formatEther(fixedQuoteOutRate),
    true
  )

  const isAmount = amountIn && amountOut

  const newQuoteRateA = isAmount ? Number(amountOut) / Number(amountIn) : 0
  const newQuoteRateB = isAmount ? Number(amountIn) / Number(amountOut) : 0

  const pairAddress = usePair(currentTokenA, currentTokenB)
  const isPairAddress = pairAddress !== zeroAddress

  return (
    <>
      <div className='flex flex-col'>
        <p className='font-medium'>
          {isPairAddress ? quoteRateAToBFormatted : newQuoteRateA}
        </p>
        <p className='text-sm text-muted-foreground'>
          {currentTokenA?.symbol} per {currentTokenB?.symbol}{' '}
        </p>
      </div>
      <div className='flex flex-col'>
        <p className='font-medium'>
          {isPairAddress ? quoteRateBToAFormatted : newQuoteRateB}
        </p>
        <p className='text-sm text-muted-foreground'>
          {currentTokenB?.symbol} per {currentTokenA?.symbol}
        </p>
      </div>
    </>
  )
}

function PricesAndPoolShare({
  amountIn,
  amountOut,
  currentTokenA,
  currentTokenB,
  fixedQuoteInRate,
  fixedQuoteOutRate,

  myPoolShare,
}: {
  amountIn: bigint
  amountOut: bigint
  currentTokenA: Token
  currentTokenB: Token
  fixedQuoteInRate: bigint
  fixedQuoteOutRate: bigint
  myPoolShare: number
}) {
  return (
    <Card className='mt-7 rounded-lg'>
      <div className='px-5 py-3'>
        <p className='text-sm font-medium'>Pools Rate</p>
      </div>
      <CardContent className='p-0'>
        <Card className='rounded-lg'>
          <CardContent className='p-4'>
            <div className='flex flex-wrap items-center justify-around gap-y-3 sm:gap-y-0'>
              <PoolPrice
                amountIn={amountIn}
                amountOut={amountOut}
                currentTokenA={currentTokenA}
                currentTokenB={currentTokenB}
                fixedQuoteInRate={fixedQuoteInRate}
                fixedQuoteOutRate={fixedQuoteOutRate}
              />
              {/* <PoolShare myPoolShare={myPoolShare} /> */}
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
  const [quoteInRate, setQuoteInRate] = useState('')
  const [quoteOutRate, setQuoteOutRate] = useState('')
  const [fixedQuoteInRate, setFixedQuoteInRate] = useState(BigInt(0))
  const [fixedQuoteOutRate, setFixedQuoteOutRate] = useState(BigInt(0))
  const [isApprovePending, setIsApprovePending] = useState(false)

  const amountIn = parseEther(amountAInput)
  const amountOut = parseEther(amountBInput)

  const currentTokenA = matchToken(selectedTokenA)
  const currentTokenB = matchToken(selectedTokenB)

  const pairAddress = usePair(currentTokenA, currentTokenB)
  const { myPoolShare, pairTotalSupply } = usePoolShare(
    currentTokenA,
    currentTokenB
  )
  const { quoteIn, quoteOut, quoteInPerOne, quoteOutPerOne } = useQuote(
    amountIn,
    amountOut,
    currentTokenA,
    currentTokenB
  )

  const quoteA = quoteIn ?? BigInt(0)
  const quoteB = quoteOut ?? BigInt(0)

  const isPairAddress = pairAddress !== zeroAddress
  const invalidPair = currentTokenA?.symbol === currentTokenB?.symbol

  const fmtdQuoteInRate =
    quoteInRate === ''
      ? ''
      : formatStringNumber(formatEther(BigInt(quoteInRate)), true)
  const fmtdQuoteOutRate =
    quoteOutRate === ''
      ? ''
      : formatStringNumber(formatEther(BigInt(quoteOutRate)), true)

  const valueA = !amountAInput ? fmtdQuoteInRate : amountAInput
  const valueB = !amountBInput ? fmtdQuoteOutRate : amountBInput

  const { isAllowance, approveTokensConfig } = useApproveLiquidity(
    amountIn,
    amountOut,
    quoteA,
    quoteB,
    currentTokenA,
    currentTokenB
  )

  const addLiquidityConfig = useAddLiquidity(
    amountIn,
    amountOut,
    quoteA,
    quoteB,
    currentTokenA,
    currentTokenB
  )

  const {
    writeContract,
    isPending: isInitTxPending,
    data: hash,
    isError: isInitTxError,
    error,
  } = useWriteContract()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash,
    })

  const createHandler =
    (
      setAmountInput: (value: string) => void,
      setOtherAmountInput: (value: string) => void,
      setInRate: (value: string) => void,
      setOutRate: (value: string) => void
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (!/^(?:\d*\.\d+|\d+\.?|)$/.test(value)) {
        return
      }

      if (isPairAddress) {
        if (value === '') {
          setInRate('')
          setOutRate('')
        }

        setAmountInput(value)
        setOtherAmountInput('')
      } else {
        setAmountInput(value)
      }
    }

  const handleValueA = createHandler(
    setAmountAInput,
    setAmountBInput,
    setQuoteInRate,
    setQuoteOutRate
  )
  const handleValueB = createHandler(
    setAmountBInput,
    setAmountAInput,
    setQuoteOutRate,
    setQuoteInRate
  )

  const handleOnApprove = () => {
    // @ts-ignore
    writeContract(approveTokensConfig?.request)
  }

  const handleOnAdd = () => {
    // @ts-ignore
    writeContract(addLiquidityConfig?.request)
    setIsApprovePending(true)
  }

  useEffect(() => {
    if (quoteIn) {
      setQuoteInRate(quoteIn.toString())
    } else {
      setQuoteInRate('')
    }

    if (quoteOut) {
      setQuoteOutRate(quoteOut.toString())
    } else {
      setQuoteOutRate('')
    }

    if (quoteInPerOne) {
      setFixedQuoteInRate(quoteInPerOne)
    }

    if (quoteOutPerOne) {
      setFixedQuoteOutRate(quoteOutPerOne)
    }
  }, [quoteIn, quoteOut, quoteInPerOne, quoteOutPerOne])

  useEffect(() => {
    if (!isInitTxPending && !isInitTxError && isApprovePending) {
      setAmountAInput('')
      setAmountBInput('')
      setQuoteInRate('')
      setQuoteOutRate('')
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

  useEffect(() => {
    setAmountAInput('')
    setAmountBInput('')
    setQuoteInRate('')
    setQuoteOutRate('')
  }, [currentTokenA, currentTokenB])

  return (
    <div className='mt-2 space-y-5'>
      <div>
        <AddInputSelector
          value={valueA}
          onAmountChange={handleValueA}
          currency={selectedTokenA}
          onSetToken={setSelectedTokenA}
          disabledToken={selectedTokenB}
        />
        <div className='my-4'>
          <ArrowDownIcon className='mx-auto' />
        </div>
        <AddInputSelector
          value={valueB}
          onAmountChange={handleValueB}
          currency={selectedTokenB}
          onSetToken={setSelectedTokenB}
          disabledToken={selectedTokenA}
        />
        {invalidPair ? null : (
          <PricesAndPoolShare
            amountIn={amountIn}
            amountOut={amountOut}
            currentTokenA={currentTokenA}
            currentTokenB={currentTokenB}
            fixedQuoteInRate={fixedQuoteInRate}
            fixedQuoteOutRate={fixedQuoteOutRate}
            myPoolShare={myPoolShare}
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

'use client'

import useQuote from '@/hooks/useQuote'
import { Token, matchAddress, matchToken } from '@/tokens/tokenList'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { ArrowDownIcon, PlusIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import useReserves from '@/hooks/useReserves'
import { formatStringNumber } from '@/lib/utils'
import usePair from '@/hooks/usePair'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { PAIR_ERC_ABI } from '@/contracts/pairErc'
import useApproveLiquidityTokens from '@/hooks/useApproveLiquidityTokens'
import { toast } from 'sonner'
import useRemoveLiquidityTokens from '@/hooks/useRemoveLiquidityTokens'

function RemoveButton({
  percentToRemove,
  isLiquidityAllowance,
  onApprove,
  onRemove,
  isTxPending,
  isTxLoading,
}: {
  isTxPending: boolean
  isTxLoading: boolean
  percentToRemove: number
  isLiquidityAllowance: boolean
  onApprove: () => void
  onRemove: () => void
}) {
  return (
    <div className='mt-5 grid grid-cols-2 gap-x-2'>
      <Button className='rounded-[0.8rem]' size='lg' disabled={isLiquidityAllowance || isTxPending || isTxLoading} onClick={onApprove}>
        Approve
      </Button>
      <Button className='rounded-[0.8rem]' size='lg' disabled={!isLiquidityAllowance || isTxPending || isTxLoading} onClick={onRemove}>
        Remove
      </Button>
    </div>
  )
}

function ReserveAmounts({ reserve0, reserve1, tokenA, tokenB }: { reserve0: string; reserve1: string; tokenA: Token; tokenB: Token }) {
  return (
    <div className='space-y-2 rounded-lg bg-accent p-4 dark:bg-accent/30'>
      <div className='flex items-center justify-between text-xl font-semibold'>
        <p>{reserve0}</p>
        <div className='flex items-center gap-x-2'>
          <Image src={tokenA?.logoURI as string} width={22} height={22} alt={`${tokenA?.symbol} Logo`} />
          <p>{tokenA?.symbol}</p>
        </div>
      </div>
      <div className='flex items-center justify-between text-xl font-semibold'>
        <p>{reserve1}</p>
        <div className='flex items-center gap-x-2'>
          <Image src={tokenB?.logoURI as string} width={22} height={22} alt={`${tokenB?.symbol} Logo`} />
          <p>{tokenB?.symbol}</p>
        </div>
      </div>
    </div>
  )
}

function FixedAmountButton({
  reserveIn,
  reserveOut,
  liquidityTokens,
  setPercentToRemove,
  setReserve0,
  setReserve1,
  setLiquidityTokens,
}: {
  reserveIn: bigint
  reserveOut: bigint
  liquidityTokens: bigint
  setReserve0: (value: string) => void
  setReserve1: (value: string) => void
  setPercentToRemove: Dispatch<SetStateAction<number>>
  setLiquidityTokens: Dispatch<SetStateAction<bigint>>
}) {
  const handleFixedPercent = (value: number) => {
    setPercentToRemove(value)

    const percent = (BigInt(value) * BigInt(100)) / BigInt(100) // Convert everything to bigint

    const newReserve0 = formatStringNumber(formatEther((BigInt(reserveIn) * percent) / BigInt(100)), true) // Make sure all operands are bigint
    const newReserve1 = formatStringNumber(formatEther((BigInt(reserveOut) * percent) / BigInt(100)), true) // Make sure all operands are bigint
    const newLiquidityTokens = (liquidityTokens * percent) / BigInt(100)

    setReserve0(newReserve0)
    setReserve1(newReserve1)
    setLiquidityTokens(newLiquidityTokens)
  }

  return (
    <div className='mt-7 flex items-center justify-between'>
      <Button variant='outline' className='rounded-[0.8rem]' onClick={() => handleFixedPercent(25)}>
        25%
      </Button>
      <Button variant='outline' className='rounded-[0.8rem]' onClick={() => handleFixedPercent(50)}>
        50%
      </Button>
      <Button variant='outline' className='rounded-[0.8rem]' onClick={() => handleFixedPercent(75)}>
        75%
      </Button>
      <Button variant='outline' className='rounded-[0.8rem]' onClick={() => handleFixedPercent(100)}>
        Max
      </Button>
    </div>
  )
}

function AmountSlider({
  reserveIn,
  reserveOut,
  liquidityTokens,
  setReserve0,
  setReserve1,
  setLiquidityTokens,
  percentToRemove,
  setPercentToRemove,
}: {
  reserveIn: bigint
  reserveOut: bigint
  liquidityTokens: bigint
  setReserve0: (value: string) => void
  setReserve1: (value: string) => void
  setLiquidityTokens: Dispatch<SetStateAction<bigint>>
  percentToRemove: number
  setPercentToRemove: Dispatch<SetStateAction<number>>
}) {
  const handleSliderChange = (value: number[]) => {
    setPercentToRemove(value[0])

    const percent = (BigInt(value[0]) * BigInt(100)) / BigInt(100) // Convert everything to bigint

    const newReserve0 = formatStringNumber(formatEther((BigInt(reserveIn) * percent) / BigInt(100)), true) // Make sure all operands are bigint
    const newReserve1 = formatStringNumber(formatEther((BigInt(reserveOut) * percent) / BigInt(100)), true) // Make sure all operands are bigint
    const newLiquidityTokens = (liquidityTokens * percent) / BigInt(100)

    setReserve0(newReserve0)
    setReserve1(newReserve1)
    setLiquidityTokens(newLiquidityTokens)
  }

  return (
    <div className='mt-5'>
      <span className='text-6xl font-semibold'>{percentToRemove}%</span>
      <Slider value={[percentToRemove]} max={100} step={1} className='mt-8' onValueChange={handleSliderChange} />
      <FixedAmountButton
        reserveIn={reserveIn}
        reserveOut={reserveOut}
        liquidityTokens={liquidityTokens}
        setReserve0={setReserve0}
        setReserve1={setReserve1}
        setPercentToRemove={setPercentToRemove}
        setLiquidityTokens={setLiquidityTokens}
      />
    </div>
  )
}

function RemoveAmount({
  reserveIn,
  reserveOut,
  liquidityTokens,
  setReserve0,
  setReserve1,
  setLiquidityTokens,
  percentToRemove,
  setPercentToRemove,
}: {
  reserveIn: bigint
  reserveOut: bigint
  liquidityTokens: bigint
  setReserve0: (value: string) => void
  setReserve1: (value: string) => void
  setLiquidityTokens: Dispatch<SetStateAction<bigint>>
  percentToRemove: number
  setPercentToRemove: Dispatch<SetStateAction<number>>
}) {
  return (
    <div className='rounded-lg bg-accent px-6 py-4 dark:bg-accent/30'>
      <p className='font-medium'>Remove amount</p>
      <AmountSlider
        reserveIn={reserveIn}
        reserveOut={reserveOut}
        liquidityTokens={liquidityTokens}
        setReserve0={setReserve0}
        setReserve1={setReserve1}
        setLiquidityTokens={setLiquidityTokens}
        percentToRemove={percentToRemove}
        setPercentToRemove={setPercentToRemove}
      />
    </div>
  )
}

export default function Remove() {
  const [reserve0, setReserve0] = useState('0')
  const [reserve1, setReserve1] = useState('0')
  const [liquidityTokens, setLiquidityTokens] = useState(BigInt(0))
  const [percentToRemove, setPercentToRemove] = useState(100)
  const [isApprovePending, setIsApprovePending] = useState(false)

  const searchParams = useSearchParams()
  const { address } = useAccount()

  const inputCurrency = searchParams.get('inputCurrency') as string
  const outputCurrency = searchParams.get('outputCurrency') as string

  const tokenA = matchAddress(inputCurrency)
  const tokenB = matchAddress(outputCurrency)

  const pairAddress = usePair(tokenA, tokenB)
  const { reserveIn, reserveOut } = useReserves(tokenA, tokenB)

  const { data: pairTotalSuppply } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 500,
    },
  })

  const { data: totalPoolTokens } = useReadContract({
    abi: PAIR_ERC_ABI,
    address: pairAddress,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      refetchInterval: 500,
    },
  })

  const totalSuppply = pairTotalSuppply !== undefined && pairTotalSuppply !== BigInt(0) ? pairTotalSuppply : BigInt(1)
  const myPoolTokens = totalPoolTokens ?? BigInt(0)

  const reserveA = totalSuppply !== BigInt(0) ? formatStringNumber(formatEther((reserveIn * myPoolTokens) / totalSuppply), true) : '0'
  const reserveB = totalSuppply !== BigInt(0) ? formatStringNumber(formatEther((reserveOut * myPoolTokens) / totalSuppply), true) : '0'
  const liqTokens = totalPoolTokens ?? BigInt(0)

  const { isLiquidityAllowance, approveLiquidityTokens } = useApproveLiquidityTokens(tokenA, tokenB, liquidityTokens)

  const removeLiquidityConfig = useRemoveLiquidityTokens(tokenA, tokenB, liquidityTokens)

  const { writeContract, isPending: isInitTxPending, data: hash, isError: isInitTxError, error } = useWriteContract()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleOnApprove = () => {
    // @ts-ignore
    writeContract(approveLiquidityTokens?.request)
  }

  const handleOnRemove = () => {
    // @ts-ignore
    writeContract(removeLiquidityConfig?.request)
  }

  useEffect(() => {
    setReserve0(reserveA)
    setReserve1(reserveB)
    setLiquidityTokens(liqTokens)
  }, [reserveA, reserveB, liqTokens])

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
    <div className='mt-2'>
      <RemoveAmount
        reserveIn={(reserveIn * myPoolTokens) / totalSuppply}
        reserveOut={(reserveOut * myPoolTokens) / totalSuppply}
        liquidityTokens={liqTokens}
        setReserve0={setReserve0}
        setReserve1={setReserve1}
        setLiquidityTokens={setLiquidityTokens}
        percentToRemove={percentToRemove}
        setPercentToRemove={setPercentToRemove}
      />
      <ArrowDownIcon className='mx-auto my-4' />
      <ReserveAmounts reserve0={reserve0} reserve1={reserve1} tokenA={tokenA} tokenB={tokenB} />
      <RemoveButton
        percentToRemove={percentToRemove}
        isLiquidityAllowance={isLiquidityAllowance}
        onApprove={handleOnApprove}
        onRemove={handleOnRemove}
        isTxPending={isInitTxPending}
        isTxLoading={isTxLoading}
      />
    </div>
  )
}

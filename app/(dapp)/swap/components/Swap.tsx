'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import SwapButton from './SwapButton'
import SwapInputSelector from './SwapInputSelector'
import SwitchToken from './SwitchToken'
import usePair from '@/hooks/usePair'
import useAmounts from '@/hooks/useAmounts'
import { formatStringNumber } from '@/lib/utils'
import { formatEther, parseEther } from 'viem'
import { matchToken } from '@/tokens/tokenList'
import useSwap from '@/hooks/useSwap'
import {
  useWaitForTransactionReceipt,
  useWatchPendingTransactions,
  useWriteContract,
} from 'wagmi'
import { toast } from 'sonner'
import useApprove from '@/hooks/useApprove'

export default function Swap() {
  const [amountAInput, setAmountAInput] = useState('')
  const [amountBInput, setAmountBInput] = useState('')
  const [rateTokenA, setRateTokenA] = useState('')
  const [rateTokenB, setRateTokenB] = useState('')
  const [selectedTokenA, setSelectedTokenA] = useState('OCTA')
  const [selectedTokenB, setSelectedTokenB] = useState('OCS')
  const [isApprovePending, setIsApprovePending] = useState(false)

  const amountIn = parseEther(amountAInput)
  const amountOut = parseEther(amountBInput)

  const currentTokenA = matchToken(selectedTokenA)
  const currentTokenB = matchToken(selectedTokenB)

  const pair = usePair(currentTokenA, currentTokenB)

  const { amountsIn, amountsOut } = useAmounts(
    amountIn,
    currentTokenA,
    amountOut,
    currentTokenB
  )

  const [rateA] = amountsIn ?? []
  const [, rateB] = amountsOut ?? []

  const valueA = !amountAInput ? rateTokenA : amountAInput
  const valueB = !amountBInput ? rateTokenB : amountBInput

  const { isAllowance, approveTokensConfig } = useApprove(
    amountIn,
    rateA,
    currentTokenA
  )

  const swapConfig = useSwap(
    amountIn,
    amountOut,
    currentTokenA,
    currentTokenB,
    rateA,
    rateB
  )
  const {
    writeContract,
    isPending: isInitTxPending,
    data: hash,
    isError: isInitTxError,
    isSuccess: isInitTxSuccess,
  } = useWriteContract()

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash,
    })

  const createHandler =
    (
      setAmountInput: (value: string) => void,
      setOtherAmountInput: (value: string) => void,
      setRateToken: (value: string) => void,
      setOtherRateToken: (value: string) => void
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (!/^(?:\d*\.\d+|\d+\.?|)$/.test(value)) {
        return
      }

      setAmountInput(value)
      setOtherAmountInput('')

      if (value === '') {
        setOtherAmountInput('')
        setRateToken('')
        setOtherRateToken('')
      }
    }

  const handleValueA = createHandler(
    setAmountAInput,
    setAmountBInput,
    setRateTokenA,
    setRateTokenB
  )
  const handleValueB = createHandler(
    setAmountBInput,
    setAmountAInput,
    setRateTokenB,
    setRateTokenA
  )

  const handleSwitchToken = () => {
    const tempAmount = amountAInput
    const tempToken = selectedTokenA

    setAmountAInput(amountBInput)
    setAmountBInput(tempAmount)

    setSelectedTokenA(selectedTokenB)
    setSelectedTokenB(tempToken)
  }

  const handleOnApprove = () => {
    // @ts-ignore
    writeContract(approveTokensConfig?.request)
  }

  const handleOnSwap = () => {
    // @ts-ignore
    writeContract(swapConfig?.request)
    setIsApprovePending(true)
  }

  useEffect(() => {
    if (rateA) {
      const fmtdRateA = formatStringNumber(formatEther(rateA), true)
      setRateTokenA(fmtdRateA)
    }

    if (rateB) {
      const fmtdRateB = formatStringNumber(formatEther(rateB), true)
      setRateTokenB(fmtdRateB)
    }
  }, [rateA, rateB])

  useEffect(() => {
    if (!isInitTxPending && !isInitTxError && isApprovePending) {
      setAmountAInput('')
      setAmountBInput('')
      setRateTokenA('')
      setRateTokenB('')
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
    setRateTokenA('')
    setRateTokenB('')
  }, [selectedTokenA, selectedTokenB])

  return (
    <div className='mt-2 space-y-2'>
      <div className='relative'>
        <div className='space-y-1'>
          <SwapInputSelector
            value={valueA}
            onAmountChange={handleValueA}
            currency={selectedTokenA}
            onSetToken={setSelectedTokenA}
            disabledToken={selectedTokenB}
          />
          <SwapInputSelector
            value={valueB}
            onAmountChange={handleValueB}
            currency={selectedTokenB}
            onSetToken={setSelectedTokenB}
            disabledToken={selectedTokenA}
          />
        </div>
        <SwitchToken onTokenSwitch={handleSwitchToken} />
      </div>
      <SwapButton
        pair={pair}
        amountIn={amountIn}
        amountOut={amountOut}
        currentTokenA={currentTokenA}
        currentTokenB={currentTokenB}
        isAllowance={isAllowance}
        onApprove={handleOnApprove}
        onSwap={handleOnSwap}
        isTxPending={isInitTxPending}
        isTxLoading={isTxLoading}
      />
    </div>
  )
}

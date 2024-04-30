import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatStringNumber } from '@/lib/utils'
import { NATIVE_OCTA, matchToken, tokenList } from '@/tokens/tokenList'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { erc20Abi, formatEther } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'

function Balance({ currency }: { currency: string }) {
  const { address, isDisconnected } = useAccount()
  const currentToken = matchToken(currency)

  const { data: octaBalance } = useBalance({
    address,
    query: {
      enabled: currency === NATIVE_OCTA.symbol,
      refetchInterval: 500,
    },
  })

  const { data: tokenBalance } = useReadContract({
    abi: erc20Abi,
    address: currentToken?.address as `0x${string}`,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: currency !== NATIVE_OCTA.symbol,
      refetchInterval: 500,
    },
  })

  const balance =
    currency === NATIVE_OCTA.symbol
      ? octaBalance?.value ?? BigInt(0)
      : tokenBalance ?? BigInt(0)

  const formatBalance = formatStringNumber(formatEther(balance), true)

  return (
    <p
      className={cn(
        'invisible text-sm text-muted-foreground',
        !isNaN(Number(formatBalance)) && 'visible'
      )}
    >
      Balance : {formatBalance}
    </p>
  )
}

function Price() {
  return <p className='invisible text-sm text-muted-foreground'>$0 </p>
}

function TokenSelector({
  currency,
  onSetToken,
  disabledToken,
}: {
  currency: string
  onSetToken: Dispatch<SetStateAction<string>>
  disabledToken: string
}) {
  const getTokenList = tokenList()
  const currentToken = getTokenList.find((token) => token.symbol === currency)

  return (
    <Select value={currency} onValueChange={onSetToken}>
      <SelectTrigger className='basis-3/4 bg-background sm:basis-1/2'>
        <SelectValue aria-label={currency}>
          <span className='flex items-center gap-x-2'>
            <Image
              src={currentToken?.logoURI as string}
              alt={`${currentToken?.symbol} Logo`}
              width={22}
              height={22}
            />
            <span className='text-lg font-semibold'>
              {currentToken?.symbol}
            </span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className='max-h-[13rem]'>
        {getTokenList.map((token) => {
          if (token.symbol === 'WOCTA') {
            return null
          }

          return (
            <SelectItem
              value={token.symbol}
              key={token.symbol}
              disabled={token.symbol === disabledToken}
            >
              <span className='flex items-center gap-x-2'>
                <Image
                  src={token.logoURI}
                  alt={`${token.symbol} Logo`}
                  width={22}
                  height={22}
                />
                <span className='text-lg font-semibold'>{token.symbol}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export default function SwapInputSelector({
  value,
  onAmountChange,
  currency,
  onSetToken,
  disabledToken,
}: {
  value: string
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  currency: string
  onSetToken: Dispatch<SetStateAction<string>>
  disabledToken: string
}) {
  return (
    <div className='rounded-lg bg-accent p-4 dark:bg-accent/30'>
      <div className='flex items-center gap-x-3 sm:gap-x-0'>
        <Input
          value={value}
          onChange={onAmountChange}
          type='text'
          placeholder='0'
          className='border-none text-2xl shadow-none placeholder-shown:text-2xl focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <TokenSelector
          currency={currency}
          onSetToken={onSetToken}
          disabledToken={disabledToken}
        />
      </div>
      <div className='mt-5 flex items-center justify-between px-2'>
        <Price />
        <Balance currency={currency} />
      </div>
    </div>
  )
}

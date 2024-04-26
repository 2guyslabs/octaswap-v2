'use client'

import { Progress } from '@/components/ui/progress'
import { OCTADOGE_ABI, OCTADOGE_ADDRESS } from '@/contracts/octadoge'
import { OCTADOGE_SALE_ADDRESS } from '@/contracts/octadogesale'
import { formatNumber } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { erc20Abi, formatEther } from 'viem'
import { useReadContract } from 'wagmi'

export default function SaleDetails() {
  const TOKENS_FOR_SALE = 35e6

  const { data: saleBalance } = useReadContract({
    abi: erc20Abi,
    address: OCTADOGE_ADDRESS,
    functionName: 'balanceOf',
    args: [OCTADOGE_SALE_ADDRESS],
  })

  const formattedSaleBalance = Number(formatEther(saleBalance ?? BigInt(0)))
  const tokenSold = TOKENS_FOR_SALE - formattedSaleBalance
  const tokenSoldProgress = (tokenSold / TOKENS_FOR_SALE) * 100

  return (
    <div className='space-y-5'>
      <div className='space-y-3'>
        <Progress value={tokenSoldProgress} />
        <div className='flex items-center justify-between px-1 text-sm'>
          <p>{formatNumber(tokenSold)} SOLD</p>
          <p>35M FOR SALE</p>
        </div>
      </div>
      <ul className='space-y-3'>
        <li className='flex items-center justify-between font-semibold'>
          <p>Softcap</p>
          <p>7,750 OCTA</p>
        </li>
        <li className='flex items-center justify-between font-semibold'>
          <p>Min Buy</p>
          <p>10 OCTA</p>
        </li>
        <li className='flex items-center justify-between font-semibold'>
          <p>Max Buy</p>
          <p>850 OCTA</p>
        </li>
      </ul>
      <div className='space-y-1 text-sm italic'>
        <p>*Rate 1 Octa = 1935 $OCTADOGE</p>
        <p>
          *We will list at a rate of 1740 OCTADOGE tokens per OCTA, that&apos;ll
          be a 10% profit for presale buyers.
        </p>
      </div>
    </div>
  )
}

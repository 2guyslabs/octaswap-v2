'use client'

import { Progress } from '@/components/ui/progress'
import { OCTADOGE_ABI, OCTADOGE_ADDRESS } from '@/contracts/octadoge'
import { OCTADOGE_SALE_ADDRESS } from '@/contracts/octadogesale'
import { OCTAINU_ADDRESS } from '@/contracts/octainu'
import { OCTAINU_SALE_ADDRESS } from '@/contracts/octainusale'
import { formatNumber } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { erc20Abi, formatEther } from 'viem'
import { useReadContract } from 'wagmi'

export default function SaleDetails() {
  const TOKENS_FOR_SALE = 6e7

  const { data: saleBalance } = useReadContract({
    abi: erc20Abi,
    address: OCTAINU_ADDRESS,
    functionName: 'balanceOf',
    args: [OCTAINU_SALE_ADDRESS],
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
          <p>60M FOR SALE</p>
        </div>
      </div>
      <ul className='space-y-3'>
        <li className='flex items-center justify-between font-semibold'>
          <p>Softcap</p>
          <p>2,000 OCTA</p>
        </li>
        <li className='flex items-center justify-between font-semibold'>
          <p>Min Buy</p>
          <p>10 OCTA</p>
        </li>
        <li className='flex items-center justify-between font-semibold'>
          <p>Max Buy</p>
          <p>1200 OCTA</p>
        </li>
      </ul>
      <div className='space-y-1 text-sm italic'>
        <p>*Rate 1 Octa = 3,000 $OCTABET</p>
      </div>
    </div>
  )
}

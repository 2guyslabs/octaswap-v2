'use client'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/factory'
import usePools, { PoolData } from '@/hooks/usePools'
import { formatStringNumber } from '@/lib/utils'
import { matchAddress } from '@/tokens/tokenList'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect } from 'react'
import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

function PoolDetails({ poolData }: { poolData: PoolData }) {
  const tokenA = matchAddress(poolData.inputTokenAddress)
  const tokenB = matchAddress(poolData.outputTokenAddress)

  const totalPoolTokens = formatStringNumber(formatEther(poolData.totalPoolTokens ?? BigInt(0)), false)

  const pooledTokenA = formatStringNumber(formatEther(poolData.reserve?.[0] ?? BigInt(0)), false)
  const pooledTokenB = formatStringNumber(formatEther(poolData.reserve?.[1] ?? BigInt(0)), false)

  const poolShare = (Number(poolData.totalPoolTokens) / Number(poolData.totalSupply)) * 100

  return (
    <div className='mt-3 space-y-3 text-sm font-semibold'>
      <div className='flex items-center justify-between'>
        <p>Total pool tokens :</p>
        <p>{totalPoolTokens}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p>Pooled {tokenA?.symbol} :</p>
        <p>{pooledTokenA}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p>Pooled {tokenB?.symbol} :</p>
        <p>{pooledTokenB}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p>Pool share :</p>
        <p>{poolShare}%</p>
      </div>
      {/* <div className='grid grid-cols-2 gap-x-3'>
        <Button className='rounded-[0.8rem]'>
          <Link href='/pools/add'>Add</Link>
        </Button>
        <Button className='rounded-[0.8rem]' disabled>
          <Link href='/pools/remove'>Remove</Link>
        </Button>
      </div> */}
    </div>
  )
}

function PoolInfo({ poolData }: { poolData: PoolData }) {
  const tokenA = matchAddress(poolData.inputTokenAddress)
  const tokenB = matchAddress(poolData.outputTokenAddress)

  return (
    <div className='flex items-center gap-x-5'>
      <div className='flex items-center gap-x-1'>
        <Image src={tokenA?.logoURI ?? ''} alt={`${tokenA?.symbol} Logo`} width={22} height={22} />
        <Image src={tokenB?.logoURI ?? ''} alt={`${tokenB?.symbol} Logo`} width={22} height={22} />
      </div>
      <span className='font-bold'>
        {tokenA?.symbol}/{tokenB?.symbol}
      </span>
    </div>
  )
}

function Pool({ poolData }: { poolData: PoolData }) {
  return (
    <Collapsible className='rounded-[0.8rem] bg-gradient-to-r from-[#6d28d9]/10 to-transparent p-3'>
      <div className='flex items-center justify-between'>
        <PoolInfo poolData={poolData} />
        <CollapsibleTrigger asChild>
          <button className='flex items-center gap-x-2 rounded-[0.8rem]'>
            <span className='underline hover:no-underline'>Manage</span>
            <ChevronDownIcon className='h-5 w-5' />
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <PoolDetails poolData={poolData} />
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function Positions() {
  const myPools = usePools()

  return (
    <div className='mt-3 space-y-3'>
      {myPools.length > 0 ? myPools.map((pool, i) => <Pool key={i} poolData={pool} />) : <p className='mt-10 text-center text-lg text-muted-foreground'>No pools found</p>}
    </div>
  )
}

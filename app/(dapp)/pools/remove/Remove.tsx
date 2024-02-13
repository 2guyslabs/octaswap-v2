'use client'

import useQuote from '@/hooks/useQuote'
import { matchToken } from '@/tokens/tokenList'
import { ChangeEvent, useState } from 'react'
import { parseEther } from 'viem'
import { ArrowDownIcon, PlusIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

function RemoveButton() {
  return (
    <div className='mt-5 grid grid-cols-2 gap-x-2'>
      <Button className='rounded-[0.8rem]' size='lg'>
        Approve
      </Button>
      <Button className='rounded-[0.8rem]' size='lg'>
        Remove
      </Button>
    </div>
  )
}

function ReserveAmounts() {
  return (
    <div className='space-y-2 rounded-lg bg-accent p-4 dark:bg-accent/30'>
      <div className='flex items-center justify-between text-xl font-semibold'>
        <p>21344</p>
        <div className='flex items-center gap-x-2'>
          <Image src='/logos/octa-logo.svg' width={22} height={22} alt='OCTA' />
          <p>OCTA</p>
        </div>
      </div>
      <div className='flex items-center justify-between text-xl font-semibold'>
        <p>0.119999</p>
        <div className='flex items-center gap-x-2'>
          <Image src='/logos/ocs-logo.svg' width={22} height={22} alt='OCS' />
          <p>OCS</p>
        </div>
      </div>
    </div>
  )
}

function FixedAmountButton() {
  return (
    <div className='mt-7 flex items-center justify-between'>
      <Button variant='outline' className='rounded-[0.8rem]'>
        25%
      </Button>
      <Button variant='outline' className='rounded-[0.8rem]'>
        50%
      </Button>
      <Button variant='outline' className='rounded-[0.8rem]'>
        75%
      </Button>
      <Button variant='outline' className='rounded-[0.8rem]'>
        Max
      </Button>
    </div>
  )
}

function AmountSlider() {
  return (
    <div className='mt-5'>
      <span className='text-6xl font-semibold'>57%</span>
      <Slider defaultValue={[57]} max={100} step={1} className='mt-8' />
      <FixedAmountButton />
    </div>
  )
}

function RemoveAmount() {
  return (
    <div className='rounded-lg bg-accent px-6 py-4 dark:bg-accent/30'>
      <p className='font-medium'>Remove amount</p>
      <AmountSlider />
    </div>
  )
}

export default function Remove() {
  return (
    <div className='mt-2'>
      <RemoveAmount />
      <ArrowDownIcon className='mx-auto my-4' />
      <ReserveAmounts />
      <RemoveButton />
    </div>
  )
}

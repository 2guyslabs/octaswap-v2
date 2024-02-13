'use client'

import { Button } from '@/components/ui/button'
import { GearIcon } from '@radix-ui/react-icons'

export default function SwapSettings() {
  return (
    <Button variant='ghost' size='icon'>
      <GearIcon className='h-5 w-5' />
    </Button>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import SwapSettings from './components/SwapSettings'
import Swap from './components/Swap'
import { redirect } from 'next/navigation'

export default function SwapPage() {
  redirect('https://app.octaswap.io/swap')

  return (
    <main>
      <div className='px-2 pt-7 sm:pt-16 lg:pt-20'>
        <Card className='mx-auto max-w-sm rounded-lg sm:max-w-[27rem]'>
          <CardContent className='px-3 py-2'>
            <div className='flex items-center justify-between px-3'>
              <p className='font-medium'>Swap</p>
              <SwapSettings />
            </div>
            <Swap />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SwapSettings from '../../swap/components/SwapSettings'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import Remove from './Remove'
import { redirect } from 'next/navigation'

export default function RemovePage() {
  return (
    <main>
      <div className='px-2 pb-20 pt-5'>
        <Card className='mx-auto max-w-sm rounded-lg sm:max-w-md'>
          <CardContent className='px-3 py-2'>
            <div className='flex items-center justify-between'>
              <Button variant='ghost' size='icon'>
                <ArrowLeftIcon />
              </Button>
              <p className='font-medium'>Remove Liquidity</p>
              <SwapSettings />
            </div>
            <Remove />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SwapSettings from '../../swap/components/SwapSettings'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import Add from './components/Add'
import Link from 'next/link'

export default function AddPage() {
  return (
    <main>
      <div className='px-2 pb-20 pt-5'>
        <Card className='mx-auto max-w-sm rounded-lg sm:max-w-md'>
          <CardContent className='p-3'>
            <div className='flex items-center justify-between'>
              <Button variant='ghost' size='icon'>
                <Link href='/pools'>
                  <ArrowLeftIcon />
                </Link>
              </Button>
              <p className='font-medium'>Add Liquidity</p>
              <SwapSettings />
            </div>
            <Add />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Positions from './components/Positions'
import { redirect } from 'next/navigation'

export default function PoolsPage() {
  redirect('/swap')

  return (
    <main>
      <div className='mx-auto max-w-xl px-2 pb-20 pt-7'>
        <div className='grid grid-cols-2 gap-x-3'>
          <Button className='rounded-[0.8rem]'>
            <Link href='/pools/add'>Add Pools</Link>
          </Button>
          <Button className='rounded-[0.8rem]'>
            <Link href='/pools/find'>Import Pools</Link>
          </Button>
        </div>
        <div>
          <Positions />
        </div>
      </div>
    </main>
  )
}

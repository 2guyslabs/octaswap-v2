import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Claim from './components/Claim'

export default function Home() {
  return (
    <main>
      <div className='px-2 pt-7 sm:pt-16 lg:pt-20'>
        <div className='mx-auto max-w-[95%] sm:max-w-[70%] md:max-w-[460.8px]'>
          <Claim title='Claim' description='Claim your free OCS after trade open or claim your purchased OCS from the sale and your vested tokens overtime here' />
        </div>
      </div>
    </main>
  )
}

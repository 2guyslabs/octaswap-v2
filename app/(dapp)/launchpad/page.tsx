import { Card, CardContent } from '@/components/ui/card'
import ProjectDetails from './components/ProjectDetails'
import SaleDetails from './components/SaleDetails'
import SaleInput from './components/SaleInput'

export default function Launchpad() {
  return (
    <main>
      <div className='px-2 pb-20 pt-7'>
        <Card className='mx-auto max-w-sm sm:max-w-[27rem]'>
          <CardContent className='space-y-5 p-7'>
            <ProjectDetails />
            <SaleDetails />
            <SaleInput />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

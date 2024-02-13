import MobileNavbar from '@/components/Navbar/MobileNavbar'
import Navbar from '@/components/Navbar/Navbar'
import { Toaster } from '@/components/ui/sonner'

export default function DappLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative'>
      <Navbar />
      {children}
      <MobileNavbar />
      <Toaster expand richColors closeButton />
    </div>
  )
}

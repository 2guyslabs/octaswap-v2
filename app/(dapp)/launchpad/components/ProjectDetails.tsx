import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { FaTelegram, FaTwitter } from 'react-icons/fa6'

function ProjectDescription() {
  return (
    <>
      <h1 className='text-2xl font-bold'>OctaDoge</h1>
      <ProjectSocials />
      <p className='text-sm'>
        Octadoge is a community-fueled, charity-minded and totally dogestastic
        meme token on the OctaSpace network. We&apos;re making our mark as the
        ultimate meme mascot of the Octa Blockchain.
      </p>
    </>
  )
}

function ProjectSocials() {
  return (
    <div className='flex items-center justify-center gap-x-3'>
      <a href='https://x.com/octadoge' target='_blank'>
        <FaTwitter className='h-5 w-5' />
      </a>
      <a href='https://t.me/octadoge' target='_blank'>
        <FaTelegram className='h-5 w-5' />
      </a>
    </div>
  )
}

function ProjectLogo() {
  return (
    <Image
      src='/logos/octadoge-logo.jpg'
      alt='OctaDoge Logo'
      width={70}
      height={70}
      className='mx-auto'
    />
  )
}

export default function ProjectDetails() {
  return (
    <div className='space-y-3 text-center'>
      <ProjectLogo />
      <ProjectDescription />
    </div>
  )
}

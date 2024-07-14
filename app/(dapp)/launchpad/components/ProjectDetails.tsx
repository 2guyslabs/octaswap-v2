import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { FaGlobe, FaTelegram, FaTwitter } from 'react-icons/fa6'

function ProjectDescription() {
  return (
    <>
      <h1 className='text-2xl font-bold'>OctaBet</h1>
      <ProjectSocials />
      <p className='text-sm'>
        Octabet is a sport betting utility token built on Octaspace ecosystem
        aiming to bring more bet system and utilities to Octaspace Chain.
        Octabet aims to build the strongest community and usage of the Octaspace
        Chain for daily activities.
      </p>
    </>
  )
}

function ProjectSocials() {
  return (
    <div className='flex items-center justify-center gap-x-3'>
      <a href='https://octabetss.site/' target='_blank'>
        <FaGlobe className='h-5 w-5' />
      </a>
      <a href='https://x.com/Octabetonocta' target='_blank'>
        <FaTwitter className='h-5 w-5' />
      </a>
      <a href='https://t.me/octabetonoctaspace' target='_blank'>
        <FaTelegram className='h-5 w-5' />
      </a>
    </div>
  )
}

function ProjectLogo() {
  return (
    <Image
      src='/logos/octabet-logo.jpg'
      alt='OctaBet Logo'
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

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { FaGlobe, FaTelegram, FaTwitter } from 'react-icons/fa6'

function ProjectDescription() {
  return (
    <>
      <h1 className='text-2xl font-bold'>Octa Inu</h1>
      <ProjectSocials />
      <p className='text-sm'>
        Octa Inu is the Inu meme token of the Octaspace ecosystem developed by
        the doxed team at Amphi Collective. Octa Inu seeks to build the
        strongest community and incentivize the education, growth, & usage of
        the Octaspace product suite.
      </p>
    </>
  )
}

function ProjectSocials() {
  return (
    <div className='flex items-center justify-center gap-x-3'>
      <a href='https://octainutoken.lol' target='_blank'>
        <FaGlobe className='h-5 w-5' />
      </a>
      <a href='https://x.com/octainutoken' target='_blank'>
        <FaTwitter className='h-5 w-5' />
      </a>
      <a href='https://t.me/octainutokentg' target='_blank'>
        <FaTelegram className='h-5 w-5' />
      </a>
    </div>
  )
}

function ProjectLogo() {
  return (
    <Image
      src='/logos/octa-inu-logo.png'
      alt='Octa Inu Logo'
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

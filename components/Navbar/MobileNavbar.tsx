'use client'

import Link from 'next/link'
import { menu } from './links'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function Menu({ link }: { link: { href: string; label: string } }) {
  const pathname = usePathname()
  const isActive = pathname === link.href
  const activeClass = isActive ? 'bg-accent/50' : ''
  const disableClaim = link.href === '/claim'
  const disablePools = link.href === '/pools'

  return (
    <li className={cn(activeClass, 'rounded-lg px-4 py-2 hover:bg-accent')}>
      <Link href={link.href} className={cn('text-sm font-medium', disableClaim ? 'pointer-events-none' : '', disablePools ? 'pointer-events-none' : '')} aria-disabled={disableClaim}>
        {link.label}
      </Link>
    </li>
  )
}

export default function MobileNavbar() {
  return (
    <div className='fixed bottom-2 z-10 w-full p-2 sm:hidden'>
      <ul className='mx-auto flex w-fit items-center justify-evenly rounded-lg border bg-background p-1'>
        {menu.map((link) => (
          <Menu key={link.href} link={link} />
        ))}
      </ul>
    </div>
  )
}

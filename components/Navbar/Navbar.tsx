'use client'

import dynamic from 'next/dynamic'
import Wallet from './Wallet'
import { LoadingThemeToggle } from './ThemeToggle'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '../ui/navigation-menu'
import Link from 'next/link'
import { menu } from './links'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const ThemeToggle = dynamic(() => import('./ThemeToggle'), {
  ssr: false,
  loading: () => <LoadingThemeToggle />,
})

function Menu({ link }: { link: { href: string; label: string } }) {
  const pathname = usePathname()
  const isActive = pathname === link.href
  const disableClaim = link.href === '/claim'

  return (
    <NavigationMenuItem>
      <Link href={link.href} legacyBehavior passHref>
        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), disableClaim ? 'pointer-events-none' : '')} active={isActive} aria-disabled={disableClaim}>
          {link.label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}

export default function Navbar() {
  return (
    <div className='flex items-center justify-between p-4'>
      <div className='flex items-center gap-x-5'>
        <a href='#' className='flex items-center gap-x-3'>
          <Image src='/logos/ocs-logo.svg' alt='OctaSwap Logo' width={30} height={30} />
        </a>
        <NavigationMenu className='hidden sm:block'>
          <NavigationMenuList>
            {menu.map((link) => (
              <Menu key={link.href} link={link} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className='flex items-center gap-x-2'>
        <ThemeToggle />
        <Wallet />
      </div>
    </div>
  )
}

import { useTheme } from 'next-themes'
import { Button } from '../ui/button'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

export function LoadingThemeToggle() {
  return <div className='h-[36px] w-[36px]'></div>
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const icon =
    theme === 'dark' ? (
      <MoonIcon className='h-5 w-5' />
    ) : (
      <SunIcon className='h-5 w-5' />
    )
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button variant='ghost' size='icon' onClick={() => setTheme(nextTheme)}>
      {icon}
    </Button>
  )
}

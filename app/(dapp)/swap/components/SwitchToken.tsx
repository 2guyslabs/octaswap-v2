import { Button } from '@/components/ui/button'
import { ArrowDownIcon, UpdateIcon } from '@radix-ui/react-icons'

export default function SwitchToken({
  onTokenSwitch,
}: {
  onTokenSwitch: () => void
}) {
  return (
    <Button
      variant='outline'
      size='icon'
      className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform border-none'
      onClick={onTokenSwitch}
    >
      <UpdateIcon className='h-5 w-5' />
    </Button>
  )
}

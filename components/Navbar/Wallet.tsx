import { ComponentPropsWithRef, forwardRef } from 'react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import {
  useAccount,
  useClient,
  useConfig,
  useConnect,
  useDisconnect,
} from 'wagmi'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { CopyIcon, ExitIcon, Link1Icon, Link2Icon } from '@radix-ui/react-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'sonner'

const SHEET_SIDE = 'bottom'

function OpenExplorer({ address }: { address: string }) {
  const { chain } = useClient()

  const explorer = chain.blockExplorers.default.url

  return (
    <DropdownMenuItem>
      <a
        href={`${explorer}/address/${address}`}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center gap-x-2'
      >
        <Link2Icon />
        Explorer
      </a>
    </DropdownMenuItem>
  )
}

function CopyAddress({ address }: { address: string }) {
  return (
    <DropdownMenuItem onSelect={() => toast.success(`${address} copied`)}>
      <div className='flex items-center gap-x-2'>
        <CopyToClipboard text={address}>
          <div className='flex items-center gap-x-2'>
            <CopyIcon />
            Copy Address
          </div>
        </CopyToClipboard>
      </div>
    </DropdownMenuItem>
  )
}

function Disconnect() {
  const data = useAccount()
  const { disconnect } = useDisconnect()

  const address = data.address as string

  const formatAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{formatAddress}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={15} align='end'>
        <OpenExplorer address={address} />
        <CopyAddress address={address} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => disconnect()}
          className='text-red-600 hover:!text-red-600'
        >
          <div className='flex items-center gap-x-2'>
            <ExitIcon />
            Disconnect
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Connect() {
  const isSmall = useMediaQuery({ query: '(min-width: 640px)' })

  if (isSmall) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Connect</Button>
        </DialogTrigger>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <Connectors />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Connect</Button>
      </SheetTrigger>
      <SheetContent side={SHEET_SIDE}>
        <SheetHeader>
          <SheetTitle>Connect Wallet</SheetTitle>
        </SheetHeader>
        <Connectors />
      </SheetContent>
    </Sheet>
  )
}

function Connectors() {
  const { connectors, connect, isPending } = useConnect()
  const { state } = useConfig()

  return (
    <div className='mt-5 space-y-4 px-3'>
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector, chainId: state.chainId })}
          className='flex w-full items-center gap-x-2'
          disabled={isPending}
        >
          {connector.icon ? (
            <Image
              src={connector.icon as string}
              alt={`${connector.name} Icon`}
              width={20}
              height={20}
            />
          ) : null}

          {connector.name}
        </Button>
      ))}
    </div>
  )
}

export default function Wallet() {
  const { isConnected } = useAccount()

  return isConnected ? <Disconnect /> : <Connect />
}

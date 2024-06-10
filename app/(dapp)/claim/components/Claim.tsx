'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { parseEther } from 'viem'
import { ovfContractConfig } from '@/contracts/ocsVestingFactory'
import { OCS_VESTING_ABI } from '@/contracts/ocsVesting'
import { OCS_ABI, OCS_ADDRESS } from '@/contracts/ocs'
import { Button } from '@/components/ui/button'
import { saleContractConfig } from '@/contracts/sale'
import { LBC_ABI, LBC_ADDRESS } from '@/contracts/lbc'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getFormattedDate } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const DECIMALS_N = BigInt(10) ** BigInt(18)

function ClaimButton() {
  const { address } = useAccount()

  const { data: vestingContract } = useReadContract({
    ...ovfContractConfig,
    functionName: 'getBelongsTo',
    args: [address as `0x${string}`],
  })

  const { data: vestedTokens } = useReadContract({
    abi: OCS_VESTING_ABI,
    address: vestingContract,
    functionName: 'releasable',
    args: [OCS_ADDRESS],
  })

  const vested = vestedTokens ?? BigInt(0)
  const isReleasable = vested > BigInt(0)
  const releasableTokens = Number(vested / DECIMALS_N)

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading } = useWaitForTransactionReceipt({
    hash,
  })

  return (
    <Button
      className='mt-5 w-full'
      size='lg'
      disabled={!isReleasable || isPending || isLoading}
    >
      <span
        className='font-bold'
        onClick={() =>
          writeContract({
            abi: OCS_VESTING_ABI,
            address: vestingContract as `0x${string}`,
            functionName: 'release',
            args: [OCS_ADDRESS],
          })
        }
      >
        Claim OCS
      </span>
    </Button>
  )
}

function FreeClaim({
  id,
  label,
  enableFreeClaim,
  onCheckFreeClaim,
}: {
  id: string
  label: string
  enableFreeClaim: boolean
  onCheckFreeClaim: Dispatch<SetStateAction<boolean>>
}) {
  const SNAPSHOT_ID = BigInt(1)

  const { address } = useAccount()

  const { data: isSaleOpen } = useReadContract({
    ...saleContractConfig,
    functionName: 'isOpen',
  })

  const { data: snapshotData } = useReadContract({
    abi: LBC_ABI,
    address: LBC_ADDRESS,
    functionName: 'balanceOfAt',
    args: [address as `0x${string}`, SNAPSHOT_ID],
  })

  const { data: burnLimit } = useReadContracts({
    contracts: [
      {
        ...saleContractConfig,
        functionName: 'LBC_MAX_PURCHASE',
      },
      {
        ...saleContractConfig,
        functionName: 'lbcContributions',
        args: [address as `0x${string}`],
      },
    ],
  })

  const [LBC_MAX_PURCHASE, lbcContributions] = burnLimit || []

  const snapshotBalance = snapshotData ?? BigInt(0)
  const lbcMaxPurchase = LBC_MAX_PURCHASE?.result ?? BigInt(0)
  const currentLbcContributions = lbcContributions?.result ?? BigInt(0)

  const isEligible = snapshotData ? snapshotData > parseEther('750000') : false
  const isLbcContributionsMax =
    snapshotBalance > lbcMaxPurchase
      ? currentLbcContributions === lbcMaxPurchase
      : currentLbcContributions === snapshotBalance

  return (
    <div className='flex items-center gap-x-2'>
      <Switch
        id={id}
        checked={enableFreeClaim}
        onCheckedChange={onCheckFreeClaim}
        disabled
      />
      <Label htmlFor={id}>{label}</Label>
      {isEligible ? (
        isLbcContributionsMax ? (
          <Badge variant='destructive'>LIMIT REACHED</Badge>
        ) : (
          <Badge>Eligible</Badge>
        )
      ) : (
        <Badge variant='destructive'>Not Eligible</Badge>
      )}
    </div>
  )
}

function ClaimInfo() {
  const { address } = useAccount()
  const formattedAddress = address as `0x${string}`

  const { data: vestingContract } = useReadContract({
    ...ovfContractConfig,
    functionName: 'getBelongsTo',
    args: [formattedAddress],
  })

  const { data: vestedTokens } = useReadContract({
    abi: OCS_ABI,
    address: OCS_ADDRESS,
    functionName: 'balanceOf',
    args: [vestingContract as `0x${string}`],
  })

  const formattedVestedTokens = Number(
    vestedTokens ? vestedTokens / DECIMALS_N : BigInt(0)
  )

  const ovContractConfig = {
    abi: OCS_VESTING_ABI,
    address: vestingContract,
  }

  const { data: vestingData } = useReadContracts({
    contracts: [
      {
        ...ovContractConfig,
        functionName: 'released',
        args: [OCS_ADDRESS],
      },
      {
        ...ovContractConfig,
        functionName: 'releasable',
        args: [OCS_ADDRESS],
      },
      {
        ...ovContractConfig,
        functionName: 'start',
      },
    ],
    query: {
      refetchInterval: 1000,
    },
  })

  const [released, releasable, startTimestamp] = vestingData || []
  const SIX_MONTHS_IN_MS = BigInt(15778476)
  const vestingTimestamp = Number(
    startTimestamp?.result
      ? startTimestamp.result + SIX_MONTHS_IN_MS
      : BigInt(0)
  )
  const vestingStart = getFormattedDate(Number(startTimestamp?.result))
  const vestingDate = getFormattedDate(vestingTimestamp)

  const totalClaimed = Number(
    released?.result ? released.result / DECIMALS_N : BigInt(0)
  )
  const claimableTokens = Number(
    releasable?.result ? releasable.result / DECIMALS_N : BigInt(0)
  )

  return (
    <div className='mt-5'>
      <div>
        <ul className='list-inside list-disc space-y-1 '>
          <li>
            Locked :{' '}
            <span className='tabular-nums'> {formattedVestedTokens} </span> OCS
          </li>
          <li>
            Total Claimed :{' '}
            <span className='tabular-nums'> {totalClaimed} </span> OCS
          </li>
          <li>
            Vested Tokens :{' '}
            <span className='tabular-nums'> {claimableTokens} </span> OCS
          </li>
          <li>
            Vesting Start : {vestingTimestamp ? vestingStart : '00:00:00:00'}{' '}
          </li>
          <li>
            Vesting End Date : {vestingTimestamp ? vestingDate : '00:00:00:00'}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default function Claim({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const [enableFreeClaim, setEnableFreeClaim] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className='space-y-3'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FreeClaim
          id='freeOcs'
          label='OCS Free Claim'
          enableFreeClaim={enableFreeClaim}
          onCheckFreeClaim={setEnableFreeClaim}
        />
        <ClaimInfo />
        <ClaimButton />
      </CardContent>
    </Card>
  )
}

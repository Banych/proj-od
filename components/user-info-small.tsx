'use client'

import { ClassValue } from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FC, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type UserInfoSmallProps = {
  className?: ClassValue
}

const UserInfoSmall: FC<UserInfoSmallProps> = ({ className }) => {
  const { data, status } = useSession()

  const isLoading = useMemo(() => status === 'loading', [status])

  const userInitials = useMemo(() => {
    if (data?.user?.name) {
      return data.user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
    }
    return ''
  }, [data?.user?.name])

  if (isLoading) {
    return <Skeleton className={cn('h-20 w-40', className)} />
  }

  if (status === 'unauthenticated') {
    return (
      <Button variant="default">
        <Link href="/auth/login">Войти</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={cn('flex items-center gap-2', className)}>
          <Avatar>
            <AvatarImage
              src={data?.user?.image || ''}
              alt={data?.user?.name || ''}
            />
            <AvatarFallback className="font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span>{data?.user?.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile">Профиль</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/requests/my">Мои запросы</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserInfoSmall

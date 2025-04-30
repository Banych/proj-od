import Image from 'next/image'
import Link from 'next/link'

import RequestsFilter from '@/components/requests-filter'
import MenuListItem from '@/components/ui/menu-list-item'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import UserInfoSmall from '@/components/user-info-small'
import getSessionUser from '@/lib/get-session-user'
import { Role } from '@/generated/prisma-client'
import { buttonVariants } from '@/components/ui/button'

const Header = async () => {
  const user = await getSessionUser()

  if (!user) {
    return null
  }

  return (
    <div className="container flex items-center justify-between gap-7 p-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1>
            <Image
              src="/logo.png"
              alt="Мултон Партнерс"
              className="size-auto"
              width={200}
              height={80}
              priority
            />
          </h1>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Запросы</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-[200px] flex-col gap-2 md:w-[300px]">
                  <MenuListItem href="/requests/new" title="Новый запрос">
                    Ввести данные нового запроса
                  </MenuListItem>
                  <MenuListItem href="/requests" title="Все запросы">
                    Просмотреть все запросы которые вам доступны
                  </MenuListItem>
                  <MenuListItem
                    href="/requests/completed"
                    title="Завершенные запросы"
                  >
                    Просмотреть все завершенные запросы которые вам доступны
                  </MenuListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <RequestsFilter />
      </div>
      {user.role === Role.ADMIN && (
        <Link
          href="/admin"
          className={buttonVariants({ variant: 'destructive' })}
        >
          Админка
        </Link>
      )}
      <UserInfoSmall />
    </div>
  )
}

export default Header

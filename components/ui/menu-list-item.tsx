import Link from 'next/link'
import React from 'react'

import {
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const MenuListItem = React.forwardRef<
    React.ElementRef<typeof Link>,
    React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <Link
                ref={ref}
                className={cn(navigationMenuTriggerStyle(), className)}
                legacyBehavior
                passHref
                {...props}
            >
                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </NavigationMenuLink>
            </Link>
        </li>
    )
})
MenuListItem.displayName = 'MenuListItem'
export default MenuListItem

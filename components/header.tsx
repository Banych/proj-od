import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
    return (
        <div className="container flex items-center gap-7 p-4">
            <Link href="/">
                <h1>
                    <Image
                        src="/logo.png"
                        alt="Мултон Патнерс"
                        width={200}
                        height={80}
                    />
                </h1>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/requests/new" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                New Request
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default Header

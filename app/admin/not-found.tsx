import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const NotFoundPage = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mt-4 text-lg">Страница не найдена</p>
            <p className="mt-2 text-gray-500">
                Извините, но запрашиваемая страница не существует или была
                удалена. Возможно, у вас нет доступа к этой странице.
            </p>
            <Link href="/" className={buttonVariants({ variant: 'outline' })}>
                Вернуться на главную
            </Link>
        </div>
    )
}

export default NotFoundPage

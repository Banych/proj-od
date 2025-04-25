'use client'

import { useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import InputWithLabel from '@/components/ui/input-with-label'
import { Button } from '@/components/ui/button'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const formSubmitted = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault()
            setLoading(true)

            try {
                const response = await signIn('credentials', {
                    username,
                    password,
                    redirect: false,
                })

                if (response?.error) {
                    console.error('Sign in error:', response.error)
                    setError(response.error)
                    setLoading(false)
                } else if (response?.ok && response?.url) {
                    const oldUrl = new URL(response.url)
                    const callbackUrl = oldUrl.searchParams.get('callbackUrl')
                    if (callbackUrl) {
                        router.push(callbackUrl)
                    } else {
                        router.push('/')
                    }
                    setLoading(false)
                }
            } catch (error: unknown) {
                console.error('Sign in error:', error)
                setError('An unexpected error occurred')
                setLoading(false)
            }
        },
        [username, password, router]
    )

    return (
        <div className="flex grow items-center justify-center">
            <div className="flex min-w-[300px] flex-col rounded bg-white p-4 shadow-md">
                <h1 className="mb-3 text-2xl font-bold">Авторизация</h1>
                <form className="flex flex-col gap-3" onSubmit={formSubmitted}>
                    <InputWithLabel
                        label="Имя пользователя"
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                    <InputWithLabel
                        label="Пароль"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex items-center justify-between gap-2">
                        <Button variant="link" asChild>
                            <Link href="/auth/register">Регистрация</Link>
                        </Button>
                        <Button type="submit" disabled={loading}>
                            Войти
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage

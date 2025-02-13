'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import InputWithLabel from '@/components/ui/input-with-label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const formSubmitted = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault()
            setLoading(true)

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                })

                const data = await response.json()

                if (!response.ok) {
                    setError(data.message || 'An unexpected error occurred')
                    setLoading(false)
                } else {
                    setSuccess('User registered successfully')
                    setLoading(false)
                    router.push('/auth/login')
                }
            } catch (error: unknown) {
                console.error('Registration error:', error)
                setError('An unexpected error occurred')
                setLoading(false)
            }
        },
        [username, password, router]
    )

    return (
        <div className="flex grow items-center justify-center">
            <div className="flex min-w-[300px] flex-col rounded bg-white p-4 shadow-md">
                <h1 className="mb-3 text-2xl font-bold">Регистрация</h1>
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
                    {success && <p className="text-green-500">{success}</p>}
                    <div className="flex items-center justify-between gap-2">
                        <Button variant="link" asChild>
                            <Link href="/auth/login">Войти</Link>
                        </Button>
                        <Button type="submit" disabled={loading}>
                            Зарегистрироваться
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage

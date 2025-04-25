'use client'

import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { UserDTO } from '@/types/dtos'

type ProfileFormProps = {
    user: UserDTO
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
    const [name, setName] = useState(user.name)
    const [surname, setSurname] = useState(user.surname)
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { refresh } = useRouter()

    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value)
        },
        []
    )

    const handleSurnameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSurname(e.target.value)
        },
        []
    )

    const handleUsernameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value)
        },
        []
    )

    const handleEmailChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
        },
        []
    )

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            setIsSubmitting(true)

            try {
                const response = await fetch('/api/profile/' + user.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        surname,
                        username,
                        email,
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to update user')
                }

                refresh()
            } catch (error: unknown) {
                console.error(error)
            } finally {
                setIsSubmitting(false)
            }
        },
        [email, name, refresh, surname, user.id, username]
    )

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <InputWithLabel
                label="Имя"
                value={name || ''}
                onChange={handleNameChange}
            />
            <InputWithLabel
                label="Фамилия"
                value={surname || ''}
                onChange={handleSurnameChange}
            />
            <InputWithLabel
                label="Логин"
                value={username}
                onChange={handleUsernameChange}
            />
            <InputWithLabel
                label="Почта"
                value={email || ''}
                type="email"
                onChange={handleEmailChange}
            />
            <Button type="submit" loading={isSubmitting}>
                Сохранить
            </Button>
        </form>
    )
}

export default ProfileForm

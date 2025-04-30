'use client'

import axios from 'axios'
import { useRouter } from 'nextjs-toploader/app'
import { FC, useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { useToast } from '@/hooks/use-toast'
import { UserDTO } from '@/types/dtos'
import { useMutation } from '@tanstack/react-query'

type ProfileFormProps = {
  user: UserDTO
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const [name, setName] = useState(user.name)
  const [surname, setSurname] = useState(user.surname)
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)

  const { refresh } = useRouter()
  const { toast } = useToast()

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

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationKey: ['updateProfile'],
      mutationFn: async () => {
        return axios.put('/api/profile/' + user.id, {
          name,
          surname,
          username,
          email,
        })
      },
      onSuccess: () => {
        refresh()
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Ошибка обновления профиля',
          description: (error as Error).message,
        })
      },
    })

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!name || !surname || !username || !email) {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Заполните все поля',
        })
        return
      }

      updateProfile()
    },
    [email, name, surname, toast, updateProfile, username]
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
      <Button type="submit" loading={isUpdateProfilePending}>
        Сохранить
      </Button>
    </form>
  )
}

export default ProfileForm

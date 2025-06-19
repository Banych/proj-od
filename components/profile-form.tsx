'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'nextjs-toploader/app'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { useToast } from '@/hooks/use-toast'
import {
  ProfileFormData,
  profileFormValidator,
} from '@/lib/validators/profile-form.validator'
import { UserDTO } from '@/types/dtos'
import { useMutation } from '@tanstack/react-query'

type ProfileFormProps = {
  user: UserDTO
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const { refresh } = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormValidator),
    defaultValues: {
      name: user.name || '',
      surname: user.surname || '',
      username: user.username || '',
      email: user.email || '',
      rfRu: user.rfRu || '',
    },
  })

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationKey: ['updateProfile'],
      mutationFn: async (data: ProfileFormData) => {
        return axios.put('/api/profile/' + user.id, data)
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

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <InputWithLabel
        label="Имя"
        {...register('name')}
        error={errors.name?.message}
        disabled={isUpdateProfilePending || isSubmitting}
      />
      <InputWithLabel
        label="Фамилия"
        {...register('surname')}
        error={errors.surname?.message}
        disabled={isUpdateProfilePending || isSubmitting}
      />
      <InputWithLabel
        label="Логин"
        {...register('username')}
        error={errors.username?.message}
        disabled={isUpdateProfilePending || isSubmitting}
      />
      <InputWithLabel
        label="Почта"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={isUpdateProfilePending || isSubmitting}
      />
      <InputWithLabel
        label="RF/RU"
        {...register('rfRu')}
        maxLength={24}
        placeholder="Введите RF/RU код (до 24 символов)"
        error={errors.rfRu?.message}
        disabled={isUpdateProfilePending || isSubmitting}
      />
      <Button type="submit" loading={isUpdateProfilePending || isSubmitting}>
        Сохранить
      </Button>
    </form>
  )
}

export default ProfileForm

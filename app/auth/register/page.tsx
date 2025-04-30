'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button, buttonVariants } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { useToast } from '@/hooks/use-toast'
import {
  registerFormValidator,
  RegisterFormValidatorType,
} from '@/lib/validators/register-form.validator'

const RegisterPage = () => {
  const { push } = useRouter()
  const { toast } = useToast()

  const { control, handleSubmit } = useForm<RegisterFormValidatorType>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(registerFormValidator),
  })

  const { mutate: register, isPending: isRegisterPending } = useMutation({
    mutationKey: ['register'],
    mutationFn: async (value: RegisterFormValidatorType) => {
      const { data } = await axios.post('/api/auth/register', {
        username: value.username,
        password: value.password,
      })

      return data
    },
    onSuccess: () => {
      toast({
        title: 'Успех',
        description: 'Пользователь успешно зарегистрирован',
        variant: 'default',
      })
      push('/auth/login')
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration error:', error)
      }
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const formSubmitted = useCallback(
    (value: RegisterFormValidatorType) => {
      register(value)
    },
    [register]
  )

  return (
    <div className="flex grow items-center justify-center">
      <div className="flex min-w-[300px] flex-col rounded bg-white p-4 shadow-md">
        <h1 className="mb-3 text-2xl font-bold">Регистрация</h1>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(formSubmitted)}
        >
          <Controller
            name="username"
            control={control}
            disabled={isRegisterPending}
            render={({
              field: { onChange, ...field },
              fieldState: { invalid, error },
            }) => (
              <InputWithLabel
                label="Логин"
                id="username"
                type="text"
                invalid={invalid}
                error={error?.message}
                onChange={(event) => {
                  onChange(event.target.value)
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            disabled={isRegisterPending}
            render={({
              field: { onChange, ...field },
              fieldState: { invalid, error },
            }) => (
              <InputWithLabel
                label="Пароль"
                id="password"
                type="password"
                invalid={invalid}
                error={error?.message}
                onChange={(event) => {
                  onChange(event.target.value)
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            disabled={isRegisterPending}
            render={({
              field: { onChange, ...field },
              fieldState: { invalid, error },
            }) => (
              <InputWithLabel
                label="Подтверждение пароля"
                id="confirmPassword"
                type="password"
                invalid={invalid}
                error={error?.message}
                onChange={(event) => {
                  onChange(event.target.value)
                }}
                {...field}
              />
            )}
          />

          <div className="flex items-center justify-between gap-2">
            <Link
              className={buttonVariants({ variant: 'link' })}
              href="/auth/login"
            >
              Войти
            </Link>
            <Button type="submit" loading={isRegisterPending}>
              Зарегистрироваться
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage

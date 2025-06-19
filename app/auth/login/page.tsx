'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useCallback } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import InputWithLabel from '@/components/ui/input-with-label'
import { useToast } from '@/hooks/use-toast'
import {
  loginFormValidator,
  LoginFormValidatorType,
} from '@/lib/validators/login-form.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

const LoginPage = () => {
  const { toast } = useToast()

  const { control, handleSubmit } = useForm<LoginFormValidatorType>({
    defaultValues: {
      password: '',
      username: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginFormValidator),
  })

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (value: LoginFormValidatorType) => {
      const response = await signIn('credentials', {
        username: value.username,
        password: value.password,
        redirect: false,
      })

      if (!response) {
        throw new Error('No response from server')
      }

      if (response.error) {
        throw new Error(response.error)
      }

      if (!response.ok) {
        throw new Error('Login failed')
      }

      return response
    },
    onSuccess: (response) => {
      toast({
        title: 'Успех',
        description: 'Пользователь успешно авторизован',
        variant: 'default',
      })
      if (response.url) {
        const oldUrl = new URL(response.url)
        const callbackUrl = oldUrl.searchParams.get('callbackUrl')
        if (callbackUrl) {
          window.location.href = callbackUrl
        } else {
          window.location.href = '/'
        }
      }
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Login error:', error)
      }
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const formSubmitted = useCallback(
    (value: LoginFormValidatorType) => {
      login(value)
    },
    [login]
  )

  return (
    <div className="flex grow items-center justify-center">
      <div className="flex min-w-[300px] flex-col rounded bg-white p-4 shadow-md">
        <h1 className="mb-3 text-2xl font-bold">Авторизация</h1>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(formSubmitted)}
        >
          <Controller
            name="username"
            control={control}
            disabled={isLoginPending}
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
            disabled={isLoginPending}
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
          <div className="flex items-center justify-between gap-2">
            <Link
              className={buttonVariants({ variant: 'link' })}
              href="/auth/register"
            >
              Регистрация
            </Link>
            <Button type="submit" loading={isLoginPending}>
              Войти
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

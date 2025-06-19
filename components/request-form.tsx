'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ClassValue } from 'clsx'
import { useRouter } from 'nextjs-toploader/app'
import { FC, useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import defaultRequestTypes from '@/constants/default-request-types'
import salesOrganizations from '@/constants/default-sales-organizations'
import {
  Request,
  RequestType,
  SalesOrganizationType,
} from '@/generated/prisma-client'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { requestFormValidator } from '@/lib/validators/request-form.validator'
import { CreateRequestDTO } from '@/types/dtos'

type RequestFormProps = {
  className?: ClassValue
  onFormSubmit?: (value: CreateRequestDTO) => Promise<Request>
  initialValues?: Partial<CreateRequestDTO>
  submitButtonText?: string
}

const RequestForm: FC<RequestFormProps> = ({
  className,
  initialValues,
  onFormSubmit,
  submitButtonText = 'Отправить',
}) => {
  const { toast } = useToast()
  const { push } = useRouter()

  const { control, handleSubmit, watch } = useForm<CreateRequestDTO>({
    defaultValues: {
      type: initialValues?.type || RequestType.ONE_DAY_DELIVERY,
      salesOrganization:
        initialValues?.salesOrganization || SalesOrganizationType.SALES_3803,
      warehouse: initialValues?.warehouse || '',
      date: initialValues?.date || new Date(),
      comment: initialValues?.comment || '',
      resource: initialValues?.resource || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(requestFormValidator),
  })

  const watchedType = watch('type')
  const { mutate, isPending } = useMutation({
    mutationKey: ['createRequest'],
    mutationFn: async (value: CreateRequestDTO) => {
      if (onFormSubmit) {
        return onFormSubmit(value)
      }

      const { data } = await axios.post<Request>('/api/requests', value, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return data
    },
    onSuccess: async (response) => {
      if (response) {
        toast({
          variant: 'default',
          title: 'Запрос успешно отправлен',
        })
        const orderNumber = response.orderNumber

        push(`/requests/${orderNumber}`)
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка отправки запроса',
        })
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка отправки запроса',
      })
    },
  })

  const isResourceShown = useMemo(
    () => watchedType === RequestType.ONE_DAY_DELIVERY,
    [watchedType]
  )
  const onSubmit = useCallback(
    (data: CreateRequestDTO) => {
      mutate(data)
    },
    [mutate]
  )
  return (
    <form
      className={cn('flex grow flex-col gap-4', className)}
      onSubmit={
        handleSubmit(onSubmit) as React.FormEventHandler<HTMLFormElement>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <Controller
              name="type"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className={error ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultRequestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Controller
              name="salesOrganization"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className={error ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Выберите организацию" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesOrganizations.map((salesOrganization) => (
                        <SelectItem
                          key={salesOrganization.value}
                          value={salesOrganization.value}
                        >
                          {salesOrganization.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Controller
              name="warehouse"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Input
                    value={value}
                    onChange={onChange}
                    placeholder="Введите номер склада"
                    disabled={isPending}
                    className={error ? 'border-red-500' : ''}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              name="date"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <DatePicker
                    date={value}
                    onSelect={onChange}
                    isDisabled={isPending}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
        </div>
        <div className="flex grow items-start gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <Controller
              name="comment"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Textarea
                    placeholder="Введите комментарий"
                    value={value}
                    onChange={onChange}
                    className={cn(
                      'h-full max-h-48',
                      error ? 'border-red-500' : ''
                    )}
                    disabled={isPending}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          {isResourceShown && (
            <div className="flex flex-col gap-1 w-[200px]">
              <Controller
                name="resource"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <Input
                      value={value || ''}
                      onChange={onChange}
                      placeholder="Введите ресурс"
                      disabled={isPending}
                      className={error ? 'border-red-500' : ''}
                    />
                    {error && (
                      <span className="text-red-500 text-sm">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  )
}

export default RequestForm

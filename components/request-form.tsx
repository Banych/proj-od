'use client'

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
import defaultPriorities from '@/constants/default-priorities'
import defaultRequestTypes from '@/constants/default-request-types'
import salesOrganizations from '@/constants/default-sales-organizations'
import {
  Request,
  RequestType,
  SalesOrganizationType,
} from '@/generated/prisma-client'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  requestFormValidator,
  RequestFormValidatorType,
} from '@/lib/validators/request-form.validator'
import { CreateRequestDTO, CreateRequestFormDTO } from '@/types/dtos'
import { zodResolver } from '@hookform/resolvers/zod'
import RequestFormODNumber from './request-form-od-number'

type RequestFormProps = {
  className?: ClassValue
  onFormSubmit?: (value: CreateRequestDTO) => Promise<Request>
  initialValues?: Partial<CreateRequestFormDTO>
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

  const { control, handleSubmit, watch } = useForm<RequestFormValidatorType>({
    defaultValues: {
      type: initialValues?.type || RequestType.ONE_DAY_DELIVERY,
      salesOrganization:
        initialValues?.salesOrganization || SalesOrganizationType.SALES_3801,
      priority: initialValues?.priority || null,
      warehouse: initialValues?.warehouse || '',
      date: initialValues?.date || new Date(),
      comment: initialValues?.comment || '',
      resource: initialValues?.resource || '',
      odNumber: initialValues?.odNumber || [{ name: '' }],
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(requestFormValidator),
  })

  const watchedType = watch('type')

  const { mutate, isPending } = useMutation({
    mutationKey: ['createRequest'],
    mutationFn: async (value: RequestFormValidatorType) => {
      // Transform form data to API data
      const apiData: CreateRequestDTO = {
        type: value.type!,
        salesOrganization: value.salesOrganization!,
        priority: value.priority || null,
        warehouse: value.warehouse,
        date: value.date,
        comment: value.comment,
        resource: value.resource,
        odNumber: value.odNumber
          .map((od) => od.name.trim()) // Trim each OD number
          .filter((od) => od !== '')
          .join('|'), // Join with | separator
      }

      if (onFormSubmit) {
        return onFormSubmit(apiData)
      }

      const { data } = await axios.post<Request>('/api/requests', apiData, {
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
    (data: RequestFormValidatorType) => {
      mutate(data)
    },
    [mutate]
  )

  return (
    <form
      className={cn('flex grow flex-col gap-4', className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center gap-2">
        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col gap-1 flex-1">
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
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </div>
          )}
        />
        <Controller
          name="salesOrganization"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col gap-1 flex-1">
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
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </div>
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col gap-1 flex-1">
              <Select
                value={value || ''}
                onValueChange={(val) => onChange(val || null)}
                disabled={isPending}
              >
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Не выбран</SelectItem>
                  {defaultPriorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && (
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </div>
          )}
        />
        <Controller
          name="warehouse"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col gap-1 flex-1">
              <Input
                value={value}
                onChange={onChange}
                placeholder="Введите номер склада"
                disabled={isPending}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </div>
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col gap-1">
              <DatePicker date={value} onSelect={onChange} />
              {error && (
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </div>
          )}
        />
      </div>
      <RequestFormODNumber control={control} isPending={isPending} />

      <div className="flex grow items-start gap-2">
        <Controller
          name="comment"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="flex flex-col gap-1 flex-1">
              <Textarea
                placeholder="Введите комментарий"
                value={value}
                onChange={onChange}
                className={cn('h-full max-h-48', error ? 'border-red-500' : '')}
                disabled={isPending}
              />
              {error && (
                <span className="text-red-500 text-sm">{error.message}</span>
              )}
            </div>
          )}
        />
        {isResourceShown && (
          <Controller
            name="resource"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex flex-col gap-1 w-[200px]">
                <Input
                  value={value || ''}
                  className={error ? 'border-red-500' : ''}
                  onChange={onChange}
                  placeholder="Введите ресурс"
                  disabled={isPending}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />
        )}
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

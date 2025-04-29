'use client'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ClassValue } from 'clsx'
import { useRouter } from 'nextjs-toploader/app'
import { FC, useCallback, useMemo, useState } from 'react'

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
import { CreateRequestDTO } from '@/types/dtos'

type RequestFormProps = {
    className?: ClassValue
    onFormSubmit?: (value: CreateRequestDTO) => Promise<Request>
    initialValues?: CreateRequestDTO
    submitButtonText?: string
}

const RequestForm: FC<RequestFormProps> = ({
    className,
    initialValues,
    onFormSubmit,
    submitButtonText = 'Отправить',
}) => {
    const [requestType, setRequestType] = useState<RequestType | undefined>(
        initialValues?.type
    )
    const [salesOrganization, setSalesOrganization] = useState<
        SalesOrganizationType | undefined
    >(initialValues?.salesOrganization)
    const [warehouse, setWarehouse] = useState<string>(
        initialValues?.warehouse || ''
    )
    const [date, setDate] = useState<Date>(
        initialValues?.date ? initialValues.date : new Date()
    )
    const [comment, setComment] = useState<string>(initialValues?.comment || '')
    const [resource, setResource] = useState<string>(
        initialValues?.resource || ''
    )

    const { toast } = useToast()
    const { push } = useRouter()

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
                const id = response.id

                push(`/requests/${id}`)
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
        () => requestType === RequestType.ONE_DAY_DELIVERY,
        [requestType]
    )

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()

            if (!requestType) {
                toast({
                    variant: 'destructive',
                    title: 'Выберите тип запроса',
                })
                return
            }

            if (!salesOrganization) {
                toast({
                    variant: 'destructive',
                    title: 'Выберите организацию',
                })
                return
            }

            if (!warehouse) {
                toast({
                    variant: 'destructive',
                    title: 'Введите номер склада',
                })
                return
            }

            if (!comment) {
                toast({
                    variant: 'destructive',
                    title: 'Введите комментарий',
                })
                return
            }

            const data: CreateRequestDTO = {
                type: requestType,
                salesOrganization,
                warehouse,
                date: date,
                comment,
                resource,
            }

            mutate(data)
        },
        [
            comment,
            date,
            mutate,
            requestType,
            resource,
            salesOrganization,
            toast,
            warehouse,
        ]
    )

    const handleRequestTypeChange = useCallback((value: RequestType) => {
        setRequestType(value)
    }, [])

    const handleSalesOrganizationChange = useCallback(
        (value: SalesOrganizationType) => {
            setSalesOrganization(value)
        },
        []
    )

    const handleWarehouseChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setWarehouse(e.target.value)
        },
        []
    )

    const handleCommentChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setComment(e.target.value)
        },
        []
    )

    const handleResourceChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setResource(e.target.value)
        },
        []
    )

    return (
        <form
            className={cn('flex grow flex-col gap-4', className)}
            onSubmit={handleSubmit}
        >
            <div className="flex items-center gap-2">
                <Select
                    value={requestType}
                    onValueChange={handleRequestTypeChange}
                    disabled={isPending}
                >
                    <SelectTrigger>
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
                <Select
                    value={salesOrganization}
                    onValueChange={handleSalesOrganizationChange}
                    disabled={isPending}
                >
                    <SelectTrigger>
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
                <Input
                    value={warehouse}
                    onChange={handleWarehouseChange}
                    placeholder="Введите номер склад"
                    disabled={isPending}
                />
                <DatePicker date={date} onSelect={setDate} />
            </div>
            <div className="flex grow items-start gap-2">
                <Textarea
                    placeholder="Введите комментарий"
                    value={comment}
                    onChange={handleCommentChange}
                    className="h-full max-h-48"
                    disabled={isPending}
                />
                {isResourceShown && (
                    <Input
                        value={resource}
                        className="w-[200px]"
                        onChange={handleResourceChange}
                        placeholder="Введите ресурс"
                        disabled={isPending}
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

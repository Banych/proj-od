'use client'

import { useCallback, useMemo, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    CreateRequestDTO,
    RequestTypeDTO,
    SalesOrganizationTypeDTO,
} from '@/types/dtos'
import defaultRequestTypes from '@/constants/default-request-types'
import salesOrganizations from '@/constants/default-sales-organizations'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const RequestForm = () => {
    const [requestType, setRequestType] = useState<RequestTypeDTO | undefined>()
    const [salesOrganization, setSalesOrganization] = useState<
        SalesOrganizationTypeDTO | undefined
    >()
    const [warehouse, setWarehouse] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [comment, setComment] = useState<string>('')
    const [resource, setResource] = useState<string>('')

    const { toast } = useToast()
    const { push } = useRouter()

    const isResourceShown = useMemo(
        () => requestType === 'OneDayDelivery',
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
                date: date.toLocaleDateString(),
                comment,
                resource,
            }

            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast({
                    variant: 'default',
                    title: 'Запрос успешно отправлен',
                })
                const id = (await response.json()).id
                push('/requests/' + id)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка отправки запроса',
                })
            }
        },
        [
            comment,
            date,
            push,
            requestType,
            resource,
            salesOrganization,
            toast,
            warehouse,
        ]
    )

    const handleRequestTypeChange = useCallback((value: RequestTypeDTO) => {
        setRequestType(value)
    }, [])

    const handleSalesOrganizationChange = useCallback(
        (value: SalesOrganizationTypeDTO) => {
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
        <form className="flex grow flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
                <Select
                    value={requestType}
                    onValueChange={handleRequestTypeChange}
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
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите организацию" />
                    </SelectTrigger>
                    <SelectContent>
                        {salesOrganizations.map((salesOrganization) => (
                            <SelectItem
                                key={salesOrganization}
                                value={salesOrganization}
                            >
                                {salesOrganization}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    value={warehouse}
                    onChange={handleWarehouseChange}
                    placeholder="Введите номер склад"
                />
                <DatePicker date={date} onSelect={setDate} />
            </div>
            <div className="flex grow items-start gap-2">
                <Textarea
                    placeholder="Введите комментарий"
                    value={comment}
                    onChange={handleCommentChange}
                    className="h-full max-h-48"
                />
                {isResourceShown && (
                    <Input
                        value={resource}
                        className="w-[200px]"
                        onChange={handleResourceChange}
                        placeholder="Введите ресурс"
                    />
                )}
            </div>
            <div className="flex justify-end">
                <Button type="submit">Отправить</Button>
            </div>
        </form>
    )
}

export default RequestForm

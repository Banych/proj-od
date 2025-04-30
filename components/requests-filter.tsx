'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Filter } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import defaultRequestTypes from '@/constants/default-request-types'
import salesOrganizations from '@/constants/default-sales-organizations'
import { RequestType, SalesOrganizationType } from '@/generated/prisma-client'
import useRequestFilters from '@/hooks/use-request-filters'
import {
  RequestFiltersType,
  requestFiltersValidator,
} from '@/lib/validators/request-filters-validator'

const RequestsFilter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { filters, setFilters, resetFilters } = useRequestFilters()
  const {
    control,
    reset,
    handleSubmit: handleFormSubmit,
    formState,
  } = useForm<RequestFiltersType>({
    defaultValues: {
      orderNumber: filters.orderNumber,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      type: filters.type,
      salesOrganization: filters.salesOrganization,
      warehouse: filters.warehouse,
    },
    resolver: zodResolver(requestFiltersValidator),
  })

  const handleSubmit = useCallback(
    (value: RequestFiltersType) => {
      setFilters(value)
      setIsOpen(false)
    },
    [setFilters]
  )

  const handleReset = useCallback(() => {
    resetFilters()
    reset()
    setIsOpen(false)
  }, [reset, resetFilters])

  if (
    (!pathname.startsWith('/requests') || pathname.match(/\/requests\/\d+/)) &&
    pathname !== '/'
  ) {
    return null
  }

  const isDirtyForm = formState.isDirty

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="size-4 mr-1" />
          Фильтры
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
          <SheetDescription>
            Здесь вы можете настроить фильтры для отображения заявок.
          </SheetDescription>
        </SheetHeader>
        <div className="grow">
          <form
            className="grid grid-cols-1 grid-rows-6 gap-3"
            onSubmit={handleFormSubmit(handleSubmit)}
            id="filter-form"
          >
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="orderNumber">Номер заказа</label>
              <Controller
                control={control}
                name="orderNumber"
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    className="col-span-3 col-start-3"
                    type="text"
                    id="orderNumber"
                    placeholder="Введите номер заказа"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="dateFrom">Дата с</label>
              <Controller
                control={control}
                name="dateFrom"
                render={({ field: { onChange, ...field } }) => (
                  <DatePicker
                    className="col-span-3 col-start-3"
                    date={field.value || undefined}
                    onSelect={(e) => onChange(e)}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="dateTo">Дата по</label>
              <Controller
                control={control}
                name="dateTo"
                render={({ field: { onChange, ...field } }) => (
                  <DatePicker
                    className="col-span-3 col-start-3"
                    date={field.value || undefined}
                    onSelect={(e) => onChange(e)}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="type">Тип</label>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, ...field } }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(e) => onChange(e as RequestType)}
                  >
                    <SelectTrigger className="col-span-3 col-start-3 justify-start">
                      <SelectValue placeholder="Выберите тип..." />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultRequestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="salesOrganization">Организация</label>
              <Controller
                control={control}
                name="salesOrganization"
                render={({ field: { onChange, ...field } }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(e) => onChange(e as SalesOrganizationType)}
                  >
                    <SelectTrigger className="col-span-3 col-start-3">
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
                )}
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="warehouse">Склад</label>
              <Controller
                control={control}
                name="warehouse"
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    className="col-span-3 col-start-3"
                    type="text"
                    id="warehouse"
                    placeholder="Введите номер склада"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    {...field}
                  />
                )}
              />
            </div>
          </form>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>

          <Button type="submit" form="filter-form" disabled={!isDirtyForm}>
            Применить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default RequestsFilter

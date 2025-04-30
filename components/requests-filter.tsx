'use client'

import { RequestFilters } from '@/components/providers/filters-provider'
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
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'

const RequestsFilter = () => {
  const pathname = usePathname()
  const { filters, setFilters, resetFilters } = useRequestFilters()
  const [newFilters, setNewFilters] = useState<Partial<RequestFilters>>(() => {
    return {
      orderNumber: filters.orderNumber,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      type: filters.type,
      salesOrganization: filters.salesOrganization,
      warehouse: filters.warehouse,
    }
  })

  const handleSubmit = useCallback(() => {
    setFilters(newFilters)
  }, [newFilters, setFilters])

  const handleReset = useCallback(() => {
    resetFilters()
    setNewFilters({
      orderNumber: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      type: undefined,
      salesOrganization: undefined,
      warehouse: undefined,
    })
  }, [resetFilters])

  if (
    (!pathname.startsWith('/requests') ||
      pathname.match(/\/requests[/\\][a-zA-Z0-9]{25,}/)) &&
    pathname !== '/'
  ) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Фильтры</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
          <SheetDescription>
            Здесь вы можете настроить фильтры для отображения заявок.
          </SheetDescription>
        </SheetHeader>
        <div className="grow">
          <div className="grid grid-cols-1 grid-rows-6 gap-3">
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="orderNumber">Номер заказа</label>
              <Input
                className="col-span-3 col-start-3"
                type="text"
                id="orderNumber"
                value={newFilters.orderNumber}
                onChange={(e) =>
                  setNewFilters({
                    ...newFilters,
                    orderNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="dateFrom">Дата с</label>
              <DatePicker
                className="col-span-3 col-start-3"
                date={newFilters.dateFrom}
                onSelect={(e) =>
                  setNewFilters({
                    ...newFilters,
                    dateFrom: e,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="dateTo">Дата по</label>
              <DatePicker
                className="col-span-3 col-start-3"
                date={newFilters.dateTo}
                onSelect={(e) =>
                  setNewFilters({
                    ...newFilters,
                    dateTo: e,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="type">Тип</label>
              <Select
                value={newFilters.type}
                onValueChange={(e) =>
                  setNewFilters({
                    ...newFilters,
                    type: e as RequestType,
                  })
                }
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
            </div>

            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="salesOrganization">Организация</label>
              <Select
                value={newFilters.salesOrganization}
                onValueChange={(e) =>
                  setNewFilters({
                    ...newFilters,
                    salesOrganization: e as SalesOrganizationType,
                  })
                }
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
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-2">
              <label htmlFor="warehouse">Склад</label>
              <Input
                className="col-span-3 col-start-3"
                value={newFilters.warehouse}
                onChange={(e) =>
                  setNewFilters({
                    ...newFilters,
                    warehouse: e.target.value,
                  })
                }
                placeholder="Введите номер склад"
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={handleReset}>
              Сбросить
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button type="submit" onClick={handleSubmit}>
              Применить
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default RequestsFilter

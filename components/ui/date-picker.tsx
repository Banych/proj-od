'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { FC, useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type DatePickerProps = {
  date: Date | undefined
  onSelect: (date: Date) => void
  className?: string
  isDisabled?: boolean
}

export const DatePicker: FC<DatePickerProps> = ({
  date,
  onSelect,
  className,
  isDisabled = false,
}) => {
  const [open, setOpen] = useState(false)

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date && onSelect) {
        onSelect(date)
        setOpen(false)
      }
    },
    [onSelect]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={isDisabled}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, 'PPP') : <span>Выберите дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}

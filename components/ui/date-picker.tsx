'use client'

import { FC, useCallback, useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

export type DatePickerProps = {
    date: Date
    onSelect: (date: Date) => void
}

export const DatePicker: FC<DatePickerProps> = ({ date, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleDateSelect = useCallback(
        (date: Date | undefined) => {
            if (date && onSelect) {
                onSelect(date)
            }
            setIsOpen(false)
        },
        [onSelect]
    )

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

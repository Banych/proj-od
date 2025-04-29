'use client'

import useTimezone from '@/hooks/use-timezone'
import { FC } from 'react'
import { toZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'

type FormattedDateProps = {
    date: Date
    formatString?: string
}

const FormattedDate: FC<FormattedDateProps> = ({
    date,
    formatString = 'dd.MM.yyyy HH:mm',
}) => {
    const { timezone } = useTimezone()
    const timezonedDate = toZonedTime(date, timezone)
    const formattedDate = format(timezonedDate, formatString)
    return formattedDate
}

export default FormattedDate

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { FC, PropsWithChildren, useCallback, useMemo } from 'react'

type TableHeaderCellProps = PropsWithChildren & {
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
    value: string
    className?: ClassValue
}

const TableHeaderCell: FC<TableHeaderCellProps> = ({
    sortBy,
    sortOrder,
    onSort,
    value,
    className,
    children,
}) => {
    const icon = useMemo(() => {
        if (sortBy !== value) {
            return <ChevronsUpDown className="size-4 text-gray-700" />
        }

        return sortOrder === 'asc' ? (
            <ChevronUp className="size-4 text-gray-700" />
        ) : (
            <ChevronDown className="size-4 text-gray-700" />
        )
    }, [sortBy, sortOrder, value])

    const handleSort = useCallback(() => {
        if (!onSort) {
            return
        }

        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        onSort(value, newSortOrder)
    }, [onSort, sortOrder, value])

    if (!sortBy || !onSort) {
        return (
            <div className={cn('flex items-center gap-1 font-bold', className)}>
                {children}
            </div>
        )
    }

    return (
        <Button
            variant="link"
            className={cn('flex items-center gap-1 font-bold', className)}
            onClick={handleSort}
        >
            {children}
            {icon}
        </Button>
    )
}

export default TableHeaderCell

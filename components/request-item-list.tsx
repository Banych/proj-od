'use client'

import { Button } from '@/components/ui/button'
import { RequestDTO } from '@/types/dtos'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, Fragment, useCallback } from 'react'

type RequestItemProps = {
    item: RequestDTO
}

const RequestItemList: FC<RequestItemProps> = ({ item }) => {
    const { push } = useRouter()

    const handleDelete = useCallback(() => {
        fetch(`http://localhost:3000/api/requests/${item.id}`, {
            method: 'DELETE',
        })
    }, [item.id])

    const handleOpen = useCallback(() => {
        push(`/requests/${item.id}`)
    }, [item.id, push])

    return (
        <Fragment>
            <div>{item.date}</div>
            <div>{item.type}</div>
            <div>{item.salesOrganization}</div>
            <div>{item.warehouse}</div>
            <div>{item.resource}</div>
            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleOpen}>
                    Open
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                >
                    <Trash className="size-6" />
                </Button>
            </div>
        </Fragment>
    )
}

export default RequestItemList

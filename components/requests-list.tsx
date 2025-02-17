import { FC } from 'react'

import RequestListItem from '@/components/request-list-item'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import requestsClient from '@/lib/db-clients/requests.client'
import getSessionUser from '@/lib/get-session-user'
import { RequestDTO } from '@/types/dtos'

type RequestsListProps = {
    initialRequests?: RequestDTO[]
    forceUseInitialRequests?: boolean
}

const RequestsList: FC<RequestsListProps> = async ({
    initialRequests,
    forceUseInitialRequests,
}) => {
    const dbUser = await getSessionUser()

    if (!dbUser) {
        return null
    }

    const requests: RequestDTO[] = forceUseInitialRequests
        ? initialRequests || []
        : await requestsClient.getRequests({})

    if (!requests.length) {
        return <div className="text-2xl">No requests</div>
    }

    return (
        <ScrollArea>
            <div className="grid auto-rows-auto grid-cols-7 gap-2">
                <div className="font-bold">ID</div>
                <div className="font-bold">Date</div>
                <div className="font-bold">Type</div>
                <div className="font-bold">Sales Organization</div>
                <div className="font-bold">Warehouse</div>
                <div className="font-bold">Resource</div>
                <div className="font-bold">Actions</div>

                {requests.map((request) => (
                    <RequestListItem
                        key={request.id}
                        item={request}
                        user={dbUser}
                    />
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default RequestsList

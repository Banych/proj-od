import RequestItemList from '@/components/request-item-list'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import requestsClient from '@/lib/db-clients/requests.client'
import { RequestDTO } from '@/types/dtos'

const RequestsList = async () => {
    const requests: RequestDTO[] = await requestsClient.getRequests({})

    return (
        <ScrollArea>
            <div className="grid auto-rows-auto grid-cols-6 gap-2">
                <div className="font-bold">Date</div>
                <div className="font-bold">Type</div>
                <div className="font-bold">Sales Organization</div>
                <div className="font-bold">Warehouse</div>
                <div className="font-bold">Resource</div>
                <div className="font-bold">Actions</div>

                {requests.map((request) => (
                    <RequestItemList key={request.id} item={request} />
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default RequestsList

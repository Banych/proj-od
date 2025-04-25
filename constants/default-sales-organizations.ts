import { SalesOrganizationType } from '@/generated/prisma-client'

const salesOrganizations = Object.values(SalesOrganizationType).map(
    (value) => ({
        value,
        text: value.replace('SALES_', ''),
    })
)

export default salesOrganizations

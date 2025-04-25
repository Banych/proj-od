import { SalesOrganizationType } from '@/lib/generated/prisma'

const salesOrganizations = Object.values(SalesOrganizationType).map(
    (value) => ({
        value,
        text: value.replace('SALES_', ''),
    })
)

export default salesOrganizations

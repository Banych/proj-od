import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'
import { forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { defaultRoles } from '@/constants/default-roles'
import { Role } from '@/generated/prisma-client'
import { useToast } from '@/hooks/use-toast'
import { UserDTO } from '@/types/dtos'
import { Trash } from 'lucide-react'

type UserListItemProps = {
    user: UserDTO & {
        createdAt: Date
    }
    onUpdate?: (user: UserDTO) => Promise<void>
}

const UserListItem = forwardRef<HTMLDivElement, UserListItemProps>(
    ({ user, onUpdate }, ref) => {
        const { toast } = useToast()

        const { mutate: updateUserRole, isPending: isUserRolePending } =
            useMutation({
                mutationKey: ['update-user-role', user.id],
                mutationFn: async (role: Role) => {
                    return axios.put('/api/admin/users/' + user.id, {
                        role,
                    })
                },
                onSuccess: async () => {
                    await onUpdate?.(user)
                    toast({
                        title: 'Успех',
                        description: 'Роль пользователя обновлена',
                        variant: 'default',
                    })
                },
                onError: () => {
                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось обновить роль пользователя',
                        variant: 'destructive',
                    })
                },
            })

        const { mutate: removeUser, isPending: isRemoveUserPending } =
            useMutation({
                mutationKey: ['remove-user', user.id],
                mutationFn: async () => {
                    return axios.delete('/api/admin/users/' + user.id)
                },
                onSuccess: async () => {
                    await onUpdate?.(user)
                    toast({
                        title: 'Успех',
                        description: 'Пользователь удален',
                        variant: 'default',
                    })
                },
                onError: () => {
                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось удалить пользователя',
                        variant: 'destructive',
                    })
                },
            })

        return (
            <>
                <div className="flex items-center gap-2" ref={ref}>
                    {user.username}
                </div>
                <div className="flex items-center gap-2">{user.name}</div>
                <div className="flex items-center gap-2">{user.surname}</div>
                <div className="flex items-center gap-2">{user.email}</div>
                <Select
                    value={user.role}
                    onValueChange={updateUserRole}
                    disabled={isUserRolePending || isRemoveUserPending}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {defaultRoles.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.text}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                    {format(user.createdAt, 'dd.MM.yyyy HH:mm')}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="destructive"
                        size="icon"
                        disabled={isUserRolePending}
                        loading={isRemoveUserPending}
                        onClick={() => {
                            removeUser()
                        }}
                    >
                        <Trash className="size-4" />
                    </Button>
                </div>
            </>
        )
    }
)

UserListItem.displayName = 'UserListItem'

export default UserListItem

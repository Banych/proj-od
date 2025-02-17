import { UserDTO } from '@/types/dtos'

const API_URL = 'http://localhost:8000'

export default {
    getUserByUsername: async (username: string) => {
        const res = await fetch(`${API_URL}/users?username=${username}`, {
            method: 'GET',
            cache: 'no-cache',
        })
        if (!res.ok) {
            throw new Error('Failed to fetch user')
        }
        const users = await res.json()
        return users.length > 0 ? users[0] : null
    },
    getUser: async (id: string): Promise<UserDTO> => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'GET',
            cache: 'no-cache',
        })
        if (!res.ok) {
            throw new Error('Failed to fetch user')
        }
        return res.json()
    },
}

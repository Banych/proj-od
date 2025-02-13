const API_URL = 'http://localhost:8000'

export async function getUserByUsername(username: string) {
    const res = await fetch(`${API_URL}/users?username=${username}`)
    if (!res.ok) {
        throw new Error('Failed to fetch user')
    }
    const users = await res.json()
    return users.length > 0 ? users[0] : null
}

export default {
    getUserByUsername,
}

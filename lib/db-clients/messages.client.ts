export default {
    getMessages: async (params: Record<string, string>) => {
        const query = new URLSearchParams(params).toString()
        const response = await fetch(
            `http://localhost:8000/messages?${query}`,
            {
                method: 'GET',
            }
        )

        return response.json()
    },
}

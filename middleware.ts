import { withAuth } from 'next-auth/middleware'

export default withAuth({
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        authorized: ({ req, token }) => {
            // Allow access to the registration page without authentication
            if (req.nextUrl.pathname === '/auth/register') {
                return true
            }
            // Allow access if the user is authenticated
            return !!token
        },
    },
})

import { withAuth } from 'next-auth/middleware'

export default withAuth({
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },
    callbacks: {
        authorized: ({ req, token }) => {
            if (req.nextUrl.pathname === '/auth/register') {
                return true
            }
            return !!token
        },
    },
})

export const config = {
    matcher: [
        '/((?!^/_next/static|^/_next/image|^/favicon.ico).*)', // Exclude static assets and images
        '/api/(.*)', // Protect API routes
    ],
}

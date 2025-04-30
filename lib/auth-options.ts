import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

// Function to convert an object to URL-encoded form data
function toFormData(obj: { [key: string]: unknown }) {
  const formBody = []
  for (const property in obj) {
    const encodedKey = encodeURIComponent(property)
    const encodedValue = encodeURIComponent(String(obj[property]))
    formBody.push(`${encodedKey}=${encodedValue}`)
  }
  return formBody.join('&')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error('No credentials provided')
          return null
        }
        const data = {
          username: credentials.username,
          password: credentials.password,
        }
        const formData = toFormData(data)
        try {
          const res = await fetch(
            (process.env.NEXTAUTH_URL ??
              `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) +
              '/api/auth/login',
            {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          )

          const resData = await res.json()
          if (res.ok && resData && resData.user) {
            return resData.user
          } else {
            console.error('Authorization failed:', resData)
            return null
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.username
      }
      return token
    },
    async session({ session, token }) {
      session.user = token as typeof session.user
      return session
    },
  },
}

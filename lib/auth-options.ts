import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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
            return null
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error during authorization:', error)
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

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

// Demo users for authentication
const demoUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@aiagents.com',
    password: 'demo123'
  },
  {
    id: '2',
    name: 'System Administrator',
    email: 'admin@aiagents.com',
    password: 'admin123'
  },
  {
    id: '3',
    name: 'Kyle Mabbott',
    email: 'kyle@aiagents.com',
    password: 'kyle123'
  }
]

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = demoUsers.find(
          (user) => 
            user.email === credentials.email && 
            user.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
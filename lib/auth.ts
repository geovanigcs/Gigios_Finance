import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Credenciais inválidas")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          onboardingCompleted: user.onboardingCompleted
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        if (user) {
          session.user.id = user.id
          session.user.onboardingCompleted = user.onboardingCompleted
        } else if (token) {
          session.user.id = token.sub!
          session.user.onboardingCompleted = token.onboardingCompleted as boolean
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.onboardingCompleted = user.onboardingCompleted
      }
      return token
    }
  },
  pages: {
    signIn: "/",
    newUser: "/onboarding",
  },
  session: {
    strategy: "jwt",
  },
}

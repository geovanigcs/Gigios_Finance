import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      onboardingCompleted?: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    firstName?: string | null
    lastName?: string | null
    age?: number | null
    phone?: string | null
    address?: string | null
    onboardingCompleted: boolean
  }
}

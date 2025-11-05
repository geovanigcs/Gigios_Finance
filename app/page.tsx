"use client"

import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!session.user.onboardingCompleted) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, session, router])

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="flex items-center gap-2 text-3xl font-bold text-white">
          <Leaf className="h-8 w-8 text-blue-500" />
          <span>Gigio's Finance</span>
        </div>

        <div className="mt-12 max-w-md text-center">
          <h1 className="text-4xl font-bold tracking-tight">Bem-vindo</h1>
          <p className="mt-4 text-lg text-gray-400">
            A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas movimentações, e
            oferecer insights personalizados, facilitando o controle do seu orçamento.
          </p>
        </div>

        <div className="mt-8 w-full max-w-md">
          <Button onClick={handleGoogleSignIn} className="w-full bg-gray-800 hover:bg-gray-700">
            <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2" />
            Entrar com Google
          </Button>
        </div>
      </div>
    </div>
  )
}


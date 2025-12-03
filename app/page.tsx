"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Leaf } from "lucide-react"
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória")
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Email ou senha incorretos")
        return
      }

      // Salvar token
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
      }

      toast.success("Login realizado com sucesso!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Erro ao fazer login")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="flex items-center gap-2 text-3xl font-bold text-white mb-8">
          <Leaf className="h-8 w-8 text-blue-500" />
          <span>Gigio's Finance</span>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Bem-vindo</h1>
            <p className="mt-4 text-lg text-gray-400">
              Faça login para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="bg-gray-900 border-gray-800"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-gray-900 border-gray-800"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-400">Ou continue com</span>
            </div>
          </div>

          <Button onClick={handleGoogleSignIn} className="w-full bg-gray-800 hover:bg-gray-700">
            <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2" />
            Entrar com Google
          </Button>

          <div className="text-center text-sm text-gray-400">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


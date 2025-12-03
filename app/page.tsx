"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Leaf } from "lucide-react"
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
    // Verificar se já está logado
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const onSubmit = async (data: LoginFormData) => {
    console.log("=== INICIANDO LOGIN ===")
    console.log("Email:", data.email)
    setIsLoading(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      console.log("API_URL:", API_URL)
      console.log("URL completa:", `${API_URL}/auth/login`)
      
      const payload = {
        email: data.email,
        password: data.password
      }
      console.log("Payload:", { email: payload.email, password: "***" })
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log("Resposta raw:", responseText)
      
      let result
      try {
        result = JSON.parse(responseText)
        console.log("Resultado parseado:", result)
      } catch (e) {
        console.error("Erro ao parsear JSON:", e)
        throw new Error("Resposta inválida do servidor")
      }

      if (!response.ok) {
        // Mensagens específicas de erro
        if (response.status === 401) {
          toast.error("🔒 Email ou senha incorretos", {
            description: "Verifique suas credenciais e tente novamente."
          })
        } else if (result.message) {
          toast.error("❌ Erro ao fazer login", {
            description: result.message
          })
        } else {
          toast.error("❌ Erro ao fazer login", {
            description: "Ocorreu um erro inesperado."
          })
        }
        return
      }

      // Salvar token e dados do usuário
      console.log("Salvando dados no localStorage...")
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
        console.log("Token salvo:", result.token.substring(0, 20) + "...")
      }
      
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
        console.log("Usuário salvo:", result.user)
      }

      // Sucesso
      toast.success("✅ Login realizado com sucesso!", {
        description: `Bem-vindo de volta, ${result.user?.firstName || 'usuário'}!`
      })
      
      console.log("Redirecionando para dashboard em 1s...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast.error("🔌 Erro de conexão", {
          description: "Não foi possível conectar ao servidor."
        })
      } else {
        toast.error("❌ Erro ao fazer login", {
          description: "Ocorreu um erro inesperado."
        })
      }
    } finally {
      setIsLoading(false)
    }
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

          <div className="text-center text-sm text-gray-400 mt-6">
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


"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Leaf, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

const registerSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Iniciando criação de conta...", { ...data, password: "***", confirmPassword: "***" })
    setIsLoading(true)

    try {
      const payload: any = {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      }
      
      // Só adicionar phone se não estiver vazio
      if (data.phone && data.phone.trim() !== '') {
        payload.phone = data.phone
      }
      
      console.log("=== INICIANDO REGISTRO ===")
      console.log("Payload:", payload)
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      console.log("API_URL:", API_URL)
      console.log("URL completa:", `${API_URL}/auth/register`)
      
      const response = await fetch(`${API_URL}/auth/register`, {
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
        // Mensagens de erro específicas
        if (result.message) {
          if (result.message.includes("email") || result.message.includes("Email")) {
            toast.error("📧 Este email já está cadastrado", {
              description: "Tente fazer login ou use outro email."
            })
          } else if (result.message.includes("username") || result.message.includes("usuário")) {
            toast.error("👤 Este nome de usuário já está em uso", {
              description: "Por favor, escolha outro nome de usuário."
            })
          } else {
            toast.error("❌ Erro ao criar conta", {
              description: result.message
            })
          }
        } else {
          toast.error("❌ Erro ao criar conta", {
            description: "Ocorreu um erro inesperado. Tente novamente."
          })
        }
        return
      }

      // Salvar token e dados do usuário
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
      }
      
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
      }

      // Sucesso com animação
      toast.success("🎉 Conta criada com sucesso!", {
        description: `Bem-vindo, ${data.firstName}! Redirecionando...`
      })
      
      // Aguardar um pouco para o usuário ver a mensagem
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Erro ao criar conta:", error)
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast.error("🔌 Erro de conexão", {
          description: "Não foi possível conectar ao servidor. Verifique sua conexão."
        })
      } else {
        toast.error("❌ Erro ao criar conta", {
          description: error instanceof Error ? error.message : "Ocorreu um erro inesperado."
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="flex items-center gap-2 text-3xl font-bold text-white mb-8">
          <Leaf className="h-8 w-8 text-blue-500" />
          <span>Gigio's Finance</span>
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Criar conta</h1>
            <p className="mt-2 text-gray-400">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          <TooltipProvider>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Nome único que será usado para identificá-lo no sistema</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="seunome_usuario"
                  {...register("username")}
                  className="bg-gray-900 border-gray-800"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Seu nome"
                  {...register("firstName")}
                  className="bg-gray-900 border-gray-800"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Seu sobrenome"
                  {...register("lastName")}
                  className="bg-gray-900 border-gray-800"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Será usado para fazer login e recuperar senha</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pode ser usado para recuperação de conta</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...register("phone")}
                  className="bg-gray-900 border-gray-800"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mínimo de 6 caracteres. Use letras e números</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="bg-gray-900 border-gray-800"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </TooltipProvider>

          <div className="text-center text-sm text-gray-400">
            Já tem uma conta?{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    address: "",
  })
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated" && session?.user?.onboardingCompleted) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório"
    }

    setErrors(newErrors)
    return !newErrors.firstName && !newErrors.lastName
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age ? parseInt(formData.age) : null,
          phone: formData.phone || null,
          address: formData.address || null,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
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
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="flex items-center gap-2 text-3xl font-bold text-white mb-8">
          <Leaf className="h-8 w-8 text-blue-500" />
          <span>Gigio's Finance</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Complete seu perfil</h1>
            <p className="mt-2 text-gray-400">
              Precisamos de algumas informações para personalizar sua experiência
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                Nome *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="Digite seu nome"
                disabled={isLoading}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Sobrenome *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="Digite seu sobrenome"
                disabled={isLoading}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">
                Idade
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="Digite sua idade"
                min="1"
                max="150"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="(00) 00000-0000"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">
                Endereço
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="Rua, número, cidade"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Continuar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

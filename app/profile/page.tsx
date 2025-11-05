"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Leaf, LogOut } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          age: data.age?.toString() || "",
          phone: data.phone || "",
          address: data.address || "",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          age: userData.age ? parseInt(userData.age) : null,
          phone: userData.phone || null,
          address: userData.address || null,
        }),
      })

      if (response.ok) {
        alert("Perfil atualizado com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      alert("Erro ao atualizar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  const initials = userData.firstName && userData.lastName
    ? `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
    : session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <Leaf className="h-6 w-6 text-blue-500" />
            <span>Gigio's Finance</span>
          </Link>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
            <p className="mt-2 text-gray-400">
              Gerencie suas informações pessoais e configurações da conta
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Foto do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={session?.user?.image || ""} alt={userData.firstName} />
                  <AvatarFallback className="bg-blue-600 text-2xl text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-4 text-center text-sm text-gray-400">
                  Imagem sincronizada com sua conta Google
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Informações Pessoais</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualize seus dados pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        Nome
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={userData.firstName}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        disabled={isSaving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">
                        Sobrenome
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={userData.lastName}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      className="bg-gray-800 border-gray-700 text-gray-400"
                      disabled
                    />
                    <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-white">
                        Idade
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={userData.age}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        min="1"
                        max="150"
                        disabled={isSaving}
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
                        value={userData.phone}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">
                      Endereço
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={userData.address}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSaving}
                    >
                      {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
                      onClick={fetchUserData}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

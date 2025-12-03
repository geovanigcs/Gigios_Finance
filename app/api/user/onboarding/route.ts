import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, phone } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Nome e sobrenome são obrigatórios" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        onboardingCompleted: true,
        name: `${firstName} ${lastName}`,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

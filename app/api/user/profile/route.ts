import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        firstName: true,
        lastName: true,
        age: true,
        phone: true,
        address: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, age, phone, address } = body

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        age,
        phone,
        address,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

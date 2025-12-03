import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, firstName, lastName, email, phone, password } = body

    if (!email || !password || !username || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Nome de usuário, nome, sobrenome, email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    // Verificar se o username já existe
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Este nome de usuário já está em uso" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário com todos os dados e marcar onboarding como completo
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        name: `${firstName} ${lastName}`,
        emailVerified: new Date(),
        onboardingCompleted: true, // Já marca como completo pois coletamos tudo no registro
      }
    })

    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating user:", error)
    
    // Log mais detalhado para debug
    if (process.env.NODE_ENV !== "production") {
      console.error("Detailed error:", {
        message: error.message,
        code: error.code,
        meta: error.meta
      })
    }
    
    return NextResponse.json(
      { 
        error: "Erro ao criar usuário",
        details: process.env.NODE_ENV !== "production" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

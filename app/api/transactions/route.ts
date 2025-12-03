import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCategoryById } from "@/lib/transaction-categories"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 50
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { categoryId, amount, method, date } = body

    if (!categoryId || !amount || !method || !date) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    const category = getCategoryById(categoryId)
    if (!category) {
      return NextResponse.json(
        { error: "Categoria inválida" },
        { status: 400 }
      )
    }

    const transaction = await prisma.transaction.create({
      data: {
        title: category.name,
        amount: parseFloat(amount),
        type: category.type,
        method,
        category: categoryId,
        date: new Date(date),
        userId: session.user.id
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 })
  }
}

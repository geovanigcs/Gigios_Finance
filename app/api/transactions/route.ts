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
    const { name, categoryId, type, amount, method, date } = body

    if (!name || !type || !amount || !method || !date) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    // Se uma categoria foi selecionada, usa ela; senão, usa "other"
    const finalCategoryId = categoryId || "other"
    
    const transaction = await prisma.transaction.create({
      data: {
        title: name,
        amount: parseFloat(amount),
        type,
        method,
        category: finalCategoryId,
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

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { id, categoryId, amount, method, date } = body

    if (!id || !categoryId || !amount || !method || !date) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    // Verificar se a transação pertence ao usuário
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!existingTransaction || existingTransaction.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      )
    }

    const category = getCategoryById(categoryId)
    if (!category) {
      return NextResponse.json(
        { error: "Categoria inválida" },
        { status: 400 }
      )
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        title: category.name,
        amount: parseFloat(amount),
        type: category.type,
        method,
        category: categoryId,
        date: new Date(date)
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Erro ao atualizar transação:", error)
    return NextResponse.json({ error: "Erro ao atualizar transação" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      )
    }

    // Verificar se a transação pertence ao usuário
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!existingTransaction || existingTransaction.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      )
    }

    await prisma.transaction.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Transação excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir transação:", error)
    return NextResponse.json({ error: "Erro ao excluir transação" }, { status: 500 })
  }
}

import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const currentDate = new Date()
    const currentMonthStart = startOfMonth(currentDate)
    const currentMonthEnd = endOfMonth(currentDate)

    // Buscar transações do mês atual
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    })

    // Calcular totais do mês atual
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalInvestment = currentMonthTransactions
      .filter(t => t.type === "investment")
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense - totalInvestment

    // Buscar transações dos últimos 6 meses para o gráfico
    const sixMonthsAgo = subMonths(currentDate, 5)
    
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth(sixMonthsAgo),
          lte: currentMonthEnd,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Agrupar por mês
    const monthlyData: Record<string, { income: number; expense: number; investment: number }> = {}
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i)
      const monthKey = format(date, "MMM")
      monthlyData[monthKey] = { income: 0, expense: 0, investment: 0 }
    }

    monthlyTransactions.forEach((transaction) => {
      const monthKey = format(new Date(transaction.date), "MMM")
      
      if (monthlyData[monthKey]) {
        if (transaction.type === "income") {
          monthlyData[monthKey].income += transaction.amount
        } else if (transaction.type === "expense") {
          monthlyData[monthKey].expense += transaction.amount
        } else if (transaction.type === "investment") {
          monthlyData[monthKey].investment += transaction.amount
        }
      }
    })

    // Agrupar despesas por categoria
    const expensesByCategory: Record<string, number> = {}
    
    currentMonthTransactions
      .filter(t => t.type === "expense" && t.category)
      .forEach((transaction) => {
        if (transaction.category) {
          expensesByCategory[transaction.category] = 
            (expensesByCategory[transaction.category] || 0) + transaction.amount
        }
      })

    return NextResponse.json({
      balance,
      totalIncome,
      totalExpense,
      totalInvestment,
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        investment: data.investment,
      })),
      expensesByCategory: Object.entries(expensesByCategory).map(([category, value]) => ({
        category,
        value,
      })),
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}

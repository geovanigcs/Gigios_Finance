"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AddTransactionButton } from "@/components/transactions/add-transaction-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { format, startOfMonth, endOfMonth, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getCategoryById } from "@/lib/transaction-categories"
import { ChevronDown, ChevronUp } from "lucide-react"
interface Transaction {
  id: string
  title: string
  amount: number
  type: string
  method: string
  category: string | null
  date: string
}

interface MonthlyGroup {
  month: string
  monthDate: Date
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  totalInvestment: number
  balance: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())
  const transactionsRef = useRef<HTMLDivElement>(null)

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Erro ao buscar transações:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (!loading && transactionsRef.current) {
      const items = transactionsRef.current.querySelectorAll('.month-card')
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [loading, transactions])

  const groupByMonth = (transactions: Transaction[]): MonthlyGroup[] => {
    const groups: Record<string, MonthlyGroup> = {}

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthKey = format(date, "yyyy-MM")
      const monthLabel = format(date, "MMMM 'de' yyyy", { locale: ptBR })

      if (!groups[monthKey]) {
        groups[monthKey] = {
          month: monthLabel,
          monthDate: startOfMonth(date),
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          totalInvestment: 0,
          balance: 0,
        }
      }

      groups[monthKey].transactions.push(transaction)

      if (transaction.type === "income") {
        groups[monthKey].totalIncome += transaction.amount
      } else if (transaction.type === "expense") {
        groups[monthKey].totalExpense += transaction.amount
      } else if (transaction.type === "investment") {
        groups[monthKey].totalInvestment += transaction.amount
      }
    })

    Object.values(groups).forEach((group) => {
      group.balance = group.totalIncome - group.totalExpense - group.totalInvestment
    })

    return Object.values(groups).sort((a, b) => b.monthDate.getTime() - a.monthDate.getTime())
  }

  const monthlyGroups = groupByMonth(transactions)

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev)
      if (next.has(monthKey)) {
        next.delete(monthKey)
      } else {
        next.add(monthKey)
      }
      return next
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getCategoryEmoji = (categoryId: string | null) => {
    if (!categoryId) return "💰"
    const category = getCategoryById(categoryId)
    return category?.emoji || "💰"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-400"
      case "expense":
        return "text-red-400"
      case "investment":
        return "text-blue-400"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Transações" text="Gerencie suas transações financeiras." />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </DashboardShell>
    )
  }

  return (
    <>
      <DashboardShell>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <DashboardHeader heading="Transações" text="Histórico mensal de transações." />
          <AddTransactionButton onTransactionAdded={fetchTransactions} />
        </motion.div>

        <div ref={transactionsRef} className="space-y-4">
          {monthlyGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-400 text-lg">Nenhuma transação registrada</p>
              <p className="text-gray-500 text-sm mt-2">Adicione sua primeira transação para começar</p>
            </motion.div>
          ) : (
            monthlyGroups.map((group) => {
              const monthKey = format(group.monthDate, "yyyy-MM")
              const isExpanded = expandedMonths.has(monthKey)

              return (
                <motion.div
                  key={monthKey}
                  className="month-card"
                  layout
                >
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-800/50 transition-colors"
                      onClick={() => toggleMonth(monthKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl capitalize flex items-center gap-2">
                            {group.month}
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-400 mt-1">
                            {group.transactions.length} transaç{group.transactions.length === 1 ? "ão" : "ões"}
                          </p>
                        </div>
                        <div className="flex gap-4 text-right">
                          <div>
                            <p className="text-xs text-gray-400">Receita</p>
                            <p className="text-sm font-medium text-green-400">
                              {formatCurrency(group.totalIncome)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Despesa</p>
                            <p className="text-sm font-medium text-red-400">
                              {formatCurrency(group.totalExpense)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Saldo</p>
                            <p className={`text-sm font-bold ${group.balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {formatCurrency(group.balance)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {group.transactions.map((transaction) => (
                              <motion.div
                                key={transaction.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.01, x: 5 }}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{getCategoryEmoji(transaction.category)}</span>
                                  <div>
                                    <p className="font-medium">{transaction.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-xs text-gray-400">
                                        {format(new Date(transaction.date), "dd/MM/yyyy")}
                                      </p>
                                      <Badge variant="outline" className="text-xs border-gray-700">
                                        {transaction.method}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <p className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                                  {transaction.type === "expense" ? "-" : "+"}
                                  {formatCurrency(transaction.amount)}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </DashboardShell>
    </>
  )
}

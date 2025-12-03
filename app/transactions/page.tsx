"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AddTransactionButton } from "@/components/transactions/add-transaction-button"
import { EditTransactionDialog } from "@/components/transactions/edit-transaction-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { format, startOfMonth, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getCategoryById } from "@/lib/transaction-categories"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  title: string
  amount: number
  type: string
  method: string
  category: string | null
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const currentMonthRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

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
    if (!loading && currentMonthRef.current) {
      const items = currentMonthRef.current.querySelectorAll('.transaction-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" }
      )
    }
  }, [loading, transactions])

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

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await fetch(`/api/transactions/${deletingId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Transação excluída com sucesso!")
        fetchTransactions()
      } else {
        toast.error("Erro ao excluir transação")
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error)
      toast.error("Erro ao excluir transação")
    } finally {
      setDeletingId(null)
    }
  }

  // Separar transações do mês atual e histórico anterior
  const currentDate = new Date()
  
  const currentMonthTransactions = transactions.filter((t) => 
    isSameMonth(new Date(t.date), currentDate)
  )
  
  const previousMonthsTransactions = transactions.filter((t) => 
    !isSameMonth(new Date(t.date), currentDate)
  )

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
  
  const currentMonthStats = {
    totalIncome,
    totalExpense,
    totalInvestment,
    balance
  }

  // Agrupar histórico por mês
  const groupByMonth = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {}

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthKey = format(date, "MMMM 'de' yyyy", { locale: ptBR })

      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(transaction)
    })

    return groups
  }

  const historyGroups = groupByMonth(previousMonthsTransactions)

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
          <DashboardHeader 
            heading="Transações" 
            text={`${format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}`} 
          />
          <AddTransactionButton onTransactionAdded={fetchTransactions} />
        </motion.div>

        {/* Transações do Mês Atual */}
        <div ref={currentMonthRef}>
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl capitalize">
                    Mês Atual
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    {currentMonthTransactions.length} transaç{currentMonthTransactions.length === 1 ? "ão" : "ões"}
                  </p>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-gray-400">Receita</p>
                    <p className="text-sm font-medium text-green-400">
                      {formatCurrency(currentMonthStats.totalIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Despesa</p>
                    <p className="text-sm font-medium text-red-400">
                      {formatCurrency(currentMonthStats.totalExpense)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Saldo</p>
                    <p className={`text-sm font-bold ${currentMonthStats.balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatCurrency(currentMonthStats.balance)}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {currentMonthTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Nenhuma transação neste mês</p>
                  <p className="text-gray-500 text-sm mt-1">Adicione sua primeira transação</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentMonthTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="transaction-item flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getCategoryEmoji(transaction.category)}</span>
                        <div className="flex-1">
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

                      <div className="flex items-center gap-3">
                        <p className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                          {transaction.type === "expense" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-blue-600/20 hover:text-blue-400"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-red-600/20 hover:text-red-400"
                            onClick={() => setDeletingId(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Meses Anteriores */}
        <div ref={historyRef} className="mt-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-4"
          >
            Histórico
          </motion.h2>

          {Object.keys(historyGroups).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800"
            >
              <p className="text-gray-400 text-lg">Sem transações anteriores</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {Object.entries(historyGroups).map(([month, monthTransactions], index) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{month}</CardTitle>
                      <p className="text-sm text-gray-400">
                        {monthTransactions.length} transaç{monthTransactions.length === 1 ? "ão" : "ões"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {monthTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getCategoryEmoji(transaction.category)}</span>
                              <div>
                                <p className="text-sm font-medium">{transaction.title}</p>
                                <p className="text-xs text-gray-400">
                                  {format(new Date(transaction.date), "dd/MM/yyyy")}
                                </p>
                              </div>
                            </div>
                            <p className={`text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                              {transaction.type === "expense" ? "-" : "+"}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>

      {/* Dialog de Edição */}
      <EditTransactionDialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        transaction={editingTransaction}
        onSuccess={fetchTransactions}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

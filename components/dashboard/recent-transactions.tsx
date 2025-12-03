"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getCategoryById } from "@/lib/transaction-categories"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import gsap from "gsap"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Transaction {
  id: string
  title: string
  amount: number
  type: string
  method: string
  category: string | null
  date: string
  createdAt: string
}

interface RecentTransactionsProps {
  onTransactionChange?: () => void
}

export function RecentTransactions({ onTransactionChange }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const transactionsRef = useRef<HTMLDivElement>(null)

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.slice(0, 5))
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
      const items = transactionsRef.current.querySelectorAll('.transaction-item')
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          stagger: 0.08, 
          duration: 0.4,
          ease: "power2.out"
        }
      )
    }
  }, [loading, transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-4 w-4 text-green-400" />
      case "expense":
        return <ArrowDownRight className="h-4 w-4 text-red-400" />
      case "investment":
        return <TrendingUp className="h-4 w-4 text-blue-400" />
      default:
        return null
    }
  }

  const getMethodBadge = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      card: "Cartão",
      boleto: "Boleto",
      cash: "Dinheiro",
      transfer: "Transferência",
      crypto: "Crypto"
    }
    
    return (
      <Badge variant="outline" className="text-xs border-gray-700">
        {methods[method] || method}
      </Badge>
    )
  }

  const getCategoryEmoji = (categoryId: string | null) => {
    if (!categoryId) return null
    const category = getCategoryById(categoryId)
    return category ? <span className="text-lg">{category.emoji}</span> : null
  }

  const handleTransactionAdded = () => {
    fetchTransactions()
    onTransactionChange?.()
  }

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 h-full">
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900 border-gray-800 h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Transações Recentes</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
              <Link href="/transactions">
                <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                  Ver mais
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={transactionsRef} className="space-y-4">
              <AnimatePresence>
                {transactions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-400"
                  >
                    <p>Nenhuma transação ainda</p>
                    <p className="text-sm mt-2">Clique em "Adicionar" para começar</p>
                  </motion.div>
                ) : (
                  transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="transaction-item flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                          {transaction.category ? getCategoryEmoji(transaction.category) : getTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.title}</p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(transaction.date), "dd 'de' MMMM yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getMethodBadge(transaction.method)}
                        <span className={`text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                          {transaction.type === "expense" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleTransactionAdded}
      />
    </>
  )
}

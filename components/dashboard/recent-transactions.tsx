"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Banknote } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

const transactions = [
  {
    id: "1",
    name: "Salário",
    type: "income",
    amount: 1750,
    date: "28 de Março 2023",
    method: "PIX",
  },
  {
    id: "2",
    name: "Bitcoin",
    type: "investment",
    amount: 2500,
    date: "28 de Março 2023",
    method: "PIX",
  },
  {
    id: "3",
    name: "Academia",
    type: "expense",
    amount: 120.9,
    date: "28 de Março 2023",
    method: "Cartão",
  },
  {
    id: "4",
    name: "Aluguel",
    type: "expense",
    amount: 787.9,
    date: "28 de Março 2023",
    method: "PIX",
  },
  {
    id: "5",
    name: "Freelancing",
    type: "income",
    amount: 1750,
    date: "28 de Março 2023",
    method: "Boleto",
  },
]

export function RecentTransactions() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-500"
      case "expense":
        return "text-red-500"
      case "investment":
        return "text-gray-400"
      default:
        return ""
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "expense":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case "investment":
        return <Banknote className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "PIX":
        return (
          <Badge variant="outline" className="text-xs">
            PIX
          </Badge>
        )
      case "Cartão":
        return (
          <Badge variant="outline" className="text-xs">
            Cartão
          </Badge>
        )
      case "Boleto":
        return (
          <Badge variant="outline" className="text-xs">
            Boleto
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações</CardTitle>
        <Link href="/transactions" className="text-sm text-blue-500 hover:underline">
          <Button variant="outline" size="sm" className="mt-2">
            Ver mais
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center">
                <div className="mr-4">{getTypeIcon(transaction.type)}</div>
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getMethodIcon(transaction.method)}
                <span className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                  {transaction.type === "expense" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


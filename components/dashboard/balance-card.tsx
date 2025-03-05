"use client"

import { ArrowUpRight, Wallet, TrendingUp, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface BalanceCardProps {
  title: string
  amount: number
  icon: "wallet" | "trending-up" | "arrow-up-right"
}

export function BalanceCard({ title, amount, icon }: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const renderIcon = () => {
    switch (icon) {
      case "wallet":
        return <Wallet className="h-4 w-4 text-muted-foreground" />
      case "trending-up":
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />
      case "arrow-up-right":
        return <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-muted-foreground"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isVisible ? formatCurrency(amount) : "R$ ••••••"}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {renderIcon()}
          <span className="ml-1">Atualizado hoje</span>
        </p>
      </CardContent>
    </Card>
  )
}


import { ArrowUpRight, ArrowDownRight, Banknote, DollarSign, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TransactionItemProps {
  title: string
  amount: number
  type: "deposit" | "withdrawal" | "investment"
  date: string
  method: string
  category?: string
  investmentType?: string
}

export function TransactionItem({ title, amount, type, date, method, category, investmentType }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeIcon = () => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case "investment":
        if (investmentType === "international") {
          return <DollarSign className="h-4 w-4 text-indigo-500" />
        } else if (investmentType === "national") {
          return <TrendingUp className="h-4 w-4 text-purple-500" />
        }
        return <Banknote className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">{getTypeIcon()}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{title}</p>
          <span
            className={cn(
              "text-sm font-medium",
              type === "deposit" && "text-green-500",
              type === "withdrawal" && "text-red-500",
              type === "investment" && investmentType === "international"
                ? "text-indigo-500"
                : investmentType === "national"
                  ? "text-purple-500"
                  : "text-gray-400",
            )}
          >
            {type === "withdrawal" ? "-" : "+"}
            {formatCurrency(amount)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{date}</span>
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            {method.toUpperCase()}
          </Badge>
          {category && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              {category}
            </Badge>
          )}
          {investmentType && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 bg-blue-500/10 text-blue-400 border-blue-500/20">
              {investmentType === "international"
                ? "Internacional"
                : investmentType === "national"
                  ? "Nacional"
                  : investmentType === "crypto"
                    ? "Cripto"
                    : investmentType}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionItem } from "@/components/dashboard/transaction-item"
import { cn } from "@/lib/utils"

interface TransactionsSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionsSidebar({ open, onOpenChange }: TransactionsSidebarProps) {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MMMM", { locale: ptBR }))

  return (
    <div
      className={cn(
        "fixed right-0 top-[64px] h-[calc(100vh-64px)] w-[30%] lg:w-[25%] bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-l border-gray-800 transition-all duration-300 ease-in-out",
        !open && "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Transações</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(!open)}>
            {open ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[140px] h-8">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => new Date(2024, i, 1)).map((date) => (
              <SelectItem key={date.getMonth()} value={format(date, "MMMM", { locale: ptBR })}>
                {format(date, "MMMM", { locale: ptBR })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="p-4 space-y-4">
          <TransactionItem title="Salário" amount={3900} type="deposit" date="15 Nov, 2024" method="pix" />
          <TransactionItem
            title="Aluguel"
            amount={1200}
            type="withdrawal"
            date="15 Nov, 2024"
            method="pix"
            category="Moradia"
          />
          <TransactionItem title="Freelancing" amount={2500} type="deposit" date="14 Nov, 2024" method="pix" />
          <TransactionItem
            title="Academia"
            amount={120.9}
            type="withdrawal"
            date="14 Nov, 2024"
            method="card"
            category="Saúde"
          />
          <TransactionItem
            title="Ações PETR4"
            amount={2500}
            type="investment"
            date="12 Nov, 2024"
            method="transfer"
            investmentType="national"
          />
          <TransactionItem
            title="ETF S&P 500"
            amount={3200}
            type="investment"
            date="10 Nov, 2024"
            method="transfer"
            investmentType="international"
          />
          <TransactionItem
            title="Bitcoin"
            amount={1500}
            type="investment"
            date="8 Nov, 2024"
            method="transfer"
            investmentType="crypto"
          />
        </div>
      </ScrollArea>
    </div>
  )
}


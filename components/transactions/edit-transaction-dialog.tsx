"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { TRANSACTION_CATEGORIES, getCategoryById } from "@/lib/transaction-categories"
import { format } from "date-fns"

interface Transaction {
  id: string
  title: string
  amount: number
  type: string
  method: string
  category: string | null
  date: string
}

interface EditTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  onSuccess?: () => void
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess
}: EditTransactionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    if (transaction) {
      setCategoryId(transaction.category || "")
      setAmount(transaction.amount.toString())
      setMethod(transaction.method)
      setDate(format(new Date(transaction.date), "yyyy-MM-dd"))
    }
  }, [transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!transaction) return

    setLoading(true)

    try {
      const response = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: transaction.id,
          categoryId,
          amount: parseFloat(amount),
          method,
          date
        })
      })

      if (response.ok) {
        toast.success("Transação atualizada com sucesso!")
        onOpenChange(false)
        onSuccess?.()
      } else {
        const error = await response.json()
        toast.error(error.error || "Erro ao atualizar transação")
      }
    } catch (error) {
      console.error("Erro ao atualizar transação:", error)
      toast.error("Erro ao atualizar transação")
    } finally {
      setLoading(false)
    }
  }

  const category = transaction?.category ? getCategoryById(transaction.category) : null
  const availableCategories = category ? TRANSACTION_CATEGORIES.filter(c => c.type === category.type) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da transação
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TRANSACTION_CATEGORIES, getCategoriesByType, type TransactionCategory } from "@/lib/transaction-categories"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import gsap from "gsap"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "",
    method: "",
    category: "",
    investmentType: "",
  })
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSave = async () => {
    if (formData.title && formData.amount && formData.type) {
      setShowConfirmation(true)
    }
  }

  const confirmSave = async () => {
    try {
      setLoading(true)
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aqui você implementaria a chamada real para sua API
      console.log("Salvando transação:", {
        ...formData,
        date,
        amount: Number.parseFloat(formData.amount),
      })

      setShowConfirmation(false)
      onOpenChange(false)
      // Reset form
      setFormData({
        title: "",
        amount: "",
        type: "",
        method: "",
        category: "",
        investmentType: "",
      })
    } catch (error) {
      console.error("Erro ao salvar transação:", error)
    } finally {
      setLoading(false)
    }
  }

  const isInvestment = formData.type === "investment"

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Adicionar Transação</DialogTitle>
            <DialogDescription className="text-gray-400">Insira as informações abaixo</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Título"
                className="bg-gray-800 border-gray-700"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                placeholder="R$ 0.000,00"
                className="bg-gray-800 border-gray-700"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo da transação</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="income">Ganho</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="investment">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isInvestment && (
              <div className="grid gap-2">
                <Label htmlFor="investmentType">Tipo de investimento</Label>
                <Select
                  value={formData.investmentType}
                  onValueChange={(value) => setFormData({ ...formData, investmentType: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="national">Investimento Nacional</SelectItem>
                    <SelectItem value="international">Investimento Internacional</SelectItem>
                    <SelectItem value="crypto">Criptomoedas</SelectItem>
                    <SelectItem value="stocks">Ações</SelectItem>
                    <SelectItem value="realestate">Imóveis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="method">Método de pagamento</Label>
              <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="crypto">Carteira Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "expense" && (
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="housing">Moradia</SelectItem>
                    <SelectItem value="food">Alimentação</SelectItem>
                    <SelectItem value="transport">Transporte</SelectItem>
                    <SelectItem value="health">Saúde</SelectItem>
                    <SelectItem value="leisure">Lazer</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="utilities">Contas (Água/Luz/Internet)</SelectItem>
                    <SelectItem value="shopping">Compras</SelectItem>
                    <SelectItem value="travel">Viagens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal bg-gray-800 border-gray-700",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecionar Data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={!formData.title || !formData.amount || !formData.type}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Adição</DialogTitle>
          </DialogHeader>
          <Alert className="border-blue-500/20 bg-blue-500/10">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">Confirmação</AlertTitle>
            <AlertDescription className="text-blue-500/90">
              Tem certeza que deseja adicionar esta transação?
            </AlertDescription>
          </Alert>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirmSave}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


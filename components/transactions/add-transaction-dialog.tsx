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
import { CalendarIcon, X } from "lucide-react"
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
  onSuccess?: () => void
}

export function AddTransactionDialog({ open, onOpenChange, onSuccess }: AddTransactionDialogProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedType, setSelectedType] = useState<"income" | "expense" | "investment" | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null)
  const [customName, setCustomName] = useState("")
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [loading, setLoading] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (open && categoriesRef.current) {
      const categories = categoriesRef.current.querySelectorAll('.category-card')
      gsap.fromTo(
        categories,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.3, ease: "back.out(1.7)" }
      )
    }
  }, [open, selectedType])

  const handleTypeSelect = (type: "income" | "expense" | "investment") => {
    setSelectedType(type)
    setSelectedCategory(null)
  }

  const handleCategorySelect = (category: TransactionCategory) => {
    setSelectedCategory(category)
    
    // Animação de seleção
    const element = document.querySelector(`[data-category-id="${category.id}"]`)
    if (element) {
      gsap.to(element, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 })
    }
  }

  const handleSave = async () => {
    if (!selectedType || !customName.trim() || !amount) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast.error('Você precisa estar logado')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: customName.trim(),
          categoryId: selectedCategory?.id || "other",
          type: selectedType,
          amount: parseFloat(amount),
          method: method || "pix",
          date: date.toISOString(),
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear()
          window.location.href = '/'
          return
        }
        throw new Error("Erro ao adicionar transação")
      }

      const emoji = selectedCategory?.emoji || (selectedType === "income" ? "💵" : selectedType === "investment" ? "📊" : "💸")
      toast.success(`${emoji} Transação "${customName}" adicionada com sucesso!`)
      onOpenChange(false)
      onSuccess?.()
      
      // Reset form
      setSelectedType(null)
      setSelectedCategory(null)
      setCustomName("")
      setAmount("")
      setMethod("")
      setDate(new Date())
    } catch (error) {
      toast.error("Erro ao adicionar transação")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = selectedType ? getCategoriesByType(selectedType) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              Adicionar Transação
            </motion.span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecione o tipo e a categoria da transação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seleção de Tipo */}
          {!selectedType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <Label>Tipo de Transação</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-gray-800 border-gray-700 hover:bg-green-500/20 hover:border-green-500"
                  onClick={() => handleTypeSelect("income")}
                >
                  <span className="text-2xl">💵</span>
                  <span className="text-sm">Receita</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-gray-800 border-gray-700 hover:bg-red-500/20 hover:border-red-500"
                  onClick={() => handleTypeSelect("expense")}
                >
                  <span className="text-2xl">💸</span>
                  <span className="text-sm">Despesa</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-gray-800 border-gray-700 hover:bg-blue-500/20 hover:border-blue-500"
                  onClick={() => handleTypeSelect("investment")}
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">Investimento</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Nome da Transação */}
          {selectedType && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="customName">Nome da Transação</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedType(null)
                    setSelectedCategory(null)
                    setCustomName("")
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  Voltar
                </Button>
              </div>
              <Input
                id="customName"
                type="text"
                placeholder="Ex: Salário, Mercado, Netflix, Bitcoin..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-lg"
                autoFocus
              />
            </motion.div>
          )}

          {/* Categorias Opcionais */}
          {selectedType && customName.trim() && !selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Label>Categoria (Opcional)</Label>
              <div ref={categoriesRef} className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                {filteredCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    data-category-id={category.id}
                    className="category-card flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-blue-500 transition-colors text-left"
                    onClick={() => handleCategorySelect(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{category.emoji}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{category.name}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategorySelect({ id: "other", name: "Outro", emoji: "📝", type: selectedType } as TransactionCategory)}
                className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Sem Categoria
              </Button>
            </motion.div>
          )}

          {/* Formulário de Detalhes */}
          <AnimatePresence>
            {selectedType && customName.trim() && (selectedCategory || customName) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Informações da Transação */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCategory?.emoji || (selectedType === "income" ? "💵" : selectedType === "investment" ? "📊" : "💸")}</span>
                    <div>
                      <p className="font-medium">{customName}</p>
                      {selectedCategory && selectedCategory.id !== "other" && (
                        <p className="text-xs text-gray-400">{selectedCategory.name}</p>
                      )}
                    </div>
                  </div>
                  {selectedCategory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-lg"
                  />
                </div>

                {/* Método de Pagamento */}
                <div className="space-y-2">
                  <Label htmlFor="method">Método de Pagamento</Label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                  >
                    <option value="pix">PIX</option>
                    <option value="card">Cartão</option>
                    <option value="boleto">Boleto</option>
                    <option value="cash">Dinheiro</option>
                    <option value="transfer">Transferência</option>
                    <option value="crypto">Carteira Digital</option>
                  </select>
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
                          !date && "text-muted-foreground"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            disabled={loading}
          >
            Cancelar
          </Button>
          {selectedType && customName.trim() && amount && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Adicionando..." : "Adicionar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { getCategoryById } from "@/lib/transaction-categories"

interface ExpensesByCategoryProps {
  data: Array<{
    category: string
    value: number
  }>
}

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f97316", "#8b5cf6", "#ec4899", "#f59e0b"]

export function ExpensesByCategory({ data }: ExpensesByCategoryProps) {
  const chartData = data.map((item, index) => {
    const category = getCategoryById(item.category)
    return {
      name: category?.name || item.category,
      emoji: category?.emoji || "💰",
      value: item.value,
      color: COLORS[index % COLORS.length],
    }
  })

  if (chartData.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Gastos por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Nenhuma despesa registrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie 
              data={chartData} 
              cx="50%" 
              cy="50%" 
              innerRadius={60} 
              outerRadius={80} 
              paddingAngle={2} 
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value) => <span style={{ color: "#fff" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex w-full items-center justify-between">
                <p className="text-sm flex items-center gap-1">
                  <span>{item.emoji}</span>
                  {item.name}
                </p>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

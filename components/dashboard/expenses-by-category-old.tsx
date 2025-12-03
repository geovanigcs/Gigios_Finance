"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Moradia", value: 1500, color: "#22c55e" },
  { name: "Alimentação", value: 800, color: "#ef4444" },
  { name: "Transporte", value: 400, color: "#3b82f6" },
  { name: "Saúde", value: 300, color: "#f97316" },
]

export function ExpensesByCategory() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
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
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex w-full items-center justify-between">
                <p className="text-sm">{item.name}</p>
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


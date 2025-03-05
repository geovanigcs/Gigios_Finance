"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", expenses: 1200, income: 1800 },
  { name: "Fev", expenses: 1400, income: 1800 },
  { name: "Mar", expenses: 1300, income: 2000 },
  { name: "Abr", expenses: 1700, income: 2100 },
  { name: "Mai", expenses: 1600, income: 1900 },
  { name: "Jun", expenses: 1500, income: 2200 },
]

export function ExpensesChart() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Fluxo de Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
              formatter={(value) => [`R$ ${value}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


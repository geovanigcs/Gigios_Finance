"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { ExpensesChart } from "@/components/dashboard/expenses-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function DashboardPage() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.balance-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          stagger: 0.1, 
          duration: 0.6,
          ease: "power3.out"
        }
      )
    }

    if (chartsRef.current) {
      gsap.fromTo(
        chartsRef.current.children,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15, 
          duration: 0.7,
          delay: 0.3,
          ease: "power2.out"
        }
      )
    }
  }, [])

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader heading="Dashboard" text="Visualize e gerencie suas finanças." />
      </motion.div>

      <div ref={cardsRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="balance-card">
          <BalanceCard title="Saldo" amount={2700} icon="wallet" />
        </div>
        <div className="balance-card">
          <BalanceCard title="Investido" amount={3500} icon="trending-up" />
        </div>
        <div className="balance-card">
          <BalanceCard title="Receita" amount={8150} icon="arrow-up-right" />
        </div>
      </div>

      <div ref={chartsRef} className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ExpensesChart />
          <ExpensesByCategory />
        </div>
        <RecentTransactions />
      </div>
    </DashboardShell>
  )
}


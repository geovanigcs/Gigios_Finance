import type { Metadata } from "next"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Assinatura | FinanceIA Gigio's",
  description: "Escolha o melhor plano para você",
}

export default function SubscriptionPage() {
  return (
    <div className="container ">
      <SiteHeader />
      <div className="mx-auto max-w-md mt-2 text-center">
        <h1 className="text-4xl font-bold">Planos</h1>
        <p className="mt-4 text-gray-400">Escolha o plano que melhor se adapta às suas necessidades</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        <Card className="relative bg-gray-900 border-gray-800">
          <Badge variant="outline" className="absolute top-4 right-4 bg-blue-500/10 text-blue-500 border-blue-500/20">
            Atual
          </Badge>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl">Plano Básico</h3>
                <div>
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-gray-400 ml-2">/mês</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span>Até 10 transações por dia</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-500" />
                <span className="text-gray-400">Relatórios de IA ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-500" />
                <span className="text-gray-400">Suporte prioritário</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" variant="default">
              Fazer Upgrade
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl">Plano Pro</h3>
                <div>
                  <span className="text-4xl font-bold">R$ 19</span>
                  <span className="text-gray-400 ml-2">/mês</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span>Transações ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span>Relatórios de IA ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              variant="default"
            >
              Adquirir plano
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const weeklyData = [
  { name: 'Lun', revenue: 400, sales: 240 },
  { name: 'Mar', revenue: 300, sales: 139 },
  { name: 'Mer', revenue: 200, sales: 980 },
  { name: 'Jeu', revenue: 278, sales: 390 },
  { name: 'Ven', revenue: 189, sales: 480 },
  { name: 'Sam', revenue: 239, sales: 380 },
  { name: 'Dim', revenue: 349, sales: 430 },
]

const yearlyData = [
  { name: '2017', value: 20 },
  { name: '2018', value: 25 },
  { name: '2019', value: 30 },
  { name: '2020', value: 22 },
  { name: '2021', value: 28 },
  { name: '2022', value: 35 },
  { name: '2023', value: 40 },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#8eb464] text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visites Quotidiennes</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,652</div>
            <p className="text-xs text-primary-foreground/70">+2.57% depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-[#8eb464]/90 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,254,000.62 XOF</div>
            <p className="text-xs text-primary-foreground/70">+18.23% depuis le mois dernier</p>
          </CardContent>
        </Card> 
        <Card className="bg-[#8eb464]/80 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <ShoppingCart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">753</div>
            <p className="text-xs text-primary-foreground/70">+5.23% depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-[#8eb464]/70 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">63,154</div>
            <p className="text-xs text-primary-foreground/70">+8.21% depuis le mois dernier</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rapport des ventes hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1f3932" />
                <Bar dataKey="sales" fill="#8eb464" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Rapport des ventes annuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8eb464" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    
    </div>
  )
}


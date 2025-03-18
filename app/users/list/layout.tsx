import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Open Change Dashboard",
  description: "Tableau de bord de gestion des changements",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto bg-background">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      
  )
}


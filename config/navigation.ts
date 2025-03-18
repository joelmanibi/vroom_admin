import { LayoutDashboard, Users, CarFront, User2, CalendarDays, Settings } from 'lucide-react'
import { NavItem } from '@/types/navigation'

export const mainNav: NavItem[] = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
    subItems: [
      { title: "Vues", href: "/dashboard" }
    ]
  },

  {
    title: "Chauffeur",
    href: "/driver",
    icon: CarFront,
    subItems: [
      { title: "Liste des chauffeurs", href: "/driver/list" }
    ]
  },
  {
    title: "Client",
    href: "/customers",
    icon: User2,
    subItems: [
      { title: "Liste des clients", href: "/customer" }
    ]
  },
  {
    title: "Utilisateurs",
    href: "/users",
    icon: Users,
    subItems: [
      { title: "Liste des utilisateurs", href: "/users/list" }
    ]
  },
  {
    title: "Reservations",
    href: "/booking",
    icon: CalendarDays,
    subItems: [
      { title: "Liste des reservations", href: "/booking" }
    ]
  },
  {
    title: "Parametres",
    href: "/settings",
    icon: Settings,
    subItems: [
      { title: "Commissions", href: "/commission" }
    ]
  }
  
]

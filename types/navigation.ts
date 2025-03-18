import { type LucideIcon } from 'lucide-react'

export interface SubNavItem {
  title: string
  href: string
}

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  subItems?: SubNavItem[]
}

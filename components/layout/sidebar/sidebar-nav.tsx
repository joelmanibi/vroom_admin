"use client"

import { usePathname } from "next/navigation"
import { mainNav } from "@/config/navigation"
import { SidebarItem } from "./sidebar-item"
import { useExpandedItems } from "@/hooks/use-expanded-items"

export function SidebarNav() {
  const pathname = usePathname()
  const { expandedItems, toggleItem } = useExpandedItems()

  return (
    <nav className="grid gap-1 px-2">
      {mainNav.map((item) => (
        <SidebarItem
          key={item.href}
          item={item}
          isExpanded={expandedItems.has(item.title)}
          isActive={pathname.startsWith(item.href)}
          onToggle={() => toggleItem(item.title)}
        />
      ))}
    </nav>
  )
}


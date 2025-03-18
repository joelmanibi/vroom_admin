import Link from "next/link"
import { ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NavItem } from "@/types/navigation"

interface SidebarItemProps {
  item: NavItem
  isExpanded: boolean
  isActive: boolean
  onToggle: () => void
}

export function SidebarItem({ 
  item, 
  isExpanded, 
  isActive, 
  onToggle 
}: SidebarItemProps) {
  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-between text-white hover:bg-white/10",
          isActive && "bg-white/20"
        )}
        onClick={item.subItems ? onToggle : undefined}
      >
        <span className="flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          {item.title}
        </span>
        {item.subItems && (
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-180"
            )} 
          />
        )}
      </Button>
      {item.subItems && isExpanded && (
        <div className="grid gap-1 px-4 py-2">
          {item.subItems.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={cn(
                "flex h-8 items-center rounded-md px-2 text-sm",
                "hover:bg-white/10",
                "transition-colors duration-200"
              )}
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


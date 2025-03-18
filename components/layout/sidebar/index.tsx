import { SidebarHeader } from "./sidebar-header"
import { SidebarNav } from "./sidebar-nav"

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-[#1f3932] text-white">
      <SidebarHeader />
      <div className="flex-1 overflow-auto py-2">
        <SidebarNav />
      </div>
    </div>
  )
}


import Image from "next/image"
import Link from "next/link"

export function SidebarHeader() {
  return (
    <div className="flex h-14 items-center border-b border-white/10 px-4 bg-[#1f3932]">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <div className="relative h-30 w-30">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-white">VroomCar Admin</span>
      </Link>
    </div>
  )
}


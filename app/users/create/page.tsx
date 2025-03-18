
import { CreateUserForm } from "@/components/users/create/CreateUserForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateUserPage() {
  return (
  
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
            <Link href="/users">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          <h1 className="text-2xl font-bold">Créer un utilisateur</h1>
        </div>
        <CreateUserForm/>
      </div>
    
  )
}


import UserList from "@/components/users/list/UserList";


export default function UsersPage() {
  return (
    
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <UserList />
      </div>
  )
}


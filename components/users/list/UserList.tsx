"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreHorizontal, Plus, Search, Loader2, Eye, Edit, Trash2 } from "lucide-react"
import { client } from "@/lib/appoloClient"
import { GET_DRIVERS } from "@/lib/graphql/queries"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Type pour les données du staff provenant de l'API
type StaffNode = {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  isActive: boolean
  isOnline: boolean
  createdAt: string
  status: {
    id: string
    userType: string
    driverVerified: string
    passengerVerified: string
  }
  documents: {
    edges: {
      node: {
        rectoPath: string
        versoPath: string
      }
    }[]
  }
}

// Type pour notre modèle de staff interne
type Staff = {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  company: string
  isActive: boolean
  createdAt: string
}

export default function StaffDashboard() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedStaff, setPaginatedStaff] = useState<Staff[]>([])

  // Charger les membres du staff depuis l'API GraphQL
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        const { data } = await client.query({
          query: GET_DRIVERS,
          variables: { userType: "STAFF" },
        })

        // Transformer les données de l'API en notre format interne
        const transformedStaff: Staff[] = data.users.edges.map((edge: { node: StaffNode }) => {
          const node = edge.node

          // Utiliser userType comme rôle au lieu d'une valeur aléatoire
          // Générer uniquement des entreprises aléatoires pour l'exemple
          

          return {
            id: node.id,
            name: `${node.firstName} ${node.lastName}`,
            firstName: node.firstName,
            lastName: node.lastName,
            email: node.email,
            phone: node.phoneNumber || "Non spécifié",
            role: node.status.userType, // Utiliser userType comme rôle
            isActive: node.isActive,
            createdAt: new Date(node.createdAt).toLocaleDateString(),
          }
        })

        setStaffList(transformedStaff)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des membres du staff:", err)
        setError("Impossible de charger les membres du staff. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  // Filter effect
  useEffect(() => {
    let result = staffList

    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      result = result.filter(
        (staff) =>
          staff.name.toLowerCase().includes(query) ||
          staff.email.toLowerCase().includes(query) ||
          staff.role.toLowerCase().includes(query) ||
          staff.company.toLowerCase().includes(query),
      )
    }

    setFilteredStaff(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [staffList, searchTerm, itemsPerPage])

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedStaff(filteredStaff.slice(startIndex, endIndex))
  }, [currentPage, filteredStaff, itemsPerPage])

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Show current page and surrounding pages
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(totalPages)
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  const showStaffDetails = (staff: Staff) => {
    setSelectedStaff(staff)
    setIsDialogOpen(true)
  }

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8eb464] mb-4" />
        <p>Chargement des membres du staff...</p>
      </div>
    )
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Gestion des utilisateurs</h1>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild className="bg-[#8eb464] hover:bg-[#8eb464]/90">
            <Link href="/dashboard/staff/create">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
            </Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.company}</TableCell>
                    <TableCell>
                      <Badge variant={staff.isActive ? "default" : "secondary"}>
                        {staff.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => showStaffDetails(staff)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredStaff.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Dialog pour les détails du staff */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedStaff && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Détails de l'utilisateur</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nom complet</p>
                  <p className="text-sm">{selectedStaff.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{selectedStaff.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm">{selectedStaff.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date d'inscription</p>
                  <p className="text-sm">{selectedStaff.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-sm">{selectedStaff.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Entreprise</p>
                  <p className="text-sm">{selectedStaff.company}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Statut</p>
                <Badge variant={selectedStaff.isActive ? "default" : "secondary"} className="mt-1">
                  {selectedStaff.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}


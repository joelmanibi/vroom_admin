"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"
import { Search, MoreHorizontal, Eye, Lock, Unlock } from "lucide-react"
import Image from "next/image"

type Client = {
  id: number
  firstName: string
  lastName: string
  residence: string
  reservations: number
  photo: string
  isBlocked: boolean
  email: string
  phone: string
  registrationDate: string
}

const clients: Client[] = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Dubois",
    residence: "Paris",
    reservations: 15,
    photo: "/placeholder.svg?height=40&width=40",
    isBlocked: false,
    email: "alice.dubois@example.com",
    phone: "06 12 34 56 78",
    registrationDate: "15/01/2023",
  },
  {
    id: 2,
    firstName: "Bernard",
    lastName: "Martin",
    residence: "Lyon",
    reservations: 8,
    photo: "/placeholder.svg?height=40&width=40",
    isBlocked: true,
    email: "bernard.martin@example.com",
    phone: "06 23 45 67 89",
    registrationDate: "22/03/2023",
  },
  {
    id: 3,
    firstName: "Claire",
    lastName: "Lefebvre",
    residence: "Marseille",
    reservations: 22,
    photo: "/placeholder.svg?height=40&width=40",
    isBlocked: false,
    email: "claire.lefebvre@example.com",
    phone: "06 34 56 78 90",
    registrationDate: "10/02/2023",
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Moreau",
    residence: "Bordeaux",
    reservations: 5,
    photo: "/placeholder.svg?height=40&width=40",
    isBlocked: false,
    email: "david.moreau@example.com",
    phone: "06 45 67 89 01",
    registrationDate: "05/04/2023",
  },
  {
    id: 5,
    firstName: "Émilie",
    lastName: "Rousseau",
    residence: "Lille",
    reservations: 12,
    photo: "/placeholder.svg?height=40&width=40",
    isBlocked: false,
    email: "emilie.rousseau@example.com",
    phone: "06 56 78 90 12",
    registrationDate: "18/05/2023",
  },
]

export default function ClientDashboard() {
  const [clientList, setClientList] = useState<Client[]>(clients)
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [residenceFilter, setResidenceFilter] = useState<string>("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedClients, setPaginatedClients] = useState<Client[]>([])

  // Filter effect
  useEffect(() => {
    let result = clientList

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (client) => client.firstName.toLowerCase().includes(query) || client.lastName.toLowerCase().includes(query),
      )
    }

    if (residenceFilter !== "all") {
      result = result.filter((client) => client.residence === residenceFilter)
    }

    setFilteredClients(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [clientList, searchQuery, residenceFilter, itemsPerPage])

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedClients(filteredClients.slice(startIndex, endIndex))
  }, [currentPage, filteredClients, itemsPerPage])

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
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
            <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
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
          <PaginationLink isActive={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  // Get unique residences for the filter
  const uniqueResidences = Array.from(new Set(clients.map((client) => client.residence)))

  const toggleClientBlock = (clientId: number) => {
    setClientList((prevList) =>
      prevList.map((client) => {
        if (client.id === clientId) {
          return { ...client, isBlocked: !client.isBlocked }
        }
        return client
      }),
    )
  }

  const showClientDetails = (client: Client) => {
    setSelectedClient(client)
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Tableau de bord des clients VTC</h1>

      {/* Filtres */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select onValueChange={setResidenceFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par résidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les résidences</SelectItem>
              {uniqueResidences.map((residence) => (
                <SelectItem key={residence} value={residence}>
                  {residence}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Lieu de résidence</TableHead>
              <TableHead>Nombre de réservations</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Image
                    src={client.photo || "/placeholder.svg"}
                    alt={`${client.firstName} ${client.lastName}`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{client.lastName}</TableCell>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.residence}</TableCell>
                <TableCell>{client.reservations}</TableCell>
                <TableCell>
                  <Badge variant={client.isBlocked ? "destructive" : "default"}>
                    {client.isBlocked ? "Bloqué" : "Actif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => showClientDetails(client)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleClientBlock(client.id)}>
                        {client.isBlocked ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Débloquer
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Bloquer
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredClients.length)} à{" "}
          {Math.min(currentPage * itemsPerPage, filteredClients.length)} sur {filteredClients.length} clients
        </div>
      </div>

      {/* Dialog pour les détails du client */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedClient && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Détails du client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedClient.photo || "/placeholder.svg"}
                  alt={`${selectedClient.firstName} ${selectedClient.lastName}`}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{`${selectedClient.firstName} ${selectedClient.lastName}`}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm">{selectedClient.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Résidence</p>
                  <p className="text-sm">{selectedClient.residence}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date d'inscription</p>
                  <p className="text-sm">{selectedClient.registrationDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Nombre de réservations</p>
                  <p className="text-sm">{selectedClient.reservations}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Statut</p>
                <Badge variant={selectedClient.isBlocked ? "destructive" : "default"} className="mt-1">
                  {selectedClient.isBlocked ? "Bloqué" : "Actif"}
                </Badge>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}


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
} from "@/components/ui/pagination"
import {
  Search,
  MoreHorizontal,
  Eye,
  Lock,
  Unlock,
  Loader2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react"
import Image from "next/image"
import { client } from "@/lib/appoloClient"
import { GET_DRIVERS } from "@/lib/graphql/queries"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Type pour les données du passager provenant de l'API
type PassengerNode = {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  isActive: boolean
  isOnline: boolean
  createdAt: string
  vehicles: {
    edges: {
      node: {
        vehicleBrand: string
        vehicleRegistration: string
        vehicleModel: string
        vehicleColor: string
        documents: {
          edges: {
            node: {
              rectoPath: string
              versoPath: string
            }
          }[]
        }
      }
    }[]
  }
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

// Type pour notre modèle de passager interne
type Passenger = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  photo: string
  isActive: boolean
  isBlocked: boolean
  registrationDate: string
  reservations: number
  passengerVerified: string
  driverVerified: string
  idCardFront: string
  idCardBack: string
}

export default function PassengerDashboard() {
  const [passengerList, setPassengerList] = useState<Passenger[]>([])
  const [filteredPassengers, setFilteredPassengers] = useState<Passenger[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedPassengers, setPaginatedPassengers] = useState<Passenger[]>([])

  // Charger les passagers depuis l'API GraphQL
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        setLoading(true)
        const { data } = await client.query({
          query: GET_DRIVERS,
          variables: { userType: "PASSENGER" },
        })

        // Transformer les données de l'API en notre format interne
        const transformedPassengers: Passenger[] = data.users.edges.map((edge: { node: PassengerNode }) => {
          const node = edge.node
          const documents = node.documents.edges || []

          // Trouver les documents d'identité (recto/verso)
          const idCardFront =
            documents.find((doc: any) => doc.node.rectoPath)?.node.rectoPath || "/placeholder.svg?height=300&width=500"
          const idCardBack =
            documents.find((doc: any) => doc.node.versoPath)?.node.versoPath || "/placeholder.svg?height=300&width=500"

          

          return {
            id: node.id,
            firstName: node.firstName,
            lastName: node.lastName,
            fullName: `${node.firstName} ${node.lastName}`,
            email: node.email,
            phone: "+225"+node.phoneNumber || "Non spécifié",
            photo: "/placeholder.svg?height=40&width=40", // Placeholder pour l'image de profil
            isActive: node.isActive,
            isBlocked: !node.isActive,
            registrationDate: new Date(node.createdAt).toLocaleDateString(),
            reservations: Math.floor(Math.random() * 20), // Valeur aléatoire pour l'exemple
            passengerVerified: node.status.passengerVerified,
            driverVerified: node.status.driverVerified,
            idCardFront: idCardFront,
            idCardBack: idCardBack,
          }
        })

        setPassengerList(transformedPassengers)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des passagers:", err)
        setError("Impossible de charger les passagers. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchPassengers()
  }, [])

  // Filter effect
  useEffect(() => {
    let result = passengerList

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (passenger) =>
          passenger.firstName.toLowerCase().includes(query) ||
          passenger.lastName.toLowerCase().includes(query) ||
          passenger.email.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        result = result.filter((passenger) => !passenger.isBlocked)
      } else if (statusFilter === "blocked") {
        result = result.filter((passenger) => passenger.isBlocked)
      }
    }

    setFilteredPassengers(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [passengerList, searchQuery, statusFilter, itemsPerPage])

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedPassengers(filteredPassengers.slice(startIndex, endIndex))
  }, [currentPage, filteredPassengers, itemsPerPage])

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

  const togglePassengerBlock = (passengerId: string) => {
    setPassengerList((prevList) =>
      prevList.map((passenger) => {
        if (passenger.id === passengerId) {
          return { ...passenger, isBlocked: !passenger.isBlocked, isActive: !passenger.isActive }
        }
        return passenger
      }),
    )
  }

  const showPassengerDetails = (passenger: Passenger) => {
    setSelectedPassenger(passenger)
    setIsDialogOpen(true)
  }

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8eb464] mb-4" />
        <p>Chargement des passagers...</p>
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
      <h1 className="text-2xl font-bold mb-5">Tableau de bord des passagers VTC</h1>

      {/* Filtres */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="blocked">Bloqués</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tableau des passagers */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Nom et prenom</TableHead>
              <TableHead>Numero de tel</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nombre de réservations</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPassengers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun passager trouvé
                </TableCell>
              </TableRow>
            ) : (
              paginatedPassengers.map((passenger) => (
                <TableRow key={passenger.id}>
                  <TableCell>
                    <Image
                      src={passenger.photo || "/placeholder.svg"}
                      alt={`${passenger.firstName} ${passenger.lastName}`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>{passenger.fullName}</TableCell>
                  <TableCell>{passenger.phone}</TableCell>
                  <TableCell>{passenger.email}</TableCell>
                  <TableCell>{passenger.reservations}</TableCell>
                  <TableCell>
                    <Badge variant={passenger.isActive ? "default" : "destructive"}>
                      {passenger.isActive ? "Actif" : "Bloqué"}
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
                        <DropdownMenuItem onClick={() => showPassengerDetails(passenger)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePassengerBlock(passenger.id)}>
                          {passenger.isBlocked ? (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredPassengers.length > 0 && (
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
            Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPassengers.length)} à{" "}
            {Math.min(currentPage * itemsPerPage, filteredPassengers.length)} sur {filteredPassengers.length} passagers
          </div>
        </div>
      )}

      {/* Dialog pour les détails du passager */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedPassenger && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails du passager</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations personnelles avec carte d'identité */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={selectedPassenger.photo || "/placeholder.svg"}
                    alt={`${selectedPassenger.firstName} ${selectedPassenger.lastName}`}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{`${selectedPassenger.firstName} ${selectedPassenger.lastName}`}</h3>
                    <p className="text-sm text-muted-foreground">ID: {selectedPassenger.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Infos de base */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedPassenger.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedPassenger.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Inscrit le {selectedPassenger.registrationDate}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Statut du compte</p>
                      <Badge variant={selectedPassenger.isBlocked ? "destructive" : "default"}>
                        {selectedPassenger.isBlocked ? "Bloqué" : "Actif"}
                      </Badge>
                    </div>
                    
                  </div>

                  {/* Carte d'identité */}
                  
                </div>
              </div>

              {/* Statistiques */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-semibold text-lg mb-4">Statistiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Nombre de réservations</p>
                    <p className="text-2xl font-bold">{selectedPassenger.reservations}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Date d'inscription</p>
                    <p className="text-lg font-medium">{selectedPassenger.registrationDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}


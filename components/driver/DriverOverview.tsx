"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
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
  Eye,
  MoreHorizontal,
  Power,
  Trash2,
  Car,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Search,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { client } from "@/lib/appoloClient"
import { GET_DRIVERS } from "@/lib/graphql/queries"
import { UPDATE_VERIFICATION_USER_MUTATION } from "@/lib/graphql/mutation/user-mutation"
import { gql } from "@apollo/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Type pour les données du chauffeur provenant de l'API
type DriverNode = {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  isActive: boolean
  isOnline: boolean
  createdAt: string
  driverJourneys: {
    edges: {
      node: {
        id: string
      }
    }[]
  }
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


// Type pour notre modèle de chauffeur interne
type Driver = {
  id: string
  image: string
  name: string
  isOnline: boolean
  isActive: boolean
  vehicleModel: string
  vehicleRegistration: string
  seats: number
  status: "online" | "offline"
  state: "active" | "inactive" | "pending"
  orders: number
  email: string
  phone: string
  address: string
  joinDate: string
  totalEarnings: number
  rating: number
  idCardFront: string
  idCardBack: string
  vehicleRegistration_doc: string
  driverJourneys: []
  vehiclePhoto: string
  firstName: string
  lastName: string
  driverVerified: string
  passengerVerified: string
}

export default function DriverDashboard() {
  const [driverList, setDriverList] = useState<Driver[]>([])
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [ordersRange, setOrdersRange] = useState<[number, number]>([0, 250])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutationLoading, setMutationLoading] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedDrivers, setPaginatedDrivers] = useState<Driver[]>([])

  // Charger les chauffeurs depuis l'API GraphQL
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        const { data } = await client.query({
          query: GET_DRIVERS,
          variables: { userType: "DRIVER" },
        })

        // Transformer les données de l'API en notre format interne
        const transformedDrivers: Driver[] = data.users.edges.map((edge: { node: DriverNode }) => {
          const node = edge.node
          const vehicle = node.vehicles.edges[0]?.node || {}
          const documents = node.documents.edges || []

          // Trouver les documents d'identité (recto/verso)
          const idCardFront =
            documents.find((doc: any) => doc.node.rectoPath)?.node.rectoPath || "/placeholder.svg?height=300&width=500"
          const idCardBack =
            documents.find((doc: any) => doc.node.versoPath)?.node.versoPath || "/placeholder.svg?height=300&width=500"

          // Déterminer l'état du chauffeur en fonction de driverVerified
          let state: "active" | "inactive" | "pending" = "pending"
          if (node.status.driverVerified === "VERIFIED") {
            state = "active"
          } else if (node.status.driverVerified === "REJECTED") {
            state = "inactive"
          }

          return {
            id: node.id,
            image: "/placeholder.svg?height=40&width=40", // Placeholder pour l'image de profil
            name: `${node.firstName} ${node.lastName}`,
            firstName: node.firstName,
            lastName: node.lastName,
            vehicleModel: vehicle.vehicleModel || "Non spécifié",
            vehicleRegistration: vehicle.vehicleRegistration || "Non spécifié",
            seats: 4, // Valeur par défaut
            isOnline: node.isOnline,
            isActive: node.isActive,
            state: state,
            orders: node.driverJourneys.edges.length, // Valeur aléatoire pour l'exemple
            email: node.email,
            phone: node.phoneNumber || "Non spécifié",
            address: "Non spécifié", // Non fourni par l'API
            joinDate: new Date(node.createdAt).toLocaleDateString(),
            totalEarnings: Math.floor(Math.random() * 15000), // Valeur aléatoire pour l'exemple
            rating: (Math.random() * 2 + 3).toFixed(1), // Note aléatoire entre 3 et 5
            idCardFront: idCardFront,
            idCardBack: idCardBack,
            vehicleRegistration_doc: "/placeholder.svg?height=300&width=500&text=Carte+Grise",
            vehiclePhoto: "/placeholder.svg?height=300&width=500&text=Photo+Véhicule",
            driverVerified: node.status.driverVerified,
            passengerVerified: node.status.passengerVerified,
          }
        })

        setDriverList(transformedDrivers)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des chauffeurs:", err)
        setError("Impossible de charger les chauffeurs. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const toggleDriverVerification = async (driverId: string, currentStatus: string) => {
    try {
      setMutationLoading(true)

      // Déterminer le nouveau statut en fonction du statut actuel
      const newStatus = currentStatus === "REJECTED" || currentStatus === "PENDING" ? "VERIFIED" : "REJECTED"

      const { data } = await client.mutate({
        mutation: UPDATE_VERIFICATION_USER_MUTATION,
        variables: {
          userId: driverId,
          driverVerified: newStatus,
        },
      })

      if (data.updateUserVerification.success) {
        // Mettre à jour la liste des chauffeurs avec le nouveau statut
        setDriverList((prevList) =>
          prevList.map((driver) => {
            if (driver.id === driverId) {
              return {
                ...driver,
                driverVerified: newStatus,
                // Mettre à jour l'état du chauffeur en fonction du nouveau statut
                state: newStatus === "VERIFIED" ? "active" : "inactive",
                isActive: newStatus === "VERIFIED",
              }
            }
            return driver
          }),
        )

        // Si le chauffeur sélectionné est celui qui a été modifié, mettre à jour ses informations
        if (selectedDriver && selectedDriver.id === driverId) {
          setSelectedDriver({
            ...selectedDriver,
            driverVerified: newStatus,
            state: newStatus === "VERIFIED" ? "active" : "inactive",
            isActive: newStatus === "VERIFIED",
          })
        }
      } else {
        setError("Échec de la mise à jour du statut: " + data.updateUserVerification.message)
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err)
      setError("Impossible de mettre à jour le statut. Veuillez réessayer plus tard.")
    } finally {
      setMutationLoading(false)
    }
  }

  const toggleDriverState = (driverId: string) => {
    setDriverList((prevList) =>
      prevList.map((driver) => {
        if (driver.id === driverId) {
          const nextState = driver.state === "active" ? "inactive" : driver.state === "inactive" ? "pending" : "active"
          return { ...driver, state: nextState }
        }
        return driver
      }),
    )
  }

  const deleteDriver = (driverId: string) => {
    setDriverList((prevList) => prevList.filter((driver) => driver.id !== driverId))
  }

  const showDriverDetails = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsDialogOpen(true)
  }

  // Filter effect
  useEffect(() => {
    let result = driverList

    if (statusFilter !== "all") {
      result = result.filter((driver) => driver.status === statusFilter)
    }

    if (stateFilter !== "all") {
      result = result.filter((driver) => driver.state === stateFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (driver) =>
          driver.name.toLowerCase().includes(query) ||
          driver.vehicleRegistration.toLowerCase().includes(query) ||
          driver.email.toLowerCase().includes(query),
      )
    }

    result = result.filter((driver) => driver.orders >= ordersRange[0] && driver.orders <= ordersRange[1])

    setFilteredDrivers(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [driverList, statusFilter, stateFilter, searchQuery, ordersRange, itemsPerPage])

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedDrivers(filteredDrivers.slice(startIndex, endIndex))
  }, [currentPage, filteredDrivers, itemsPerPage])

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

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8eb464] mb-4" />
        <p>Chargement des chauffeurs...</p>
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
      <h1 className="text-2xl font-bold mb-5">Tableau de bord des chauffeurs VTC</h1>

      {/* Filtres */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="online">En ligne</SelectItem>
              <SelectItem value="offline">Hors ligne</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setStateFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par état" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les états</SelectItem>
              <SelectItem value="active">Activé</SelectItem>
              <SelectItem value="inactive">Désactivé</SelectItem>
              <SelectItem value="pending">En cours de validation</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou matricule"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nombre de commandes : {ordersRange[0]} - {ordersRange[1]}
          </label>
          <Slider
            min={0}
            max={250}
            step={10}
            value={ordersRange}
            onValueChange={(value: number[]) => setOrdersRange(value as [number, number])}
            className="w-full md:w-1/2 [&_[role=slider]]:bg-[#8eb464] [&_[role=slider]]:border-[#8eb464] [&_[role=slider]]:focus:ring-[#8eb464] [&_.relative]:bg-[#8eb464]"
          />
        </div>
      </div>

      {/* Tableau des chauffeurs */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profil</TableHead>
              <TableHead>Nom et Prénom</TableHead>
              <TableHead>Modèle de véhicule</TableHead>
              <TableHead>Matricule de véhicule</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>État</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Aucun chauffeur trouvé
                </TableCell>
              </TableRow>
            ) : (
              paginatedDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <Image
                      src={driver.image || "/placeholder.svg"}
                      alt={`${driver.name} profile`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.vehicleModel}</TableCell>
                  <TableCell>{driver.vehicleRegistration}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        driver.isOnline
                          ? "bg-green-500 hover:bg-green-600 text-white font-bold"
                          : "bg-gray-400 hover:bg-gray-500 text-white font-bold"
                      }
                    >
                      {driver.isOnline ? "En ligne" : "Hors ligne"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={driver.isActive ? "bg-green-100 text-gray-800" : "bg-yellow-100 text-yellow-800"}>
                      {driver.isActive ? "Activé" : "En cours de validation"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        driver.driverVerified === "VERIFIED"
                          ? "bg-green-100 text-green-800"
                          : driver.driverVerified === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {driver.driverVerified === "VERIFIED"
                        ? "Vérifié"
                        : driver.driverVerified === "REJECTED"
                          ? "Rejeté"
                          : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{driver.orders}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => showDriverDetails(driver)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDriver(driver.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleDriverVerification(driver.id, driver.driverVerified)}>
                          <Power className="mr-2 h-4 w-4" />
                          {driver.driverVerified === "VERIFIED" ? "Désactiver" : "Activer"}
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
      {filteredDrivers.length > 0 && (
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
            Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDrivers.length)} à{" "}
            {Math.min(currentPage * itemsPerPage, filteredDrivers.length)} sur {filteredDrivers.length} chauffeurs
          </div>
        </div>
      )}

      {/* Dialog pour les détails du chauffeur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDriver && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 z-50 bg-background pb-4">
              <DialogTitle>Détails du chauffeur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations personnelles avec carte d'identité */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Infos de base */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={selectedDriver.image || "/placeholder.svg"}
                          alt={selectedDriver.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{selectedDriver.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {selectedDriver.id}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{selectedDriver.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedDriver.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedDriver.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Inscrit le {selectedDriver.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Carte d'identité */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-semibold">Carte d'identité</span>
                      </div>
                      <Tabs defaultValue="front" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="front">Recto</TabsTrigger>
                          <TabsTrigger value="back">Verso</TabsTrigger>
                        </TabsList>
                        <TabsContent value="front">
                          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                            <Image
                              src={selectedDriver.idCardFront}
                              alt="Carte d'identité recto"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="back">
                          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                            <Image
                              src={selectedDriver.idCardBack || "/placeholder.svg"}
                              alt="Carte d'identité verso"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations véhicule */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations véhicule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>{selectedDriver.vehicleModel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Matricule:</span>
                      <span>{selectedDriver.vehicleRegistration}</span>
                    </div>
                  </div>
                  <Tabs defaultValue="photo" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="photo">Photo du véhicule</TabsTrigger>
                      <TabsTrigger value="registration">Carte grise</TabsTrigger>
                    </TabsList>
                    <TabsContent value="photo">
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                        <Image
                          src={selectedDriver.vehiclePhoto || "/placeholder.svg"}
                          alt="Photo du véhicule"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="registration">
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                        <Image
                          src={selectedDriver.vehicleRegistration_doc || "/placeholder.svg"}
                          alt="Carte grise"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total des commandes</p>
                      <p className="text-2xl font-bold">{selectedDriver.orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Note moyenne</p>
                      <p className="text-2xl font-bold">{selectedDriver.rating}/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gains totaux</p>
                      <p className="text-2xl font-bold">{selectedDriver.totalEarnings}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statut actuel */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut actuel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Disponibilité</p>
                      <Badge
                        className={
                          selectedDriver.isOnline
                            ? "bg-green-500 hover:bg-green-600 text-white font-bold"
                            : "bg-gray-400 hover:bg-gray-500 text-white font-bold"
                        }
                      >
                        {selectedDriver.isOnline ? "En ligne" : "Hors ligne"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">État du compte</p>
                      <Badge
                        className={
                          selectedDriver.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {selectedDriver.isActive ? "Activé" : "En cours de validation"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Statut de vérification</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Chauffeur:</span>
                          <Badge
                            className={
                              selectedDriver.driverVerified === "VERIFIED"
                                ? "bg-green-100 text-green-800"
                                : selectedDriver.driverVerified === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {selectedDriver.driverVerified === "VERIFIED"
                              ? "Vérifié"
                              : selectedDriver.driverVerified === "REJECTED"
                                ? "Rejeté"
                                : "En attente"}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => toggleDriverVerification(selectedDriver.id, selectedDriver.driverVerified)}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          disabled={mutationLoading}
                        >
                          {mutationLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mise à jour...
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              {selectedDriver.driverVerified === "VERIFIED" ? "Désactiver" : "Activer"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

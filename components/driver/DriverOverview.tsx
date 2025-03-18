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
} from "./pagination"
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
} from "lucide-react"
import Image from "next/image"

type Driver = {
  id: number
  image: string
  name: string
  vehicleModel: string
  vehicleMatricule: string
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
  vehicleRegistration: string // Nouvelle propriété pour la carte grise
  vehiclePhoto: string // Nouvelle propriété pour la photo du véhicule
}

const drivers: Driver[] = [
  {
    id: 1,
    image: "/images/photo1.jpeg",
    name: "Jean Dupont",
    vehicleModel: "Renault Clio",
    vehicleMatricule: "AA-065-AA",
    seats: 4,
    status: "online",
    state: "active",
    orders: 150,
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    address: "123 rue de Paris, 75001 Paris",
    joinDate: "15/01/2023",
    totalEarnings: 12500,
    rating: 4.8,
    idCardFront: "/placeholder.svg?height=300&width=500",
    idCardBack: "/placeholder.svg?height=300&width=500",
    vehicleRegistration: "/placeholder.svg?height=300&width=500&text=Carte+Grise",
    vehiclePhoto: "/placeholder.svg?height=300&width=500&text=Photo+Véhicule",
  },
  {
    id: 2,
    image: "/images/photo3.jpg",
    name: "Marie Martin",
    vehicleModel: "Peugeot 308",
    vehicleMatricule: "AA-245-AA",
    seats: 5,
    status: "offline",
    state: "inactive",
    orders: 98,
    email: "marie.martin@example.com",
    phone: "06 98 76 54 32",
    address: "456 avenue des Champs-Élysées, 75008 Paris",
    joinDate: "03/03/2023",
    totalEarnings: 8900,
    rating: 4.6,
    idCardFront: "/placeholder.svg?height=300&width=500",
    idCardBack: "/placeholder.svg?height=300&width=500",
    vehicleRegistration: "/placeholder.svg?height=300&width=500&text=Carte+Grise",
    vehiclePhoto: "/placeholder.svg?height=300&width=500&text=Photo+Véhicule",
  },
  {
    id: 3,
    image: "/images/photo2.jpg",
    name: "Pierre Durand",
    vehicleModel: "Citroën C4",
    vehicleMatricule: "AA-985-AA",
    seats: 5,
    status: "online",
    state: "pending",
    orders: 210,
    email: "pierre.durand@example.com",
    phone: "06 45 67 89 01",
    address: "789 boulevard Haussmann, 75009 Paris",
    joinDate: "22/06/2023",
    totalEarnings: 15800,
    rating: 4.9,
    idCardFront: "/placeholder.svg?height=300&width=500",
    idCardBack: "/placeholder.svg?height=300&width=500",
    vehicleRegistration: "/placeholder.svg?height=300&width=500&text=Carte+Grise",
    vehiclePhoto: "/placeholder.svg?height=300&width=500&text=Photo+Véhicule",
  },
]

export default function DriverDashboard() {
  const [driverList, setDriverList] = useState<Driver[]>(drivers)
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [ordersRange, setOrdersRange] = useState<[number, number]>([0, 250])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedDrivers, setPaginatedDrivers] = useState<Driver[]>([])

  const toggleDriverState = (driverId: number) => {
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

  const deleteDriver = (driverId: number) => {
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
        (driver) => driver.name.toLowerCase().includes(query) || driver.vehicleMatricule.toLowerCase().includes(query),
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
              <TableHead>Sièges</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>État</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrivers.map((driver) => (
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
                <TableCell>{driver.vehicleMatricule}</TableCell>
                <TableCell>{driver.seats}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      driver.status === "online"
                        ? "bg-green-500 hover:bg-green-600 text-white font-bold"
                        : "bg-gray-400 hover:bg-gray-500 text-white font-bold"
                    }
                  >
                    {driver.status === "online" ? "En ligne" : "Hors ligne"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      driver.state === "active"
                        ? "bg-gray-100 text-gray-800"
                        : driver.state === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {driver.state === "active"
                      ? "Activé"
                      : driver.state === "inactive"
                        ? "Désactivé"
                        : "En cours de validation"}
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
                      <DropdownMenuItem onClick={() => toggleDriverState(driver.id)}>
                        <Power className="mr-2 h-4 w-4" />
                        {driver.state === "active" ? "Désactiver" : "Activer"}
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
          Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDrivers.length)} à{" "}
          {Math.min(currentPage * itemsPerPage, filteredDrivers.length)} sur {filteredDrivers.length} chauffeurs
        </div>
      </div>

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
                              src={selectedDriver.idCardFront || "/placeholder.svg"}
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
                      <span>{selectedDriver.vehicleMatricule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Nombre de sièges:</span>
                      <span>{selectedDriver.seats}</span>
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
                          src={selectedDriver.vehicleRegistration || "/placeholder.svg"}
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
                          selectedDriver.status === "online"
                            ? "bg-green-500 hover:bg-green-600 text-white font-bold"
                            : "bg-gray-400 hover:bg-gray-500 text-white font-bold"
                        }
                      >
                        {selectedDriver.status === "online" ? "En ligne" : "Hors ligne"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">État du compte</p>
                      <Badge
                        className={
                          selectedDriver.state === "active"
                            ? "bg-gray-100 text-gray-800"
                            : selectedDriver.state === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {selectedDriver.state === "active"
                          ? "Activé"
                          : selectedDriver.state === "inactive"
                            ? "Désactivé"
                            : "En cours de validation"}
                      </Badge>
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


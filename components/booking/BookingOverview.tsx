"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Search, MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

type Reservation = {
  id: number
  clientName: string
  driverName: string
  dateTime: Date
  status: "pending" | "confirmed" | "cancelled"
  pickupLocation: string
  dropoffLocation: string
  price: number
  commission: number
  commissionPercentage: number
}

const reservations: Reservation[] = [
  {
    id: 1,
    clientName: "Alice Dubois",
    driverName: "Jean Dupont",
    dateTime: new Date("2023-07-15T10:00:00"),
    status: "confirmed",
    pickupLocation: "123 Rue de Paris, Paris",
    dropoffLocation: "456 Avenue des Champs-Élysées, Paris",
    price: 35000.5,
    commission: 5000.33,
    commissionPercentage: 15,
  },
  {
    id: 2,
    clientName: "Bernard Martin",
    driverName: "Marie Martin",
    dateTime: new Date("2023-07-16T14:30:00"),
    status: "pending",
    pickupLocation: "789 Boulevard Haussmann, Paris",
    dropoffLocation: "101 Rue de Rivoli, Paris",
    price: 28000.75,
    commission: 4000.31,
    commissionPercentage: 15,
  },
  {
    id: 3,
    clientName: "Claire Lefebvre",
    driverName: "Pierre Durand",
    dateTime: new Date("2023-07-17T09:15:00"),
    status: "cancelled",
    pickupLocation: "202 Avenue Montaigne, Paris",
    dropoffLocation: "303 Rue du Faubourg Saint-Honoré, Paris",
    price: 42000.0,
    commission: 6000.3,
    commissionPercentage: 15,
  },
  // Ajoutez plus de réservations ici...
]

export default function ReservationDashboard() {
  const [reservationList, setReservationList] = useState<Reservation[]>(reservations)
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(reservations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedReservations, setPaginatedReservations] = useState<Reservation[]>([])

  // Filter effect
  useEffect(() => {
    let result = reservationList

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (reservation) =>
          reservation.clientName.toLowerCase().includes(query) || reservation.driverName.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((reservation) => reservation.status === statusFilter)
    }

    if (dateFilter) {
      result = result.filter(
        (reservation) => format(reservation.dateTime, "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd"),
      )
    }

    setFilteredReservations(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [reservationList, searchQuery, statusFilter, dateFilter, itemsPerPage])

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedReservations(filteredReservations.slice(startIndex, endIndex))
  }, [currentPage, filteredReservations, itemsPerPage])

  const showReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDialogOpen(true)
  }

  const updateReservationStatus = (id: number, newStatus: "confirmed" | "cancelled") => {
    setReservationList((prevList) =>
      prevList.map((reservation) => (reservation.id === id ? { ...reservation, status: newStatus } : reservation)),
    )
  }

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
      <h1 className="text-2xl font-bold mb-5">Tableau de bord des réservations VTC</h1>

      {/* Filtres */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[280px] justify-start text-left font-normal ${!dateFilter && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
            </PopoverContent>
          </Popover>

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

      {/* Tableau des réservations */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Chauffeur</TableHead>
              <TableHead>Date et heure</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>% Commission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.clientName}</TableCell>
                <TableCell>{reservation.driverName}</TableCell>
                <TableCell>{format(reservation.dateTime, "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      reservation.status === "confirmed"
                        ? "default"
                        : reservation.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {reservation.status === "confirmed"
                      ? "Confirmée"
                      : reservation.status === "cancelled"
                        ? "Annulée"
                        : "En attente"}
                  </Badge>
                </TableCell>
                <TableCell>{reservation.price.toFixed(2)} XOF</TableCell>
                <TableCell>{reservation.commission.toFixed(2)} XOF</TableCell>
                <TableCell>{reservation.commissionPercentage}%</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => showReservationDetails(reservation)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      {reservation.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => updateReservationStatus(reservation.id, "confirmed")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirmer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateReservationStatus(reservation.id, "cancelled")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Annuler
                          </DropdownMenuItem>
                        </>
                      )}
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
          Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredReservations.length)} à{" "}
          {Math.min(currentPage * itemsPerPage, filteredReservations.length)} sur {filteredReservations.length}{" "}
          réservations
        </div>
      </div>

      {/* Dialog pour les détails de la réservation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedReservation && (
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Détails de la réservation</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">ID de réservation</p>
                  <p className="text-sm">{selectedReservation.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <Badge
                    variant={
                      selectedReservation.status === "confirmed"
                        ? "default"
                        : selectedReservation.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {selectedReservation.status === "confirmed"
                      ? "Confirmée"
                      : selectedReservation.status === "cancelled"
                        ? "Annulée"
                        : "En attente"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-sm">{selectedReservation.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Chauffeur</p>
                  <p className="text-sm">{selectedReservation.driverName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date et heure</p>
                  <p className="text-sm">{format(selectedReservation.dateTime, "dd/MM/yyyy HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Prix</p>
                  <p className="text-sm">{selectedReservation.price.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Commission</p>
                  <p className="text-sm">{selectedReservation.commission.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Pourcentage de commission</p>
                  <p className="text-sm">{selectedReservation.commissionPercentage}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Lieu de départ</p>
                <p className="text-sm">{selectedReservation.pickupLocation}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Lieu d'arrivée</p>
                <p className="text-sm">{selectedReservation.dropoffLocation}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}


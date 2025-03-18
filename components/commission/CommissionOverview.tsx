"use client"

import { TableHeader } from "@/components/ui/table"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"
import { Badge } from "@/components/ui/badge"

type Commission = {
  id: number
  percentage: number
  createdAt: Date
  isActive: boolean
}

const initialCommissions: Commission[] = [
  { id: 1, percentage: 15, createdAt: new Date("2023-01-01"), isActive: false },
  { id: 2, percentage: 18, createdAt: new Date("2023-03-15"), isActive: false },
  { id: 3, percentage: 20, createdAt: new Date("2023-06-01"), isActive: true },
  // Ajoutez d'autres commissions ici...
]

export default function CommissionDashboard() {
  const [commissions, setCommissions] = useState<Commission[]>(initialCommissions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCommissionPercentage, setNewCommissionPercentage] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedCommissions, setPaginatedCommissions] = useState<Commission[]>([])

  useEffect(() => {
    setTotalPages(Math.ceil(commissions.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedCommissions(commissions.slice(startIndex, endIndex))
  }, [commissions, currentPage, itemsPerPage])

  const toggleCommissionStatus = (id: number) => {
    setCommissions((prevCommissions) =>
      prevCommissions.map((commission) => {
        if (commission.id === id) {
          return { ...commission, isActive: !commission.isActive }
        } else {
          return commission
        }
      }),
    )
  }

  const handleAddCommission = () => {
    const percentage = Number.parseFloat(newCommissionPercentage)
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast({
        title: "Erreur",
        description: "Le pourcentage doit être un nombre entre 0 et 100.",
        variant: "destructive",
      })
      return
    }

    const newCommission: Commission = {
      id: Math.max(...commissions.map((c) => c.id), 0) + 1,
      percentage: percentage,
      createdAt: new Date(),
      isActive: true,
    }

    setCommissions((prevCommissions) => [newCommission, ...prevCommissions.map((c) => ({ ...c, isActive: false }))])
    setIsDialogOpen(false)
    setNewCommissionPercentage("")
    toast({
      title: "Succès",
      description: "Nouvelle commission ajoutée avec succès et définie comme active.",
    })
  }

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
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>,
      )

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />)
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />)
      }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord des commissions</h1>
        <Button className=" bg-[#8eb464] hover:bg-[#1f3932] text-black" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une commission
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Pourcentage</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>{commission.id}</TableCell>
                <TableCell>{commission.percentage}%</TableCell>
                <TableCell>{format(commission.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell>
                  <Badge variant={commission.isActive ? "default" : "secondary"}>
                    {commission.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCommissionStatus(commission.id)}
                    disabled={!commission.isActive}
                  >
                    {commission.isActive ? "Désactiver" : "Activer"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
          Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, commissions.length)} à{" "}
          {Math.min(currentPage * itemsPerPage, commissions.length)} sur {commissions.length} commissions
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle commission</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="percentage" className="text-right">
                Pourcentage
              </Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={newCommissionPercentage}
                onChange={(e) => setNewCommissionPercentage(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-[#8eb464] hover:bg-[#1f3932] text-black" onClick={handleAddCommission}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


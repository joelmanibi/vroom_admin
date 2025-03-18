"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export function CreateUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pod: "",
    entity: "",
    post: "",
    role: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.firstName.length < 2) {
      newErrors.firstName = "Le prénom doit contenir au moins 2 caractères."
    }
    if (formData.lastName.length < 2) {
      newErrors.lastName = "Le nom doit contenir au moins 2 caractères."
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide."
    }
    if (!formData.pod) {
      newErrors.pod = "Veuillez sélectionner un POD."
    }
    if (!formData.entity) {
      newErrors.entity = "Veuillez sélectionner une entité."
    }
    if (!formData.post) {
      newErrors.post = "Veuillez sélectionner un poste."
    }
    if (!formData.role) {
      newErrors.role = "Veuillez sélectionner un rôle."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log(formData)
      // Here you would typically send the data to your API
      alert("Formulaire soumis avec succès!")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                Prénom
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Nom
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="pod" className="text-sm font-medium">
                POD
              </label>
              <Select onValueChange={(value) => handleSelectChange("pod", value)}>
                <SelectTrigger id="pod">
                  <SelectValue placeholder="Sélectionnez un POD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WECA">WECA</SelectItem>
                  <SelectItem value="MEA">MEA</SelectItem>
                  <SelectItem value="MS">MS</SelectItem>
                </SelectContent>
              </Select>
              {errors.pod && <p className="text-sm text-red-500">{errors.pod}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="entity" className="text-sm font-medium">
                Entité
              </label>
              <Select onValueChange={(value) => handleSelectChange("entity", value)}>
                <SelectTrigger id="entity">
                  <SelectValue placeholder="Sélectionnez une entité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOS">GOS</SelectItem>
                  <SelectItem value="CECOM">CECOM</SelectItem>
                </SelectContent>
              </Select>
              {errors.entity && <p className="text-sm text-red-500">{errors.entity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="post" className="text-sm font-medium">
                Poste
              </label>
              <Select onValueChange={(value) => handleSelectChange("post", value)}>
                <SelectTrigger id="post">
                  <SelectValue placeholder="Sélectionnez un poste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager de pod">Manager de pod</SelectItem>
                  <SelectItem value="QA">QA</SelectItem>
                  <SelectItem value="Support N2">Support N2</SelectItem>
                  <SelectItem value="Support N1">Support N1</SelectItem>
                </SelectContent>
              </Select>
              {errors.post && <p className="text-sm text-red-500">{errors.post}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Rôle
              </label>
              <Select onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demandeur">Demandeur</SelectItem>
                  <SelectItem value="validateur_n1">Validateur N1</SelectItem>
                  <SelectItem value="validateur_n2">Validateur N2</SelectItem>
                  <SelectItem value="administrateur">Administrateur</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/users/list">Annuler</Link>
            </Button>
            <Button type="submit" className="bg-[#e77a1a] hover:bg-[#e77a1a]/90">
              Créer l'utilisateur
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


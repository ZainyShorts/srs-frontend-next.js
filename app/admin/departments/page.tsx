"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Plus, Trash } from "lucide-react" // Import Trash icon
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Department {
  _id: string
  departmentName: string
  createdAt: string
  updatedAt: string
  __v: number
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDepartmentName, setNewDepartmentName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false) // State for delete confirmation modal
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null) // Department to delete

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/department`)
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast.error("Failed to load departments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDepartmentName.trim()) {
      toast.error("Department name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(`${process.env.NEXT_PUBLIC_SRS_SERVER}/department/add`, {
        departmentName: newDepartmentName,
      })

      toast.success("Department added successfully")
      setNewDepartmentName("")
      setIsModalOpen(false)
      fetchDepartments() // Refresh the list
    } catch (error) {
      console.error("Error adding department:", error)
      toast.error("Failed to add department")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SRS_SERVER}/department/${departmentToDelete._id}`)
      toast.success("Department deleted successfully")
      fetchDepartments()
    } catch (error) {
      console.error("Error deleting department:", error)
      toast.error("Failed to delete department")
    } finally {
      setIsDeleteModalOpen(false) // Close the delete confirmation modal
      setDepartmentToDelete(null) // Reset the department to delete
    }
  }

  const openDeleteConfirmationModal = (department: Department) => {
    setDepartmentToDelete(department) // Set the department to delete
    setIsDeleteModalOpen(true) // Open the delete confirmation modal
  }

  return (
    <div className="container mx-auto p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Departments</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => (
            <Card key={department._id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{department.departmentName}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirmationModal(department)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Added on {new Date(department.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDepartment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="departmentName" className="text-right col-span-1">
                  Name
                </label>
                <Input
                  id="departmentName"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter department name"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the department{" "}
              <span className="font-semibold">{departmentToDelete?.departmentName}</span>? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleDeleteDepartment}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
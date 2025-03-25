"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Loader2, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { debounce } from "lodash"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { TeachersExcelUploadModal } from "./Add-Teachers/excellUpload"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddTeacherModal from "./Add-Teachers/AddTeachers"
import { toast } from "react-toastify"

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  gender: string
  address: string
  qualification: string
  profilePhoto?: string
}

export default function TeachersTable() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([])
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false)

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true) 
      console.log(departmentFilter)
      const url =
        departmentFilter === "all"
          ? `${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers` 
          : `${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers?department=${departmentFilter}`
      const response = await axios.get(url)
      setTeachers(response.data.data.reverse())
      console.log(response)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load teachers")
    } finally {
      setLoading(false)
    }
  }, [departmentFilter])

  const fetchDepartments = async () => {
    try {
      setIsDepartmentsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/department`)
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast.error("Failed to load departments")
    } finally {
      setIsDepartmentsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
    fetchDepartments()
  }, [fetchTeachers])

  const handleDeleteTeacher = async (id: string) => {
    try {
      setDeleteLoading(id)
      await axios.delete(`${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers/${id}`)
      toast.success("Teacher deleted successfully")
      fetchTeachers()
    } catch (error) {
      console.error("Error deleting teacher:", error)
      toast.error("Failed to delete teacher")
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTeacher(null)
  }

  const fetchTeacherByEmail = useCallback(
    debounce(async (email: any) => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers?email=${email}`)
        console.log("response", response)
        setTeachers(response.data.data || [])
        setCurrentPage(response.data.currentPage || 1)
      } catch (error) {
        console.error("Error fetching teacher data by email:", error)
      } finally {
        setLoading(false)
      }
    }, 500),
    [],
  )

  const pageCount = Math.ceil(teachers.length / 10)
  const currentTeachers = teachers.slice((currentPage - 1) * 10, currentPage * 10)

  const departmentsArray = Array.from(new Set(teachers.map((teacher) => teacher.department))).filter(Boolean)

  const isValidPhotoUrl = (url?: string) => {
    return url && url.startsWith("https")
  }

  return (
    <div className="container mx-auto py-10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Button>
          <Button onClick={() => setOpen(true)} className="bg-black text-white hover:bg-gray-800">
            <FileText className="mr-2 h-4 w-4" /> Import Teachers
          </Button>
          <TeachersExcelUploadModal
            open={open}
            onClose={() => setOpen(false)}
            onOpenChange={setOpen}
            refetch={fetchTeachers}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search teachers by email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            fetchTeacherByEmail(e.target.value)
          }}
          className="max-w-sm"
        />
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {isDepartmentsLoading ? (
              <SelectItem value="ok" disabled>
                Loading departments...
              </SelectItem>
            ) : departments.length > 0 ? (
              departments.map((dept) => (
                <SelectItem key={dept._id} value={dept.departmentName}>
                  {dept.departmentName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no" disabled>
                No departments found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Photo</TableHead>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[120px]">First Name</TableHead>
                  <TableHead className="min-w-[120px]">Last Name</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[150px]">Phone</TableHead>
                  <TableHead className="min-w-[120px]">Department</TableHead>
                  <TableHead className="min-w-[100px]">Gender</TableHead>
                  <TableHead className="min-w-[150px]">Address</TableHead>
                  <TableHead className="min-w-[150px]">Qualification</TableHead>
                  <TableHead className="w-[80px]">Edit</TableHead>
                  <TableHead className="w-[80px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTeachers.length > 0 ? (
                  currentTeachers.map((teacher, index) => (
                    <TableRow key={teacher._id}>
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                          {isValidPhotoUrl(teacher.profilePhoto) ? (
                            <img
                              src={teacher.profilePhoto || "/placeholder.svg"}
                              alt={`${teacher.firstName} ${teacher.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{teacher._id}</TableCell>
                      <TableCell>{teacher.firstName}</TableCell>
                      <TableCell>{teacher.lastName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{teacher.email}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>
                        {departments.find((dept) => dept._id === teacher.department)?.name || teacher.department}
                      </TableCell>
                      <TableCell>{teacher.gender}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{teacher.address}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{teacher.qualification}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditTeacher(teacher)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          disabled={deleteLoading === teacher._id}
                        >
                          {deleteLoading === teacher._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      No teachers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {teachers.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, teachers.length)} of{" "}
                {teachers.length} teachers
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  {currentPage} of {pageCount || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount || pageCount === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        teacherData={selectedTeacher}
        onSuccess={fetchTeachers}
      />
    </div>
  )
}


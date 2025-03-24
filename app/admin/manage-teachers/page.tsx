"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Loader2 , FileText } from 'lucide-react'
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

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers`)
      setTeachers(response.data.data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load teachers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

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

  // const fetchTeacherByEmail = useCallback(
  //    debounce(async (email: any) => {
  //      try {
  //       setLoading(true)
  //        const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers?email=${email}`)
  //        console.log("response", response)
  //        setTeachers(response.data.data || [])
  //       //  setTotalPages(response.data.totalPages || 0)
  //       //  setTotalRecords(response.data.totalRecordsCount || 0)
  //        setCurrentPage(response.data.currentPage || 1)
  //       //  setLimit(response.data.limit || 10)
  //      } catch (error) {
  //        console.error("Error fetching student data by roll number:", error)
  //      } finally {
  //       setLoading(false)
  //      }
  //    }, 500)
  //    [],
  //  )

  const fetchTeacherByEmail = useCallback(
    debounce(async (email: any) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers?email=${email}`
        );
        console.log("response", response);
        setTeachers(response.data.data || []);
        setCurrentPage(response.data.currentPage || 1);
      } catch (error) {
        console.error("Error fetching teacher data by email:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [] // Corrected dependency array placement
  );
  

  const pageCount = Math.ceil(teachers.length / 10)
  const currentTeachers = teachers.slice((currentPage - 1) * 10, currentPage * 10)

  const departments = Array.from(new Set(teachers.map(teacher => teacher.department))).filter(Boolean)

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
    <TeachersExcelUploadModal open={open} onClose={() => setOpen(false)} onOpenChange={setOpen} refetch={fetchTeachers} />
                  
                  </div>

      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search teachers..."
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
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
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
                      <TableCell>{teacher._id}</TableCell>
                      <TableCell>{teacher.firstName}</TableCell>
                      <TableCell>{teacher.lastName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{teacher.email}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell>{teacher.gender}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{teacher.address}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{teacher.qualification}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditTeacher(teacher)}
                        >
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
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
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

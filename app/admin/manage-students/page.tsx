"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Copy, Check, Loader2, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"
import { ExcelUploadModal } from "./Add-students/excellUpload"
import { toast } from "react-toastify"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import StudentGuardianModal from "./Add-students/AddStudents"
import axios from "axios"

export default function StudentsTable() {
  const [students, setStudents] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  const fetchStudentData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/student`)
      console.log("response", response)
      setStudents(response.data.data || [])
      setTotalPages(response.data.totalPages || 0)
      setTotalRecords(response.data.totalRecordsCount || 0)
      setCurrentPage(response.data.currentPage || 1)
      setLimit(response.data.limit || 10)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching student data:", error)
      setIsLoading(false)
    }
  }, [])
  const fetchStudentDataBystudentId = useCallback(
    debounce(async (studentId: any) => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/student?studentId=${studentId}`)
        console.log("response", response)
        setStudents(response.data.data || [])
        setTotalPages(response.data.totalPages || 0)
        setTotalRecords(response.data.totalRecordsCount || 0)
        setCurrentPage(response.data.currentPage || 1)
        setLimit(response.data.limit || 10)
      } catch (error) {
        console.error("Error fetching student data by Student Id:", error)
      } finally {
        setIsLoading(false)
      }
    }, 500),
    [],
  )

  useEffect(() => {
    fetchStudentData(currentPage)
  }, [currentPage, fetchStudentData])

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage)
  }

  const getTableHeaders = () => {
    if (students.length === 0) return []
    const baseHeaders = Object.keys(students[0]).filter((key) => key !== "__v" && key !== "_id" && key !== "guardian")
    return [...baseHeaders, "Guardian Name", "Guardian Email", "Guardian Phone", "Guardian Password"]
  }

  const formatDate = (dateString: any): string => {
    return new Date(dateString).toISOString().slice(0, 10)
  }

  const formatPassword = (password: any) => {
    return password.slice(0, 6) + "..."
  }

  const copyPassword = (password: any, id: any) => {
    navigator.clipboard.writeText(password)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const renderCellContent = (student: any, key: any) => {
    if (key === "profilePhoto") {
      if (student[key] && student[key].startsWith("https")) {
        return (
          <div className="flex items-center justify-center">
            <img src={student[key] || "/placeholder.svg"} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
          </div>
        )
      } else {
        return (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        )
      }
    }
    if (key === "createdAt" || key === "updatedAt") {
      return formatDate(student[key])
    }

    if (key === "password") {
      return (
        <div className="flex items-center">
          <span>{formatPassword(student[key])}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPassword(student[key], student._id)}
                  className="ml-2"
                >
                  {copiedId === student._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copiedId === student._id ? "Copied!" : "Copy password"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }

    if (key.startsWith("Guardian")) {
      const guardianKey = key.split(" ")[1].toLowerCase()

      const actualKey =
        guardianKey === "email"
          ? "guardianEmail"
          : guardianKey === "phone"
            ? "guardianPhone"
            : guardianKey === "name"
              ? "guardianName"
              : guardianKey === "password"
                ? "password"
                : `guardian${guardianKey.charAt(0).toUpperCase() + guardianKey.slice(1)}`

      return student.guardian && student.guardian[actualKey]
        ? actualKey === "password"
          ? formatPassword(student.guardian[actualKey])
          : student.guardian[actualKey]
        : "N/A"
    }

    if (typeof student[key] === "object" && student[key] !== null) {
      return "Object"
    }
    if (typeof student[key] === "boolean") {
      if (student[key] === true) {
        return "Yes"
      } else if (student[key] === false) {
        return "No"
      }
    }
    return String(student[key] || "")
  }
  const handleDelete = async (id: any) => {
    setIsLoading(true)

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_SRS_SERVER}/student/${id}`)
    console.log("response", response)
    toast.success("Student Deleted successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    await fetchStudentData()
    setIsLoading(false)
  }
  return (
    <div className="container mx-auto py-10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingStudent(null)
              setIsModalOpen(true)
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
          <Button onClick={() => setOpen(true)} className="bg-black text-white hover:bg-gray-800">
            <FileText className="mr-2 h-4 w-4" /> Import Students
          </Button>

          <ExcelUploadModal
            open={open}
            onClose={() => setOpen(false)}
            onOpenChange={setOpen}
            refetch={fetchStudentData}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            fetchStudentDataBystudentId(e.target.value)
          }}
          className="max-w-sm"
        />
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {[9, 10, 11, 12].map((classNum) => (
              <SelectItem key={classNum} value={classNum.toString()}>
                Class {classNum}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="border-gray-900">
            <Loader2 className="animate-spin" />
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-10">No students found</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {getTableHeaders().map((header) => (
                  <TableHead key={header} className={header === "guardian" ? "" : "whitespace-nowrap"}>
                    {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, " $1")}
                  </TableHead>
                ))}
                <TableHead className="whitespace-nowrap">Edit</TableHead>
                <TableHead className="whitespace-nowrap">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  {getTableHeaders().map((key) => (
                    <TableCell key={key} className="whitespace-nowrap">
                      {renderCellContent(student, key)}
                    </TableCell>
                  ))}
                  <TableCell className="whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingStudent(student)
                        setIsModalOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button onClick={() => handleDelete(student._id)} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords}{" "}
          students
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <StudentGuardianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentData={editingStudent}
        handleDone={fetchStudentData}
      />
    </div>
  )
}


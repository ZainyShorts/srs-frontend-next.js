"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [editingStudent, setEditingStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  const fetchStudentData = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/student`) 
        console.log('response',response);
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
    },
    [limit, searchTerm, classFilter],
  )

  useEffect(() => {
    fetchStudentData(currentPage)
  }, [currentPage, fetchStudentData])

  const handlePageChange = (newPage : any) => {
    setCurrentPage(newPage)
  }

  const getTableHeaders = () => {
    if (students.length === 0) return []
    return Object.keys(students[0]).filter((key) => key !== "__v" && key !== "_id")
  }

  const formatDate = (dateString: any): string => {
    return new Date(dateString).toISOString().slice(0, 10);
  };
  

  const formatPassword = (password : any) => {
    return password.slice(0, 6) + "..."
  }

  const copyPassword = (password : any, id : any) => {
    navigator.clipboard.writeText(password)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="container mx-auto py-10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button 
          onClick={() => {
            setEditingStudent(null)
            setIsModalOpen(true)
          }} 
          className="bg-black text-white hover:bg-gray-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-10">No students found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {getTableHeaders().map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">
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
                      {key === "createdAt" || key === "updatedAt" ? (
                        formatDate(student[key])
                      ) : key === "password" ? (
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
                                  {copiedId === student._id ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{copiedId === student._id ? "Copied!" : "Copy password"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        student[key]
                      )}
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
                    <Button variant="ghost" size="sm">
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
      />
    </div>
  )
}

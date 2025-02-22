"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddTeacherModal from "./Add-Teachers/AddTeachers"

// Dummy data for teachers
const dummyTeachers = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    firstName: `Teacher${i + 1}`,
    lastName: `Lastname${i + 1}`,
    email: `teacher${i + 1}@school.com`,
    phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    department: ["Mathematics", "Science", "English", "History"][Math.floor(Math.random() * 4)],
    gender: i % 2 === 0 ? "Male" : "Female",
  }))

export default function TeachersTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTeachers = dummyTeachers.filter(
    (teacher) =>
      (teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === "all" || teacher.department === departmentFilter),
  )

  const pageCount = Math.ceil(filteredTeachers.length / 10)
  const currentTeachers = filteredTeachers.slice((currentPage - 1) * 10, currentPage * 10)

  return (
    <div className="container mx-auto py-10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="History">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTeachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.id}</TableCell>
              <TableCell>{teacher.firstName}</TableCell>
              <TableCell>{teacher.lastName}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.phone}</TableCell>
              <TableCell>{teacher.department}</TableCell>
              <TableCell>{teacher.gender}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredTeachers.length)} of{" "}
          {filteredTeachers.length} teachers
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
            {currentPage} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddTeacherModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}


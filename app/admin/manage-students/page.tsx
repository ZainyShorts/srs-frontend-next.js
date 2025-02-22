"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddStudentModal from "./Add-students/AddStudents"

// Replace the dummy data generation
const dummyStudents = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    firstName: `Student${i + 1}`,
    lastName: `Lastname${i + 1}`,
    rollNo: Math.floor(Math.random() * 100) + 1,
    class: Math.floor(Math.random() * 4) + 9,
    section: String.fromCharCode(65 + Math.floor(Math.random() * 3)), // A, B, or C
    gender: i % 2 === 0 ? "Male" : "Female",
    dob: `200${Math.floor(i / 2) + 1}-01-01`,
  }))

export default function StudentsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  // Replace gradeFilter with classFilter
  const [classFilter, setClassFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update the filteredStudents function
  const filteredStudents = dummyStudents.filter(
    (student) =>
      (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toString().includes(searchTerm)) &&
      (classFilter === "all" || student.class.toString() === classFilter),
  )

  const pageCount = Math.ceil(filteredStudents.length / 10)
  const currentStudents = filteredStudents.slice((currentPage - 1) * 10, currentPage * 10)

  return (
    <div className="container mx-auto py-10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white hover:bg-gray-800">
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
        {/* Update the Select component for filtering */}
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

      <Table>
        {/* Update the Table header */}
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {/* Update the Table body */}
        <TableBody>
          {currentStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.rollNo}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.lastName}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.gender}</TableCell>
              <TableCell>{student.dob}</TableCell>
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
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredStudents.length)} of{" "}
          {filteredStudents.length} students
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

      <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}


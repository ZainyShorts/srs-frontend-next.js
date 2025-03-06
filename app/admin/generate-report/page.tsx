"use client"

import { useState } from "react"
import { Download, FileText, Filter, Printer, Search } from 'lucide-react'
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import ExportModal from "./exportModal"

interface Guardian {
  _id: string
  guardianName: string
  guardianEmail: string
  guardianPhone: string
  guardianRelation: string
  guardianProfession: string
}

interface Student {
  _id: string
  rollNo: string
  firstName: string
  lastName: string
  class: string
  section: string
  gender: string
  dob: string
  email: string
  phone: string
  address: string
  enrollDate: string
  expectedGraduation: string
  guardian: Guardian
  profilePhoto: string
}

interface ApiResponse {
  data: Student[]
  totalPages: number
  totalRecordsCount: number
  currentPage: number
  limit: number
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>("student")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [gradeLevel, setGradeLevel] = useState<string>("")

  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    totalRecords: 0,
    limit: 10,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [hasAppliedFilters, setHasAppliedFilters] = useState<boolean>(false)

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)

  const buildQueryParams = (customLimit?: number) => {
    const params = new URLSearchParams()

    if (gradeLevel) {
      params.append("className", gradeLevel)
    }

    if (startDate) {
      params.append("startDate", startDate)
    }

    if (endDate) {
      params.append("endDate", endDate)
    }

    if (customLimit) {
      params.append("limit", customLimit.toString())
    }

    return params.toString()
  }

  const fetchStudents = async () => {
    if (reportType !== "student" || !gradeLevel) return

    setLoading(true)
    setError(null)

    try {
      const queryParams = buildQueryParams()
      const response = await fetch(`http://213.210.37.77:3014/student?${queryParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }

      const data: ApiResponse = await response.json()

      setStudents(data.data)
      setPagination({
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        totalRecords: data.totalRecordsCount,
        limit: data.limit,
      })
      setHasAppliedFilters(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (limit: number) => {
    if (reportType !== "student" || !gradeLevel) {
      throw new Error("Please select report type and grade level")
    }

    const queryParams = buildQueryParams(limit)
    const response = await fetch(`http://213.210.37.77:3014/student?${queryParams}`)

    if (!response.ok) {
      throw new Error("Failed to export students")
    }

    const data: ApiResponse = await response.json()

    // Transform data for export
    return data.data.map((student) => ({
      "Roll No": student.rollNo,
      Name: `${student.firstName} ${student.lastName}`,
      Class: student.class,
      Section: student.section,
      Gender: student.gender,
      Email: student.email,
      Phone: student.phone,
      "Enroll Date": formatDate(student.enrollDate),
      "Guardian Name": student.guardian.guardianName,
      "Guardian Relation": student.guardian.guardianRelation,
      "Guardian Phone": student.guardian.guardianPhone,
      "Guardian Email": student.guardian.guardianEmail,
      Address: student.address,
      "Expected Graduation": formatDate(student.expectedGraduation),
    }))
  }

  const handleApplyFilters = () => {
    fetchStudents()
  }

  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.rollNo.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
            <p className="text-gray-500">Create and export detailed academic reports.</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="h-10">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              className="h-10 bg-black text-white hover:bg-gray-800"
              onClick={() => setIsExportModalOpen(true)}
              disabled={!hasAppliedFilters || students.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Filters */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid gap-4">
                  <Input
                    type="date"
                    className="border-gray-200"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    type="date"
                    className="border-gray-200"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={handleApplyFilters}
                disabled={loading || (reportType === "student" && !gradeLevel)}
              >
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Preview</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search in preview..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={students.length === 0}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                  <p className="text-red-600">{error}</p>
                  <Button variant="outline" className="mt-4" onClick={handleApplyFilters}>
                    Try Again
                  </Button>
                </div>
              ) : !hasAppliedFilters ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8">
                  <div className="mb-6 text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-semibold">Select Filters to Generate Report</h3>
                    <p className="text-sm text-gray-500">
                      Choose your report type and filters to preview the report here.
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    <h3 className="text-lg font-semibold">Loading Report Data</h3>
                    <p className="text-sm text-gray-500">Please wait while we fetch the report data...</p>
                  </div>
                </div>
              ) : students.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <div className="mb-6">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-semibold">No Students Found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters to find students.</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] whitespace-nowrap">Roll No</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Name</TableHead>
                          <TableHead className="w-[80px] whitespace-nowrap">Class</TableHead>
                          <TableHead className="w-[80px] whitespace-nowrap">Section</TableHead>
                          <TableHead className="w-[100px] whitespace-nowrap">Gender</TableHead>
                          <TableHead className="w-[200px] whitespace-nowrap">Email</TableHead>
                          <TableHead className="w-[120px] whitespace-nowrap">Phone</TableHead>
                          <TableHead className="w-[120px] whitespace-nowrap">Enroll Date</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Guardian Name</TableHead>
                          <TableHead className="w-[120px] whitespace-nowrap">Guardian Relation</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Guardian Phone</TableHead>
                          <TableHead className="w-[200px] whitespace-nowrap">Guardian Email</TableHead>
                          <TableHead className="w-[150px] whitespace-nowrap">Guardian Profession</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell className="font-medium whitespace-nowrap">{student.rollNo}</TableCell>
                            <TableCell className="whitespace-nowrap">{`${student.firstName} ${student.lastName}`}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.class}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.section}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.gender}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.email}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.phone}</TableCell>
                            <TableCell className="whitespace-nowrap">{formatDate(student.enrollDate)}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.guardian.guardianName}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.guardian.guardianRelation}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.guardian.guardianPhone}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.guardian.guardianEmail}</TableCell>
                            <TableCell className="whitespace-nowrap">{student.guardian.guardianProfession}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="py-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          {Array.from({ length: pagination.totalPages }).map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink href="#" isActive={pagination.currentPage === i + 1}>
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}

                  <div className="p-4 text-sm text-gray-500 border-t">
                    Showing {filteredStudents.length} of {pagination.totalRecords} students
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={exportData}
        currentFilters={{
          reportType,
          gradeLevel,
          startDate,
          endDate,
        }}
      />
    </div>
  )
}

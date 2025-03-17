"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckIcon, Loader2, Plus, Trash2 } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Department {
  _id: string
  departmentName: string
}

interface Course {
  _id: string
  courseName: string
  courseCode: string
  departmentId?: {
    departmentName: any
    _id?: string
  }
  Prerequisites: string
  description: string
  createdAt: string
}

export default function CoursesPage() {
  // State for courses and departments
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    departmentId: "",
    Prerequisites: "",
    description: "",
  })

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/course`)
      console.log("res", response)
      setCourses(response.data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch departments
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

  // Initial data fetch
  useEffect(() => {
    fetchCourses()
    fetchDepartments()
  }, [])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select change
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, departmentId: value }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      courseName: "",
      courseCode: "",
      departmentId: "",
      Prerequisites: "",
      description: "",
    })
  }

  // Open modal
  const openModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  // Open delete confirmation modal
  const openDeleteModal = (course: Course) => {
    setCourseToDelete(course)
    setIsDeleteModalOpen(true)
  }

  // Handle delete course
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      setIsDeleting(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_SRS_SERVER}/course/${courseToDelete._id}`)
      toast.success("Course deleted successfully!")
      setIsDeleteModalOpen(false)
      setCourseToDelete(null)
      fetchCourses() // Refresh courses list
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.courseName || !formData.courseCode || !formData.departmentId || !formData.description) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(`${process.env.NEXT_PUBLIC_SRS_SERVER}/course/add`, formData)
      toast.success("Course added successfully!")
      setIsModalOpen(false)
      resetForm()
      fetchCourses() // Refresh courses list
    } catch (error) {
      console.error("Error adding course:", error)
      toast.error("Failed to add course")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Find department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((dept) => dept._id === departmentId)
    return department ? department.departmentName : "Unknown Department"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">Manage your school's course catalog</p>
        </div>
        <Button onClick={openModal} className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      {/* Courses List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">No courses found</h3>
          <p className="text-gray-500 mt-1">Get started by adding your first course</p>
          <Button onClick={openModal} className="mt-4 bg-black text-white hover:bg-black/90">
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{course.courseName}</CardTitle>
                    <CardDescription className="mt-1">Code: {course.courseCode}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => openDeleteModal(course)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Department:</span>{" "}
                    {course.departmentId?.departmentName || getDepartmentName(course.departmentId?._id || "")}
                  </div>
                  {course.Prerequisites && (
                    <div className="text-sm">
                      <span className="font-medium">Prerequisites:</span> {course.Prerequisites}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 line-clamp-2 mt-1">{course.description}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Added on {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Enter the details for the new course you want to add to the curriculum.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName" className="font-medium">
                    Course Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="courseName"
                    placeholder="Introduction to Computer Science"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseCode" className="font-medium">
                    Course Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="courseCode"
                    placeholder="CS101"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="font-medium">
                  Department <span className="text-red-500">*</span>
                </Label>
                {isDepartmentsLoading ? (
                  <div className="flex items-center space-x-2 h-10 px-3 border rounded-md border-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Loading departments...</span>
                  </div>
                ) : (
                  <Select onValueChange={handleSelectChange} value={formData.departmentId}>
                    <SelectTrigger id="department" className="border-gray-300 focus:border-black focus:ring-black">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Prerequisites" className="font-medium">
                  Prerequisites
                </Label>
                <Input
                  id="Prerequisites"
                  placeholder="e.g., MATH101, CS100 (or 'None')"
                  value={formData.Prerequisites}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium">
                  Course Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the course content, objectives, and learning outcomes."
                  className="min-h-[100px] border-gray-300 focus:border-black focus:ring-black"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-black/90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Course...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" /> Add Course
                  </>
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
              Are you sure you want to delete the course{" "}
              <span className="font-semibold">{courseToDelete?.courseName}</span>? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


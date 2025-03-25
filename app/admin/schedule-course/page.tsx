"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckIcon, Loader2, Plus, Trash2, Calendar, Clock, AlertCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import { activities } from "@/lib/activities" 
import { addActivity } from "@/lib/actitivityFunctions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Add these imports at the top
import { useRouter, useSearchParams } from "next/navigation"

interface Course {
  _id: string
  courseName: string
  courseCode: string
  departmentId?: {
    departmentName: string
  }
}

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  department: string
  email: string
}

interface DaySchedule {
  startTime: string
  endTime: string
  date: string
}

interface Schedule {
  _id: string
  courseId: {
    _id: string
    courseName: string
    courseCode: string
  }
  className: string
  section: string
  teacherId: {
    _id: string
    firstName: string
    lastName: string
    department: string
  }
  note: string
  dayOfWeek: DaySchedule[]
  createdAt: string
  updatedAt: string
}

interface FormErrors {
  courseId?: boolean
  className?: boolean
  section?: boolean
  teacherId?: boolean
  dayOfWeek?: boolean
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const timeOptions = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
]

export default function ScheduleCoursePage() {
  // Data states
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCoursesLoading, setIsCoursesLoading] = useState(true)
  const [isTeachersLoading, setIsTeachersLoading] = useState(true)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    className: "",
    section: "",
    teacherId: "",
    note: "",
    dayOfWeek: [] as DaySchedule[],
  })

  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Selected day for adding to schedule
  const [selectedDay, setSelectedDay] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  // New state for delete confirmation
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Add these state variables inside the component, after the existing state declarations
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filterClass, setFilterClass] = useState<string>(searchParams.get("class") || "")
  const [filterSection, setFilterSection] = useState<string>(searchParams.get("section") || "")

  // Fetch data on component mount
  useEffect(() => {
    fetchSchedules()
    fetchCourses()
    fetchTeachers()
  }, [])

  // Validate form when data changes
  useEffect(() => {
    if (formSubmitted) {
      validateForm()
    }
  }, [formData, formSubmitted])

  // Replace the fetchSchedules function with this updated version
  const fetchSchedules = async () => {
    try {
      setIsLoading(true)

      // Build query parameters based on filters
      let url = `${process.env.NEXT_PUBLIC_SRS_SERVER}/schedule`
      const params = new URLSearchParams()

      if (filterClass) {
        params.append("class", filterClass)
      }

      if (filterSection) {
        params.append("section", filterSection)
      }

      // Add query parameters if any exist
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await axios.get(url)
      setSchedules(response.data.data || [])
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast.error("Failed to load schedules")
    } finally {
      setIsLoading(false)
    }
  }

  // Add this effect to refetch when filters change
  useEffect(() => {
    fetchSchedules()

    // Update URL with current filters
    const params = new URLSearchParams()
    if (filterClass) params.set("class", filterClass)
    if (filterSection) params.set("section", filterSection)

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname

    window.history.pushState({}, "", newUrl)
  }, [filterClass, filterSection])

  // Add these handler functions
  const handleClassFilterChange = (value: string) => {
    setFilterClass(value)
  }

  const handleSectionFilterChange = (value: string) => {
    setFilterSection(value)
  }

  // Add this function to clear filters
  const clearFilters = () => {
    setFilterClass("")
    setFilterSection("")
  }

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setIsCoursesLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/course?active=true`)
      setCourses(response.data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setIsCoursesLoading(false)
    }
  }

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      setIsTeachersLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SRS_SERVER}/teachers`)
      setTeachers(response.data.data || [])
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load teachers")
    } finally {
      setIsTeachersLoading(false)
    }
  }

  // Open modal and reset form
  const openModal = () => {
    setFormData({
      courseId: "",
      className: "",
      section: "",
      teacherId: "",
      note: "",
      dayOfWeek: [],
    })
    setSelectedDay("")
    setStartTime("")
    setEndTime("")
    setErrors({})
    setFormSubmitted(false)
    setIsModalOpen(true)
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.courseId) newErrors.courseId = true
    if (!formData.className) newErrors.className = true
    if (!formData.section) newErrors.section = true
    if (!formData.teacherId) newErrors.teacherId = true
    if (formData.dayOfWeek.length === 0) newErrors.dayOfWeek = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add day schedule to the form
  const addDaySchedule = () => {
    if (!selectedDay || !startTime || !endTime) {
      toast.error("Please select day, start time, and end time")
      return
    }

    // Check if the day already exists
    const dayExists = formData.dayOfWeek.some((day) => day.date === selectedDay)
    if (dayExists) {
      toast.error(`Schedule for ${selectedDay} already exists. Remove it first to change.`)
      return
    }

    // Validate that end time is after start time
    const startHour = Number.parseInt(startTime.split(":")[0])
    const startMinute = Number.parseInt(startTime.split(":")[1].split(" ")[0])
    const startPeriod = startTime.split(" ")[1]

    const endHour = Number.parseInt(endTime.split(":")[0])
    const endMinute = Number.parseInt(endTime.split(":")[1].split(" ")[0])
    const endPeriod = endTime.split(" ")[1]

    let startTimeValue = startHour
    if (startPeriod === "PM" && startHour !== 12) startTimeValue += 12
    if (startPeriod === "AM" && startHour === 12) startTimeValue = 0

    let endTimeValue = endHour
    if (endPeriod === "PM" && endHour !== 12) endTimeValue += 12
    if (endPeriod === "AM" && endHour === 12) endTimeValue = 0

    if (endTimeValue < startTimeValue || (endTimeValue === startTimeValue && endMinute <= startMinute)) {
      toast.error("End time must be after start time")
      return
    }

    const newDaySchedule: DaySchedule = {
      date: selectedDay,
      startTime: startTime,
      endTime: endTime,
    }

    setFormData((prev) => ({
      ...prev,
      dayOfWeek: [...prev.dayOfWeek, newDaySchedule],
    }))

    // Reset selection
    setSelectedDay("")
    setStartTime("")
    setEndTime("")
  }

  // Remove day schedule from the form
  const removeDaySchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.filter((_, i) => i !== index),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Validation
    if (!validateForm()) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(`${process.env.NEXT_PUBLIC_SRS_SERVER}/schedule/add`, formData)
      toast.success("Course scheduled successfully!")   
      console.log('day of week', formData.dayOfWeek)
       const message = activities.admin.scheduleClass.description.replace('{className}', formData.className)       ;
      
                 const activity = { 
                                title : activities.admin.scheduleClass.action, 
                                subtitle : message, 
                                performBy : "Admin"
                               }; 
                              const act =  await addActivity(activity);  
      setIsModalOpen(false)

      // Reset form
      setFormData({
        courseId: "",
        className: "",
        section: "",
        teacherId: "",
        note: "",
        dayOfWeek: [],
      })
      setFormSubmitted(false)
      setErrors({})

      // Refresh schedules
      fetchSchedules()
    } catch (error) {
      console.error("Error scheduling course:", error)
      toast.error("Failed to schedule course")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (schedule: Schedule) => {
    setScheduleToDelete(schedule)
    setIsDeleteModalOpen(true)
  }

  // Handle delete schedule
  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return

    try {
      setIsDeleting(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_SRS_SERVER}/schedule/${scheduleToDelete._id}`)
      toast.success("Schedule deleted successfully!")   
      const message = activities.admin.removeScheduleClass.description.replace('{className}', formData.className);
      const activity = { 
                     title : activities.admin.removeScheduleClass.action, 
                     subtitle : message, 
                     performBy : "Admin"
                    }; 
                   const act =  await addActivity(activity);  
      setIsDeleteModalOpen(false) 

      setScheduleToDelete(null)
      fetchSchedules() // Refresh schedules list
    } catch (error) {
      console.error("Error deleting schedule:", error)
      toast.error("Failed to delete schedule")
    } finally {
      setIsDeleting(false)
    }
  }

  // Get day color based on day name
  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      Monday: "bg-blue-100 text-blue-800 border-blue-200",
      Tuesday: "bg-purple-100 text-purple-800 border-purple-200",
      Wednesday: "bg-green-100 text-green-800 border-green-200",
      Thursday: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Friday: "bg-red-100 text-red-800 border-red-200",
      Saturday: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Sunday: "bg-pink-100 text-pink-800 border-pink-200",
    }

    return colors[day] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Course Schedules
          </h1>
          <p className="text-muted-foreground mt-1">View and manage your course schedules</p>
        </div>
        <Button onClick={openModal} className="bg-black text-white hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" /> Schedule Class
        </Button>
      </div>

      {/* Add this JSX right after the header section and before the schedules list */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4 space-y-2">
            <Label htmlFor="filterClass" className="font-medium">
              Filter by Class
            </Label>
            <Select onValueChange={handleClassFilterChange} value={filterClass}>
              <SelectTrigger id="filterClass" className="border-gray-300 focus:border-black focus:ring-black">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <SelectItem key={`filter-class-${num}`} value={num.toString()}>
                    Class {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4 space-y-2">
            <Label htmlFor="filterSection" className="font-medium">
              Filter by Section
            </Label>
            <Select onValueChange={handleSectionFilterChange} value={filterSection}>
              <SelectTrigger id="filterSection" className="border-gray-300 focus:border-black focus:ring-black">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
                  <SelectItem key={`filter-section-${letter}`} value={letter}>
                    Section {letter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-auto">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full md:w-auto"
              disabled={!filterClass && !filterSection}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {(filterClass || filterSection) && (
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Active Filters:</span>
            {filterClass && (
              <Badge variant="secondary" className="mr-2">
                Class: {filterClass}
              </Badge>
            )}
            {filterSection && <Badge variant="secondary">Section: {filterSection}</Badge>}
          </div>
        )}
      </div>

      {/* Schedules List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading schedules...</span>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            {filterClass || filterSection ? "No schedules found matching your filters" : "No schedules found"}
          </h3>
          <p className="text-gray-500 mt-1">
            {filterClass || filterSection
              ? "Try changing your filter criteria or clear filters"
              : "Get started by scheduling your first class"}
          </p>
          {filterClass || filterSection ? (
            <Button onClick={clearFilters} className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
              Clear Filters
            </Button>
          ) : (
            <Button onClick={openModal} className="mt-4 bg-black text-white hover:bg-black/90">
              <Plus className="mr-2 h-4 w-4" /> Schedule Class
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules?.map((schedule) => (
            <Card key={schedule._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{schedule?.courseId?.courseCode}</CardTitle>
                    <CardDescription className="mt-1 font-medium text-black">
                      {schedule?.courseId?.courseName}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="mb-1">
                      Class: {schedule.className}
                    </Badge>
                    <Badge variant="outline">Section: {schedule.section}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Instructor:</span>
                    <span>
                      {schedule.teacherId?.firstName} {schedule.teacherId?.lastName}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Schedule:</div>
                    <div className="space-y-2">
                      {schedule.dayOfWeek.map((day, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-md border ${getDayColor(day.date)}`}
                        >
                          <div className="font-medium">{day.date}</div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {day.startTime} - {day.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {schedule.note && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">Notes:</span> {schedule.note}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Created on {new Date(schedule.createdAt).toLocaleDateString()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => openDeleteModal(schedule)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Class Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Class</DialogTitle>
            <DialogDescription>Select a course and set up its schedule for the upcoming term.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="courseSelect" className="font-medium">
                  Select Course <span className="text-red-500">*</span>
                </Label>
                {isCoursesLoading ? (
                  <div className="flex items-center space-x-2 h-10 px-3 border rounded-md border-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Loading courses...</span>
                  </div>
                ) : (
                  <>
                    <Select onValueChange={(value) => handleSelectChange("courseId", value)} value={formData.courseId}>
                      <SelectTrigger
                        id="courseSelect"
                        className={`border-gray-300 focus:border-black focus:ring-black ${errors.courseId ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.courseCode} - {course.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.courseId && (
                      <div className="flex items-center mt-1 text-sm text-red-500">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Course is required
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="className" className="font-medium">
                    Class Name <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("className", value)} value={formData.className}>
                    <SelectTrigger
                      id="className"
                      className={`border-gray-300 focus:border-black focus:ring-black ${errors.className ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <SelectItem key={`class-${num}`} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.className && (
                    <div className="flex items-center mt-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Class name is required
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section" className="font-medium">
                    Section <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("section", value)} value={formData.section}>
                    <SelectTrigger
                      id="section"
                      className={`border-gray-300 focus:border-black focus:ring-black ${errors.section ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
                        <SelectItem key={`section-${letter}`} value={letter}>
                          {letter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.section && (
                    <div className="flex items-center mt-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Section is required
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor" className="font-medium">
                  Instructor <span className="text-red-500">*</span>
                </Label>
                {isTeachersLoading ? (
                  <div className="flex items-center space-x-2 h-10 px-3 border rounded-md border-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Loading teachers...</span>
                  </div>
                ) : (
                  <>
                    <Select
                      onValueChange={(value) => handleSelectChange("teacherId", value)}
                      value={formData.teacherId}
                    >
                      <SelectTrigger
                        id="instructor"
                        className={`border-gray-300 focus:border-black focus:ring-black ${errors.teacherId ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher._id} value={teacher._id}>
                            {teacher.firstName} {teacher.lastName} ({teacher.department})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teacherId && (
                      <div className="flex items-center mt-1 text-sm text-red-500">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Instructor is required
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={`space-y-4 border rounded-md p-4 bg-gray-50 ${errors.dayOfWeek ? "border-red-500" : ""}`}>
                <div className="font-medium">
                  Class Schedule <span className="text-red-500">*</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add the days and times when this class will meet. You can add multiple days with different time slots.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daySelect" className="text-sm">
                      Day
                    </Label>
                    <Select onValueChange={setSelectedDay} value={selectedDay}>
                      <SelectTrigger id="daySelect" className="border-gray-300 focus:border-black focus:ring-black">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {weekdays.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTimeSelect" className="text-sm">
                      Start Time
                    </Label>
                    <Select onValueChange={setStartTime} value={startTime}>
                      <SelectTrigger
                        id="startTimeSelect"
                        className="border-gray-300 focus:border-black focus:ring-black"
                      >
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTimeSelect" className="text-sm">
                      End Time
                    </Label>
                    <Select onValueChange={setEndTime} value={endTime}>
                      <SelectTrigger id="endTimeSelect" className="border-gray-300 focus:border-black focus:ring-black">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addDaySchedule}
                  variant="outline"
                  className="w-full border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Day to Schedule
                </Button>

                {formData.dayOfWeek.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    <div className="font-medium text-sm">Scheduled Days:</div>
                    <div className="space-y-2">
                      {formData.dayOfWeek.map((day, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border">
                          <div>
                            <span className="font-medium">{day.date}:</span> {day.startTime} - {day.endTime}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeDaySchedule(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  errors.dayOfWeek && (
                    <div className="flex items-center mt-2 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      At least one day schedule is required
                    </div>
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="font-medium">
                  Notes / Special Instructions
                </Label>
                <Textarea
                  id="note"
                  placeholder="Add any special instructions or notes about this course schedule."
                  className="min-h-[100px] border-gray-300 focus:border-black focus:ring-black"
                  value={formData.note}
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
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" /> Schedule Course
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
              Are you sure you want to delete the schedule for{" "}
              <span className="font-semibold">{scheduleToDelete?.courseId?.courseName}</span>? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              type="button"
              e="button"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleDeleteSchedule}
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


"use client"

import { useState } from "react"
import { CalendarIcon, CheckIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Sample course data that would come from the database
const sampleCourses = [
  { id: "CS101", name: "Introduction to Computer Science", department: "Computer Science" },
  { id: "MATH201", name: "Calculus II", department: "Mathematics" },
  { id: "PHYS101", name: "Physics for Scientists", department: "Physics" },
  { id: "BIO150", name: "Introduction to Biology", department: "Biology" },
  { id: "ENG102", name: "Composition and Rhetoric", department: "English" },
]

const timeSlots = [
  "8:00 AM - 9:15 AM",
  "9:30 AM - 10:45 AM",
  "11:00 AM - 12:15 PM",
  "12:30 PM - 1:45 PM",
  "2:00 PM - 3:15 PM",
  "3:30 PM - 4:45 PM",
  "5:00 PM - 6:15 PM",
  "6:30 PM - 7:45 PM",
]

const weekdays = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

export default function ScheduleCoursePage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Course</h1>
        <p className="text-muted-foreground mt-2">Create a new schedule for an existing course</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Schedule Information</CardTitle>
          <CardDescription>Select a course and set up its schedule for the upcoming term.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="courseSelect">
              Select Course <span className="text-destructive">*</span>
            </Label>
            <Select>
              <SelectTrigger id="courseSelect">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {sampleCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.id} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="term">
                Academic Term <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="term">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall2023">Fall 2023</SelectItem>
                  <SelectItem value="spring2024">Spring 2024</SelectItem>
                  <SelectItem value="summer2024">Summer 2024</SelectItem>
                  <SelectItem value="fall2024">Fall 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleType">
                Schedule Type <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="scheduleType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular (Full Semester)</SelectItem>
                  <SelectItem value="intensive">Intensive (8 Weeks)</SelectItem>
                  <SelectItem value="weekend">Weekend Only</SelectItem>
                  <SelectItem value="online">Online / Asynchronous</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <Label>
              Days of Week <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {weekdays.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox id={day.id} />
                  <Label htmlFor={day.id} className="font-normal">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timeSlot">
                Time Slot <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">
                Instructor <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="instructor">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jsmith">Dr. Jane Smith</SelectItem>
                  <SelectItem value="rjohnson">Prof. Robert Johnson</SelectItem>
                  <SelectItem value="mwilliams">Dr. Maria Williams</SelectItem>
                  <SelectItem value="dlee">Prof. David Lee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sci101">Science Building - Room 101</SelectItem>
                  <SelectItem value="sci102">Science Building - Room 102</SelectItem>
                  <SelectItem value="lib201">Library - Room 201</SelectItem>
                  <SelectItem value="eng301">Engineering Building - Room 301</SelectItem>
                  <SelectItem value="art105">Arts Building - Room 105</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxEnrollment">
                Maximum Enrollment <span className="text-destructive">*</span>
              </Label>
              <Input id="maxEnrollment" type="number" placeholder="30" min="1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Special Instructions</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes about this course schedule."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2 rounded-md border p-4">
            <Checkbox id="sendNotification" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="sendNotification" className="font-normal">
                Send notification to students
              </Label>
              <p className="text-sm text-muted-foreground">Notify enrolled students about this new course schedule.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-black text-white hover:bg-black/90">
            <CheckIcon className="mr-2 h-4 w-4" /> Schedule Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


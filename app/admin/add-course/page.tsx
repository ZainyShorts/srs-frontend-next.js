"use client"

import { useState } from "react"
import { CalendarIcon, CheckIcon, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function AddCoursePage() {
  const [startDate, setStartDate] = useState<Date>()

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Add New Course</h1>
        <p className="text-muted-foreground mt-2">Create a new course in the school management system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Enter the details for the new course you want to add to the curriculum.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="courseName">
                Course Name <span className="text-destructive">*</span>
              </Label>
              <Input id="courseName" placeholder="Introduction to Computer Science" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseId">
                Course ID <span className="text-destructive">*</span>
              </Label>
              <Input id="courseId" placeholder="CS101" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="department">
                Department <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computerScience">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">
                Credits <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger id="credits">
                  <SelectValue placeholder="Select credits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Credit</SelectItem>
                  <SelectItem value="2">2 Credits</SelectItem>
                  <SelectItem value="3">3 Credits</SelectItem>
                  <SelectItem value="4">4 Credits</SelectItem>
                  <SelectItem value="5">5 Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="instructor">
                Primary Instructor <span className="text-destructive">*</span>
              </Label>
              <Input id="instructor" placeholder="Dr. Jane Smith" />
            </div>
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
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <InfoIcon className="mr-1 h-3 w-3" />
                Add Multiple
              </Button>
            </div>
            <Input id="prerequisites" placeholder="e.g., MATH101, CS100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Course Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the course content, objectives, and learning outcomes."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-base">Course Status</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="active" name="status" className="h-4 w-4" defaultChecked />
                <Label htmlFor="active" className="font-normal">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="draft" name="status" className="h-4 w-4" />
                <Label htmlFor="draft" className="font-normal">
                  Draft
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-black text-white hover:bg-black/90">
            <CheckIcon className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


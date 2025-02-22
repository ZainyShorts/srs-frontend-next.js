"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Upload, Plus, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const subjects = [
  { id: 1, name: "Mathematics", enrolled: 30 },
  { id: 2, name: "Physics", enrolled: 25 },
  { id: 3, name: "Chemistry", enrolled: 28 },
  { id: 4, name: "Biology", enrolled: 22 },
  { id: 5, name: "Computer Science", enrolled: 35 },
  { id: 6, name: "English Literature", enrolled: 20 },
  { id: 7, name: "History", enrolled: 18 },
  { id: 8, name: "Geography", enrolled: 15 },
  { id: 9, name: "Art", enrolled: 12 },
  { id: 10, name: "Music", enrolled: 10 },
]

export default function ScheduleCourses() {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [enrollmentMethod, setEnrollmentMethod] = useState('')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Course Scheduling</h1>
        
        <Card className="mb-8 bg-gray-50 dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Select Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 bg-gray-50 dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Actions for {selectedSubject}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Enroll Students
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Enroll Students</DialogTitle>
                      <DialogDescription>
                        Choose a method to enroll students in {selectedSubject}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Button onClick={() => setEnrollmentMethod('excel')} className="bg-green-500 hover:bg-green-600 text-white">
                        <Upload className="mr-2 h-4 w-4" /> Upload Excel File
                      </Button>
                      <Button onClick={() => setEnrollmentMethod('manual')} className="bg-purple-500 hover:bg-purple-600 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Enter Manually
                      </Button>
                    </div>
                    {enrollmentMethod === 'excel' && (
                      <Input type="file" accept=".xlsx, .xls" className="mt-4" />
                    )}
                    {enrollmentMethod === 'manual' && (
                      <Input type="text" placeholder="Enter student names (comma-separated)" className="mt-4" />
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Subject
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">All Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white dark:bg-gray-700 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enrolled: {subject.enrolled}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

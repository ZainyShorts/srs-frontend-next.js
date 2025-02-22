"use client"

import { useState } from "react"
import { FileText, BarChart2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"]
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"]

const assignmentData = [
  { id: 1, subject: "Mathematics", title: "Algebra Quiz", submitted: 28, total: 30 },
  { id: 2, subject: "Physics", title: "Newton's Laws Report", submitted: 25, total: 30 },
  { id: 3, subject: "Chemistry", title: "Periodic Table Test", submitted: 27, total: 30 },
  { id: 4, subject: "Biology", title: "Ecosystem Project", submitted: 29, total: 30 },
  { id: 5, subject: "English", title: "Shakespeare Essay", submitted: 26, total: 30 },
]

export default function AssignmentStats() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 9")

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Assignment Statistics</h1>

        <Card className="mb-8 bg-gray-50 dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              Select Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedGrade} defaultValue={selectedGrade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <BarChart2 className="mr-2 h-6 w-6 text-blue-500" />
                Overall Submission Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4 text-blue-500">87%</div>
              <Progress value={87} className="h-2 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">135 out of 150 assignments submitted</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                On-Time Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4 text-green-500">92%</div>
              <Progress value={92} className="h-2 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                124 out of 135 submitted assignments were on time
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              Assignment Submission Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Submission Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentData.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.subject}</TableCell>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.submitted}</TableCell>
                    <TableCell>{assignment.total}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2 w-24 mr-2" />
                        <span>{Math.round((assignment.submitted / assignment.total) * 100)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


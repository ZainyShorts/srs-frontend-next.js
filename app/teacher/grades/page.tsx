"use client"

import * as React from "react"
import { Plus, Save, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const students = [
  { name: "Alice Johnson", id: "10A001", quiz1: 85, midterm: 78, project: 92, final: 88 },
  { name: "Bob Smith", id: "10A002", quiz1: 72, midterm: 80, project: 85, final: 79 },
  { name: "Charlie Brown", id: "10A003", quiz1: 90, midterm: 85, project: 88, final: 91 },
  { name: "Diana Prince", id: "10A004", quiz1: 95, midterm: 92, project: 97, final: 94 },
  { name: "Ethan Hunt", id: "10A005", quiz1: 78, midterm: 75, project: 80, final: 82 },
]

const classes = [
  { value: "math10a", label: "Class 10A Mathematics" },
  { value: "eng10a", label: "Class 10A English" },
  { value: "sci10a", label: "Class 10A Science" },
]

export default function GradesPage() {
  const [selectedClass, setSelectedClass] = React.useState("math10a")
  const [grades, setGrades] = React.useState(students)

  const handleGradeChange = (studentId: string, assessment: string, value: number) => {
    setGrades(grades.map(student => 
      student.id === studentId ? { ...student, [assessment]: value } : student
    ))
  }

  const calculateOverallGrade = (student: typeof students[0]) => {
    return Math.round(
      (student.quiz1 * 0.1 + student.midterm * 0.3 + student.project * 0.2 + student.final * 0.4) * 10
    ) / 10
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Grade Management</h1>

      <div className="flex items-center space-x-4">
        <Label htmlFor="class-select">Select Class</Label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger id="class-select" className="w-[250px]">
            <SelectValue placeholder="Select class..." />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Grade Entry - {classes.find(c => c.value === selectedClass)?.label}</CardTitle>
          <CardDescription>Enter or update student grades</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Student</TableHead>
                <TableHead>ID</TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableHead>
                        Quiz 1 (10%) <HelpCircle className="inline-block w-4 h-4 ml-1" />
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>First quiz of the semester, worth 10% of the total grade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableHead>
                        Midterm (30%) <HelpCircle className="inline-block w-4 h-4 ml-1" />
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Midterm exam, worth 30% of the total grade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableHead>
                        Project (20%) <HelpCircle className="inline-block w-4 h-4 ml-1" />
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Semester-long project, worth 20% of the total grade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableHead>
                        Final Exam (40%) <HelpCircle className="inline-block w-4 h-4 ml-1" />
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Final examination, worth 40% of the total grade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TableHead>Overall Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={student.quiz1} 
                      onChange={(e) => handleGradeChange(student.id, 'quiz1', Number(e.target.value))}
                      className="w-16" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={student.midterm} 
                      onChange={(e) => handleGradeChange(student.id, 'midterm', Number(e.target.value))}
                      className="w-16" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={student.project} 
                      onChange={(e) => handleGradeChange(student.id, 'project', Number(e.target.value))}
                      className="w-16" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={student.final} 
                      onChange={(e) => handleGradeChange(student.id, 'final', Number(e.target.value))}
                      className="w-16" 
                    />
                  </TableCell>
                  <TableCell className="font-bold">
                    {calculateOverallGrade(student)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-between">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Assessment
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Grades
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
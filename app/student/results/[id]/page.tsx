"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Book, Award, FileText, Presentation, Beaker, PenTool } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for grade details
const gradeDetails = {
  id: 1,
  name: "Mathematics",
  grade: "A",
  score: 92,
  components: [
    { name: "Midterm Exam", score: 88, weight: 30, icon: FileText },
    { name: "Final Exam", score: 94, weight: 40, icon: FileText },
    { name: "Quizzes", score: 90, weight: 10, icon: PenTool },
    { name: "Assignments", score: 95, weight: 15, icon: Beaker },
    { name: "Project", score: 98, weight: 5, icon: Presentation },
  ]
}

export default function GradeDetail({ params }: { params: { id: string } }) {
  const subjectId = parseInt(params.id)
  // In a real application, you would fetch the grade details based on the subjectId
  const subject = gradeDetails // Replace with actual data fetching

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 80) return 'text-blue-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/student/results" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Link>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center">
              <Book className="w-8 h-8 mr-3 text-indigo-500" />
              {subject.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl text-gray-600 dark:text-gray-400">Overall Grade</span>
              <span className={`text-4xl font-bold ${getGradeColor(subject.score)}`}>{subject.grade}</span>
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Total Score: <span className="font-semibold">{subject.score}%</span>
            </div>
            <motion.div
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${subject.score}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Grade Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Weighted Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subject.components.map((component, index) => {
                  const Icon = component.icon
                  return (
                    <motion.tr
                      key={component.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium">
                        <Icon className="w-4 h-4 inline-block mr-2" />
                        {component.name}
                      </TableCell>
                      <TableCell className={getGradeColor(component.score)}>
                        {component.score}%
                      </TableCell>
                      <TableCell>{component.weight}%</TableCell>
                      <TableCell className="font-semibold">
                        {(component.score * component.weight / 100).toFixed(2)}
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

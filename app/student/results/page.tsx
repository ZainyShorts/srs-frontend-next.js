"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, ChevronRight, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

const subjects = [
  { id: 1, name: "Mathematics", grade: "A", score: 92 },
  { id: 2, name: "Physics", grade: "B+", score: 87 },
  { id: 3, name: "Computer Science", grade: "A-", score: 89 },
  { id: 4, name: "English Literature", grade: "B", score: 84 },
  { id: 5, name: "Chemistry", grade: "A", score: 95 },
  { id: 6, name: "History", grade: "B+", score: 88 },
]

export default function GradeOverview() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const getGradeColor = (grade: string) => {
    switch(grade[0]) {
      case 'A': return 'text-green-500'
      case 'B': return 'text-blue-500'
      case 'C': return 'text-yellow-500'
      default: return 'text-red-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Grade Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(subject.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Link href={`/student/results/${subject.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Book className="w-5 h-5 mr-2 text-indigo-500" />
                        {subject.name}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                      <span className={`text-2xl font-bold ${getGradeColor(subject.grade)}`}>{subject.grade}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Score</span>
                      <span className="font-semibold">{subject.score}%</span>
                    </div>
                    <motion.div
                      className="h-1 bg-gray-200 mt-2 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredCard === subject.id ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.score}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

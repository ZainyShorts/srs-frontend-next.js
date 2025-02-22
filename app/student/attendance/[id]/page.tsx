"use client"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"  
import { useParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



// Mock attendance records
const attendanceRecords = [
  { date: "2023-05-01", status: "P" },
  { date: "2023-05-03", status: "P" },
  { date: "2023-05-05", status: "A" },
  { date: "2023-05-08", status: "P" },
  { date: "2023-05-10", status: "P" },
  { date: "2023-05-12", status: "P" },
  { date: "2023-05-15", status: "A" },
  { date: "2023-05-17", status: "P" },
  { date: "2023-05-19", status: "P" },
  { date: "2023-05-22", status: "P" },
]

export default function AttendanceDetail() {  
  const { id } = useParams(); 
  const subjects = [
    { id: 1, name: "Mathematics", attendance: 85 },
    { id: 2, name: "Physics", attendance: 92 },
    { id: 3, name: "Computer Science", attendance: 78 },
    { id: 4, name: "English Literature", attendance: 88 },
    { id: 5, name: "Chemistry", attendance: 95 },
    { id: 6, name: "History", attendance: 82 },
  ]

  const subject = subjects[id] || { id: "unknown", name: "Unknown Subject", attendance: 0 }

  const presentDays = attendanceRecords.filter((record) => record.status === "P").length
  const totalDays = attendanceRecords.length
  const attendancePercentage = (presentDays / totalDays) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-indigo-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Link
          href="/student/attendance"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Link>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{subject.name} Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</span>
              <span className="font-semibold">{attendancePercentage.toFixed(2)}%</span>
            </div>
            <Progress
              value={attendancePercentage}
              className="h-2"
              style={{
                background: `linear-gradient(to right, 
                  ${attendancePercentage < 75 ? "#ef4444" : "#22c55e"} ${attendancePercentage}%, 
                  #e5e7eb ${attendancePercentage}%)`,
              }}
            />
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Present: {presentDays} / {totalDays} days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record, index) => (
                  <TableRow
                    key={record.date}
                    as={motion.tr}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell className="font-medium">
                      <Calendar className="w-4 h-4 inline-block mr-2" />
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {record.status === "P" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="w-3 h-3 mr-1" /> Absent
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

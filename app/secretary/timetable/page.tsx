"use client"

import { useState } from "react"
import { Clock, AlertTriangle, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const timetable = [
  { day: "Monday", time: "9:00 AM", subject: "Mathematics", room: "101", conflict: false },
  { day: "Monday", time: "10:00 AM", subject: "Physics", room: "102", conflict: true },
  { day: "Monday", time: "11:00 AM", subject: "Chemistry", room: "103", conflict: false },
  // ... more timetable entries
]

export default function TimetableManagement() {
  const [conflicts, setConflicts] = useState(2)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Timetable Management</h1>

        <Card className="mb-8 bg-gray-50 dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Clock className="mr-2 h-6 w-6" />
              Current Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  {days.map((day) => (
                    <TableHead key={day}>{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((time) => (
                  <TableRow key={time}>
                    <TableCell>{time}</TableCell>
                    {days.map((day) => {
                      const entry = timetable.find((e) => e.day === day && e.time === time)
                      return (
                        <TableCell key={`${day}-${time}`} className="relative">
                          {entry && (
                            <div
                              className={`p-2 rounded ${entry.conflict ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"}`}
                            >
                              <p className="font-semibold">{entry.subject}</p>
                              <p className="text-sm">Room: {entry.room}</p>
                              {entry.conflict && (
                                <Badge variant="destructive" className="absolute top-1 right-1">
                                  <AlertTriangle className="h-3 w-3" />
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-yellow-500" />
                Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">{conflicts}</p>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Resolve Conflicts</Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Check className="mr-2 h-6 w-6 text-green-500" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full dark:bg-[#1f1f1f44] dark:hover:bg-[#0044] text-white">Adjust Timetable</Button>
              <Button className="w-full dark:bg-[#1f1f1f44] dark:hover:bg-[#0044] text-white">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


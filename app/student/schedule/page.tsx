"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, addDays, isSameDay } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Class {
  id: number
  name: string
  time: string
  location: string
  date: Date
}

const classes: Class[] = [
  { id: 1, name: "Mathematics", time: "09:00 AM - 10:30 AM", location: "Room 101", date: new Date() },
  { id: 2, name: "Physics", time: "11:00 AM - 12:30 PM", location: "Lab 3", date: new Date() },
  { id: 3, name: "Computer Science", time: "02:00 PM - 03:30 PM", location: "Computer Lab", date: new Date() },
  {
    id: 4,
    name: "English Literature",
    time: "09:30 AM - 11:00 AM",
    location: "Room 205",
    date: addDays(new Date(), 1),
  },
  { id: 5, name: "Chemistry", time: "01:00 PM - 02:30 PM", location: "Lab 2", date: addDays(new Date(), 1) },
  { id: 6, name: "History", time: "03:00 PM - 04:30 PM", location: "Room 302", date: addDays(new Date(), 1) },
]

export default function Schedule() {
  const [todayClasses, setTodayClasses] = useState<Class[]>([])
  const [tomorrowClasses, setTomorrowClasses] = useState<Class[]>([])

  useEffect(() => {
    const today = new Date()
    const tomorrow = addDays(today, 1)

    setTodayClasses(classes.filter((c) => isSameDay(c.date, today)))
    setTomorrowClasses(classes.filter((c) => isSameDay(c.date, tomorrow)))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Class Schedule</h1>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <ScheduleDay classes={todayClasses} day="Today" />
          </TabsContent>
          <TabsContent value="tomorrow">
            <ScheduleDay classes={tomorrowClasses} day="Tomorrow" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function ScheduleDay({ classes, day }: { classes: Class[]; day: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Calendar className="w-6 h-6 mr-2 text-blue-500" />
          {day}'s Schedule ({format(classes[0]?.date || new Date(), "MMMM d, yyyy")})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No classes scheduled for {day.toLowerCase()}.</p>
        ) : (
          <div className="space-y-6">
            {classes.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{cls.name}</h3>
                      <Badge variant="secondary" className="text-sm">
                        {format(new Date(`2000-01-01 ${cls.time.split(" - ")[0]}`), "h:mm a")}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{cls.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


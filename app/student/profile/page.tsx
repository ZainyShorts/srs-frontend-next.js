"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, BookOpen, Award, Calendar, Clock, User, Briefcase, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function StudentProfile() {
  const [cgpa, setCgpa] = useState(3.8)

  const studentInfo = {
    name: "Zain ul Abidin",
    email: "zainyshorts@superio.edu",
    phone: "+92 (345) 425-4567",
    dob: "29/11/2003",
    address: "123 Campus Drive, University City, State 12345",
    major: "Computer Science",
    year: "4th",
    enrollmentDate: "September 2021",
    expectedGraduation: "May 2025",
  }

  const guardianInfo = {
    name: "Ahmed Khan",
    relation: "Father",
    email: "ahmed.khan@example.com",
    phone: "+92 (300) 123-4567",
    occupation: "Software Engineer",
  }

  const classes = [
    { name: "Advanced Algorithms", grade: "A", progress: 90 },
    { name: "Database Systems", grade: "A-", progress: 85 },
    { name: "Machine Learning", grade: "B+", progress: 78 },
    { name: "Web Development", grade: "A", progress: 95 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="overflow-hidden shadow-xl">
          <CardHeader className="p-0">
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-800">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute -bottom-20 left-8"
              >
                <Avatar className="w-40 h-40 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage
                    src="https://i.pinimg.com/236x/30/9e/69/309e6950c1e2ab0e94bf9a7998da2bed.jpg"
                    alt={studentInfo.name}
                  />
                  <AvatarFallback>
                    {studentInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="pt-24 pb-8 px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">{studentInfo.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{studentInfo.major}</p>
                <Badge variant="secondary" className="mb-6">
                  {studentInfo.year} Year Student
                </Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <InfoItem icon={Mail} text={studentInfo.email} />
                    <InfoItem icon={Phone} text={studentInfo.phone} />
                    <InfoItem icon={Calendar} text={studentInfo.dob} />
                    <InfoItem icon={MapPin} text={studentInfo.address} />
                  </div>
                  <div className="space-y-3">
                    <InfoItem icon={BookOpen} text={`Year: ${studentInfo.year}`} />
                    <InfoItem icon={Calendar} text={`Enrolled: ${studentInfo.enrollmentDate}`} />
                    <InfoItem icon={Clock} text={`Expected Graduation: ${studentInfo.expectedGraduation}`} />
                  </div>
                </div>
              </div>
              <div>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Award className="mr-2" />
                      Academic Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold mb-2 text-blue-600 dark:text-blue-400">{cgpa.toFixed(2)}</div>
                    <Progress value={(cgpa / 4) * 100} className="h-2 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cumulative GPA (out of 4.0)</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="classes" className="mt-12">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="classes">Current Classes</TabsTrigger>
                <TabsTrigger value="guardian">Guardian Information</TabsTrigger>
              </TabsList>
              <TabsContent value="classes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classes.map((cls, index) => (
                    <motion.div
                      key={cls.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg">{cls.name}</span>
                            <Badge variant="outline">{cls.grade}</Badge>
                          </div>
                          <Progress value={cls.progress} className="h-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Course Progress: {cls.progress}%
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="guardian">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <Heart className="mr-2 text-red-500" />
                      Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <InfoItem icon={User} text={guardianInfo.name} />
                        <InfoItem icon={Heart} text={guardianInfo.relation} />
                        <InfoItem icon={Briefcase} text={guardianInfo.occupation} />
                      </div>
                      <div className="space-y-3">
                        <InfoItem icon={Mail} text={guardianInfo.email} />
                        <InfoItem icon={Phone} text={guardianInfo.phone} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function InfoItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center text-gray-700 dark:text-gray-300">
      <Icon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
      <span>{text}</span>
    </div>
  )
}


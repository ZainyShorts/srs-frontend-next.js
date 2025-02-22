"use client"

import * as React from "react"
import { BookOpen, Calendar, Clock, Users, CheckCircle, BarChart, Bell, FileText, Bookmark } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function TeacherDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classes Today
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              across 5 classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assignments Due
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              3 need grading
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { class: "Mathematics 101", time: "10:00 AM", room: "A101", students: 30 },
                { class: "Physics 202", time: "11:30 AM", room: "B205", students: 25 },
                { class: "Computer Science 301", time: "2:00 PM", room: "C310", students: 20 },
                { class: "English Literature", time: "3:30 PM", room: "D102", students: 28 },
              ].map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.class}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.room}</TableCell>
                  <TableCell>{item.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity and To-Do List */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { avatar: "A", name: "Alice Johnson", action: "submitted assignment", time: "2 hours ago" },
                { avatar: "B", name: "Bob Smith", action: "asked a question", time: "4 hours ago" },
                { avatar: "C", name: "Charlie Brown", action: "joined your class", time: "1 day ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`/avatars/${item.avatar.toLowerCase()}.png`} alt={item.name} />
                    <AvatarFallback>{item.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>To-Do List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Grade Mathematics 101 assignments", progress: 70 },
                { task: "Prepare lesson plan for Physics 202", progress: 30 },
                { task: "Schedule parent-teacher meetings", progress: 0 },
                { task: "Update course materials for CS301", progress: 100 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center">
                    <Bookmark className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.task}</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {/* You would typically put a chart component here */}
            <div className="flex items-center justify-center h-full bg-muted rounded-md">
              <BarChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Weekly statistics chart</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import * as React from "react"
import { Calendar, Users, UserCheck, UserX, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const students = [
  { name: "Alice Johnson", id: "10A001", status: "present" },
  { name: "Bob Smith", id: "10A002", status: "absent" },
  { name: "Charlie Brown", id: "10A003", status: "late" },
  { name: "Diana Prince", id: "10A004", status: "present" },
  { name: "Ethan Hunt", id: "10A005", status: "excused" },
]

export default function AttendancePage() {
  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
      
      {/* Class and Date Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="class-select">Class</Label>
              <Select>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10a">Class 10A</SelectItem>
                  <SelectItem value="10b">Class 10B</SelectItem>
                  <SelectItem value="11a">Class 11A</SelectItem>
                  <SelectItem value="11b">Class 11B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-select">Date</Label>
              <Input type="date" id="date-select" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Load Attendance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">21 students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8%</div>
            <p className="text-xs text-muted-foreground">2 students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4%</div>
            <p className="text-xs text-muted-foreground">1 student</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excused</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2%</div>
            <p className="text-xs text-muted-foreground">1 student</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Marking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance - Class 10A (May 25, 2023)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Badge
                            variant={
                              student.status === "present"
                                ? "default"
                                : student.status === "absent"
                                  ? "destructive"
                                  : student.status === "late"
                                    ? "warning"
                                    : "secondary"
                            }
                          >
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Present</DropdownMenuItem>
                        <DropdownMenuItem>Absent</DropdownMenuItem>
                        <DropdownMenuItem>Late</DropdownMenuItem>
                        <DropdownMenuItem>Excused</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Add note" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
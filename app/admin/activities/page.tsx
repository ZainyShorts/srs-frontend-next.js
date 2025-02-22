"use client"

import { Bell, Calendar, Filter, MoreVertical, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const activities = [
  {
    id: 1,
    type: "enrollment",
    title: "New Student Enrollment",
    description: "Sarah Johnson was enrolled in Grade 10",
    timestamp: "2 hours ago",
    user: "Admin Staff",
    status: "completed",
  },
  {
    id: 2,
    type: "academic",
    title: "Grade Update",
    description: "Batch grade update for Physics Class 11-A",
    timestamp: "5 hours ago",
    user: "Mr. Robert Chen",
    status: "completed",
  },
  {
    id: 3,
    type: "attendance",
    title: "Attendance Report Generated",
    description: "Monthly attendance report for Grade 9",
    timestamp: "1 day ago",
    user: "System",
    status: "completed",
  },
  {
    id: 4,
    type: "financial",
    title: "Fee Payment",
    description: "Term 2 fees collected for 125 students",
    timestamp: "1 day ago",
    user: "Finance Dept",
    status: "pending",
  },
]

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recent Activities </h1>
            <p className="text-gray-500">Track and monitor all Admin activities.</p>
          </div>
          <Button variant="outline" className="h-10">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search activities..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-gray-100 p-2">
                    {activity.type === "enrollment" && <User className="h-5 w-5" />}
                    {activity.type === "academic" && <Calendar className="h-5 w-5" />}
                    {activity.type === "attendance" && <Bell className="h-5 w-5" />}
                    {activity.type === "financial" && <Calendar className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      <button className="rounded-full p-1 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      <span className="text-xs text-gray-500">By {activity.user}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          activity.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
                {index < activities.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { Download, FileText, Filter, Printer, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
            <p className="text-gray-500">Create and export detailed academic reports.</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="h-10">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button className="h-10 bg-black text-white hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Filters */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic Performance</SelectItem>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="behavior">Behavioral Report</SelectItem>
                    <SelectItem value="financial">Financial Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid gap-4">
                  <Input type="date" className="border-gray-200" />
                  <Input type="date" className="border-gray-200" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grade Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button className="w-full bg-black text-white hover:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Preview</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search in preview..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="mb-6 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-semibold">Select Filters to Generate Report</h3>
                  <p className="text-sm text-gray-500">
                    Choose your report type and filters to preview the report here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


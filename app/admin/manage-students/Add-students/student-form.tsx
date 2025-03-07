"use client"

import type { ChangeEvent } from "react"
import { Camera, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface StudentFormProps {
  formData: {
    rollNo: string
    firstName: string
    lastName: string
    class: string
    section: string
    gender: string
    dob: string
    email: string
    phone: string
    address: string
    enrollDate: string
    expectedGraduation: string
    [key: string]: any
  }
  errors: {
    rollNo: string
    firstName: string
    lastName: string
    class: string
    section: string
    gender: string
    dob: string
    email: string
    phone: string
    address: string
    expectedGraduation: string
    [key: string]: any
  }
  photoPreview: string | null
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: string, value: string) => void
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void
  onContinue: () => void
  onCancel: () => void
  disabled?: boolean
  isEditing?: boolean
}

export function StudentForm({
  formData,
  errors,
  photoPreview,
  onInputChange,
  onSelectChange,
  onPhotoChange,
  onContinue,
  onCancel,
  disabled = false,
  isEditing = false,
}: StudentFormProps) {
  return (
    <div className="p-6 space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Student Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                  {photoPreview ? (
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Student preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="student-photo-upload"
                  className={`absolute bottom-0 right-0 rounded-full bg-black p-2 text-white shadow-lg ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    id="student-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPhotoChange}
                    disabled={disabled}
                  />
                </label>
              </div>
              <label htmlFor="student-photo-upload-btn" className="mt-4">
                <Button variant="outline" asChild disabled={disabled}>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                    <input
                      id="student-photo-upload-btn"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onPhotoChange}
                      disabled={disabled}
                    />
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Student Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  className={`border-gray-200 ${errors.firstName ? "border-red-500" : ""}`}
                  value={formData.firstName}
                  onChange={onInputChange}
                  disabled={disabled}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  className={`border-gray-200 ${errors.lastName ? "border-red-500" : ""}`}
                  value={formData.lastName}
                  onChange={onInputChange}
                  disabled={disabled}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                className="flex space-x-4"
                onValueChange={(value) => onSelectChange("gender", value)}
                disabled={disabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  className={`border-gray-200 ${errors.dob ? "border-red-500" : ""}`}
                  value={formData.dob}
                  onChange={onInputChange}
                  disabled={disabled}
                />
                {errors.dob && <p className="text-sm text-red-500 mt-1">{errors.dob}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  placeholder="Enter roll number"
                  className={`border-gray-200 ${errors.rollNo ? "border-red-500" : ""} ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  value={formData.rollNo}
                  onChange={onInputChange}
                  disabled={disabled || isEditing}
                />
                {errors.rollNo && <p className="text-sm text-red-500 mt-1">{errors.rollNo}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => onSelectChange("class", value)}
                  disabled={disabled}
                >
                  <SelectTrigger id="class" className={errors.class ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[9, 10, 11, 12].map((classNum) => (
                      <SelectItem key={classNum} value={classNum.toString()}>
                        Class {classNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.class && <p className="text-sm text-red-500 mt-1">{errors.class}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => onSelectChange("section", value)}
                  disabled={disabled}
                >
                  <SelectTrigger id="section" className={errors.section ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C"].map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.section && <p className="text-sm text-red-500 mt-1">{errors.section}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollDate">Enrollment Date</Label>
                <Input
                  id="enrollDate"
                  name="enrollDate"
                  type="date"
                  className="border-gray-200"
                  value={formData.enrollDate}
                  onChange={onInputChange}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedGraduation">Expected Graduation Year</Label>
                <Select
                  value={formData.expectedGraduation}
                  onValueChange={(value) => onSelectChange("expectedGraduation", value)}
                  disabled={disabled}
                >
                  <SelectTrigger id="expectedGraduation" className={errors.expectedGraduation ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 16 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expectedGraduation && <p className="text-sm text-red-500 mt-1">{errors.expectedGraduation}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  className={`border-gray-200 ${errors.email ? "border-red-500" : ""} ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  value={formData.email}
                  onChange={onInputChange}
                  disabled={disabled || isEditing}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  className={`border-gray-200 ${errors.phone ? "border-red-500" : ""}`}
                  value={formData.phone}
                  onChange={onInputChange}
                  disabled={disabled}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter address"
                className={`border-gray-200 min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
                value={formData.address}
                onChange={onInputChange}
                disabled={disabled}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>

            <Separator />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onCancel} disabled={disabled}>
                Cancel
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={onContinue} disabled={disabled}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


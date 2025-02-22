"use client"

import { useState } from "react"
import { Camera, CheckCircle, Mail, Phone, Upload, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddTeacherModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddTeacherModal({ isOpen, onClose }: AddTeacherModalProps) {
  const [step, setStep] = useState(1)

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Handle form submission here
      onClose()
      setStep(1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-5xl p-6">
        <div className="custom-scrollbar max-h-[80vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-8">
            {/* Progress Steps */}
            <div className="flex justify-between">
              {["Personal Details", "Professional Info", "Subjects & Schedule"].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 ${
                        index + 1 <= step ? "border-black bg-black text-white" : "border-gray-200 bg-white"
                      }`}
                    >
                      {index + 1 <= step ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : index + 1}
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium">{stepName}</span>
                  </div>
                  {index < 2 && <div className="mx-2 sm:mx-4 h-[2px] w-12 sm:w-24 bg-gray-200" />}
                </div>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Photo Upload */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Teacher Photo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
                      </div>
                      <button className="absolute bottom-0 right-0 rounded-full bg-black p-2 text-white shadow-lg">
                        <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                    <Button variant="outline" className="mt-4">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>

                  <Separator />

                  {/* Quick Contact */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Quick Contact</h3>
                    <div className="flex items-center space-x-2 rounded-lg border bg-gray-50 p-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Send Welcome Email</span>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border bg-gray-50 p-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Schedule Call</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" className="border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" className="border-gray-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup defaultValue="male" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter email" className="border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter phone number" className="border-gray-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Textarea
                      id="qualifications"
                      placeholder="Enter academic qualifications"
                      className="min-h-[100px] border-gray-200"
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="bg-black text-white hover:bg-gray-800" onClick={handleContinue}>
                      {step === 3 ? "Submit" : "Continue"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 6px;
          border: 3px solid #f1f1f1;
        }
      `}</style>
    </Dialog>
  )
}

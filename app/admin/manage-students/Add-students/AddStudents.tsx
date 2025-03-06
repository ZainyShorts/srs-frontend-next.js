"use client"

import { useState, type ChangeEvent, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StudentForm } from "./student-form"
import { GuardianForm } from "./guardian-form"

interface StudentGuardianModalProps {
  isOpen: boolean
  onClose: () => void
  studentData?: any 
  handleDone?:any
}

interface StudentData {
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
  profilePhoto: any
  guardianName: string
  guardianEmail: string
  guardianPhone: string
  guardianPhoto: any 
  guardianRelation: string 
  guardianProfession : string
}

interface FormErrors {
  rollNo: string
  firstName: string
  lastName: string
  class: string
  section: string
  dob: string
  email: string
  phone: string
  address: string
  expectedGraduation: string
  guardianName: string
  guardianEmail: string
  guardianPhone: string 
  guardianRelation: string 
  guardianProfession : string
}

export default function StudentGuardianModal({ isOpen, onClose, studentData , handleDone }: StudentGuardianModalProps) {
  const [currentStep, setCurrentStep] = useState<"student" | "guardian">("student")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<StudentData>({
    rollNo: "",
    firstName: "",
    lastName: "",
    class: "",
    section: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    address: "",
    enrollDate: new Date().toISOString().split("T")[0],
    expectedGraduation: new Date().getFullYear().toString(),
    profilePhoto: null,
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianPhoto: null, 
    guardianRelation: "", 
    guardianProfession: "",
  })

  const [errors, setErrors] = useState<FormErrors>({
    rollNo: "",
    firstName: "",
    lastName: "",
    class: "",
    section: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    expectedGraduation: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "", 
    guardianRelation: "", 
    guardianProfession : "",
  })

  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string | null>(null)
  const [guardianPhotoPreview, setGuardianPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (currentStep === "student") {
      setErrors((prev) => ({
        ...prev,
        guardianName: "",
        guardianEmail: "",
        guardianPhone: "",
      }))
    } else {
      setErrors((prev) => ({
        ...prev,
        rollNo: "",
        firstName: "",
        lastName: "",
        class: "",
        section: "",
        dob: "",
        email: "",
        phone: "",
        address: "",
        expectedGraduation: "",
      }))
    }
  }, [currentStep])

  useEffect(() => {
    if (studentData) {
      setFormData({
        rollNo: studentData.rollNo || "",
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        class: studentData.class || "",
        section: studentData.section || "",
        gender: studentData.gender || "Male",
        dob: studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        address: studentData.address || "",
        enrollDate: studentData.enrollDate
          ? new Date(studentData.enrollDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        expectedGraduation: studentData.expectedGraduation || new Date().getFullYear().toString(),
        profilePhoto: null,
        guardianName: studentData.guardian.name || "",
        guardianEmail: studentData.guardian.email || "",
        guardianPhone: studentData.guardian.phone || "",
        guardianPhoto: null, 
        guardianRelation: "", 
        guardianProfession: "",
      })
    }
  }, [studentData])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleStudentPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, profilePhoto: file })

      const reader = new FileReader()
      reader.onload = (event) => {
        setStudentPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGuardianPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, guardianPhoto: file })

      const reader = new FileReader()
      reader.onload = (event) => {
        setGuardianPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStudentForm = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (!formData.rollNo) {
      newErrors.rollNo = "Roll number is required"
      isValid = false
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required"
      isValid = false
    }

    if (!formData.class) {
      newErrors.class = "Class is required"
      isValid = false
    }

    if (!formData.section) {
      newErrors.section = "Section is required"
      isValid = false
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits"
      isValid = false
    }

    if (!formData.address) {
      newErrors.address = "Address is required"
      isValid = false
    }

    if (!formData.expectedGraduation) {
      newErrors.expectedGraduation = "Expected graduation year is required"
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) {
      toast.error("Please fill all required fields correctly", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }

    return isValid
  }

  const validateGuardianForm = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (!formData.guardianName) {
      newErrors.guardianName = "Guardian name is required"
      isValid = false
    }

    if (!formData.guardianEmail) {
      newErrors.guardianEmail = "Guardian email is required"
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.guardianEmail)) {
      newErrors.guardianEmail = "Invalid email format"
      isValid = false
    }

    if (!formData.guardianPhone) {
      newErrors.guardianPhone = "Guardian phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(formData.guardianPhone)) {
      newErrors.guardianPhone = "Phone must be 10 digits"
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) {
      toast.error("Please fill all required guardian fields correctly", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }

    return isValid
  }

  const handleContinueToGuardian = () => {
    if (validateStudentForm()) {
      setCurrentStep("guardian")
    }
  }

  const handleBackToStudent = () => {
    setCurrentStep("student")
  }

  const handleSubmit = async () => {
    if (!validateGuardianForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      let apiData;
  
      if (studentData) {
        apiData = {
          rollNo: formData.rollNo || "",
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          class: formData.class || "",
          section: formData.section || "",
          gender: formData.gender || "",
          dob: formData.dob || "",
          email: formData.email || "",
          phone: formData.phone || "",
          address: formData.address || "",
          enrollDate: formData.enrollDate || "",
          expectedGraduation: formData.expectedGraduation || "",
          profilePhoto: formData.profilePhoto ? "no" : "no",
          guardianName: formData.guardianName || "",
          guardianEmail: formData.guardianEmail || "",
          guardianPhone: formData.guardianPhone || "",
          guardianPhoto: formData.guardianPhoto ? "no" : "no", 
          guardianRelation: formData.guardianRelation || "",
          guardianProfession: formData.guardianProfession || "",
        };
        console.log('api data', apiData)
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_SRS_SERVER}/student/${studentData._id}`,
          apiData
        );
        toast.success("Student updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        await handleDone() 
     
      } else {
        apiData = {
          rollNo: formData.rollNo || "",
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          class: formData.class || "",
          section: formData.section || "",
          gender: formData.gender || "",
          dob: formData.dob || "",
          email: formData.email || "",
          phone: formData.phone || "",
          address: formData.address || "",
          enrollDate: formData.enrollDate || "",
          expectedGraduation: formData.expectedGraduation || "",
          profilePhoto: formData.profilePhoto ? "no" : "no",
          guardianName: formData.guardianName || "",
          guardianEmail: formData.guardianEmail || "",
          guardianPhone: formData.guardianPhone || "",
          guardianPhoto: formData.guardianPhoto ? "no" : "no", 
          guardianRelation: formData.guardianRelation || "",
          guardianProfession: formData.guardianProfession || "",
        };
  
        console.log("AddingData", apiData);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SRS_SERVER}/student/add`,
          apiData
        );  
        console.log('response',response)

        toast.success("Student added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        await handleDone()
      } 
  
      resetForm();
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("This Email is Already Registered", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const resetForm = () => {
    setCurrentStep("student")
    setFormData({
      rollNo: "",
      firstName: "",
      lastName: "",
      class: "",
      section: "",
      gender: "Male",
      dob: "",
      email: "",
      phone: "",
      address: "",
      enrollDate: new Date().toISOString().split("T")[0],
      expectedGraduation: new Date().getFullYear().toString(),
      profilePhoto: null,
      guardianName: "",
      guardianEmail: "",
      guardianPhone: "",
      guardianPhoto: null, 
      guardianRelation: "", 
      guardianProfession: "",
    })
    setStudentPhotoPreview(null)
    setGuardianPhotoPreview(null)
    setErrors({
      rollNo: "",
      firstName: "",
      lastName: "",
      class: "",
      section: "",
      dob: "",
      email: "",
      phone: "",
      address: "",
      expectedGraduation: "",
      guardianName: "",
      guardianEmail: "",
      guardianPhone: "", 
      guardianRelation: "", 
      guardianProfession: "",
    })
  }

  const handleCloseRequest = (open: boolean) => {
    if (!isSubmitting && !open) {
      onClose()
    }
  }

  return (
    <>
     

      <Dialog open={isOpen} onOpenChange={handleCloseRequest}>
        <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-5xl p-0">
          <div className="custom-scrollbar max-h-[80vh] overflow-y-auto">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>
                {studentData ? "Edit " : "Add "}
                {currentStep === "student" ? "Student Information" : "Guardian Information"}
              </DialogTitle>
            </DialogHeader>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: currentStep === "student" ? "translateX(0%)" : "translateX(-50%)",
                  width: "200%",
                }}
              >
                <div className="w-1/2 flex-shrink-0">
                  <StudentForm
                    formData={formData}
                    errors={errors}
                    photoPreview={studentPhotoPreview}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onPhotoChange={handleStudentPhotoChange}
                    onContinue={handleContinueToGuardian}
                    onCancel={onClose}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="w-1/2 flex-shrink-0">
                  <GuardianForm
                    formData={formData}
                    errors={errors}
                    photoPreview={guardianPhotoPreview}
                    onInputChange={handleInputChange}
                    onPhotoChange={handleGuardianPhotoChange}
                    onSubmit={handleSubmit}
                    onBack={handleBackToStudent}
                    isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                    isEditing={!!studentData}
                  />
                </div>
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
    </>
  )
}


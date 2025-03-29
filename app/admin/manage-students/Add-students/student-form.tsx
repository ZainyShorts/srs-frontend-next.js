"use client"

import type { ChangeEvent } from "react"
import { Camera, Upload, User, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface StudentFormProps {
  formData: {
    studentId: string
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
    transcripts: File[]
    iipFlag: boolean // Changed to boolean
    honorRolls: boolean
    athletics: boolean
    clubs: string
    lunch: string
    nationality: string
    [key: string]: any
  }
  errors: {
    studentId: string
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
    iipFlag: string
    clubs: string
    lunch: string
    nationality: string
    [key: string]: any
  }
  photoPreview: string | null
  transcriptPreviews?: { name: string; size: number }[]
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: string, value: string | boolean) => void
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void
  onTranscriptChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveTranscript?: (index: number) => void
  onContinue: () => void
  onCancel: () => void
  disabled?: boolean
  isEditing?: boolean
}

export function StudentForm({
  formData,
  errors,
  photoPreview,
  transcriptPreviews = [],
  onInputChange,
  onSelectChange,
  onPhotoChange,
  onTranscriptChange,
  onRemoveTranscript,
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

            {/* Transcripts Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Transcripts</h3>
                <label htmlFor="transcript-upload" className="inline-flex">
                  <Button variant="outline" size="sm" asChild disabled={disabled}>
                    <span>
                      <FileText className="mr-1 h-3 w-3" />
                      Add Files
                      <input
                        id="transcript-upload"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        onChange={onTranscriptChange}
                        disabled={disabled}
                      />
                    </span>
                  </Button>
                </label>
              </div>

              {transcriptPreviews.length > 0 ? (
                <div className="max-h-[300px] h-auto w-full overflow-x-auto rounded-md border p-2">
                  <div className="space-y-2">
                    {transcriptPreviews.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center w-full overflow-x-auto bg-gray-50 justify-between rounded-md p-2 text-sm"
                      >
                        <div className="flex items-center space-x-2 w-full truncate">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onRemoveTranscript && onRemoveTranscript(index)}
                          disabled={disabled}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-[120px] w-full items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="text-xs text-gray-500">No transcripts uploaded</div>
                  </div>
                </div>
              )}
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
                <Label htmlFor="studentId">Student Id </Label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="Enter Student ID"
                  className={`border-gray-200 ${errors.studentId ? "border-red-500" : ""} ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  value={formData.studentId}
                  onChange={onInputChange}
                  disabled={disabled || isEditing}
                />
                {errors.studentId && <p className="text-sm text-red-500 mt-1">{errors.studentId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Home Room </Label>
                <Input
                  id="class"
                  name="class"
                  placeholder="Enter Home Room"
                  className={`border-gray-200 ${errors.class ? "border-red-500" : ""}`}
                  value={formData.class}
                  onChange={onInputChange}
                  disabled={disabled}
                />
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
                    {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                    <SelectItem value="none">None</SelectItem>
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

            {/* Add these new fields after the address field and before the Separator */}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="iipFlag" className="cursor-pointer">
                    IIP Flag
                  </Label>
                  <Switch
                    id="iipFlag"
                    checked={formData.iipFlag}
                    onCheckedChange={(checked) => onSelectChange("iipFlag", checked)}
                    disabled={disabled}
                  />
                </div>
                {errors.iipFlag && <p className="text-sm text-red-500 mt-1">{errors.iipFlag}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) => onSelectChange("nationality", value)}
                  disabled={disabled}
                >
                  <SelectTrigger id="nationality" className={errors.nationality ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="af">🇦🇫 Afghanistan</SelectItem>
                    <SelectItem value="al">🇦🇱 Albania</SelectItem>
                    <SelectItem value="dz">🇩🇿 Algeria</SelectItem>
                    <SelectItem value="ad">🇦🇩 Andorra</SelectItem>
                    <SelectItem value="ao">🇦🇴 Angola</SelectItem>
                    <SelectItem value="ag">🇦🇬 Antigua and Barbuda</SelectItem>
                    <SelectItem value="ar">🇦🇷 Argentina</SelectItem>
                    <SelectItem value="am">🇦🇲 Armenia</SelectItem>
                    <SelectItem value="au">🇦🇺 Australia</SelectItem>
                    <SelectItem value="at">🇦🇹 Austria</SelectItem>
                    <SelectItem value="az">🇦🇿 Azerbaijan</SelectItem>
                    <SelectItem value="bs">🇧🇸 Bahamas</SelectItem>
                    <SelectItem value="bh">🇧🇭 Bahrain</SelectItem>
                    <SelectItem value="bd">🇧🇩 Bangladesh</SelectItem>
                    <SelectItem value="bb">🇧🇧 Barbados</SelectItem>
                    <SelectItem value="by">🇧🇾 Belarus</SelectItem>
                    <SelectItem value="be">🇧🇪 Belgium</SelectItem>
                    <SelectItem value="bz">🇧🇿 Belize</SelectItem>
                    <SelectItem value="bj">🇧🇯 Benin</SelectItem>
                    <SelectItem value="bt">🇧🇹 Bhutan</SelectItem>
                    <SelectItem value="bo">🇧🇴 Bolivia</SelectItem>
                    <SelectItem value="ba">🇧🇦 Bosnia and Herzegovina</SelectItem>
                    <SelectItem value="bw">🇧🇼 Botswana</SelectItem>
                    <SelectItem value="br">🇧🇷 Brazil</SelectItem>
                    <SelectItem value="bn">🇧🇳 Brunei</SelectItem>
                    <SelectItem value="bg">🇧🇬 Bulgaria</SelectItem>
                    <SelectItem value="bf">🇧🇫 Burkina Faso</SelectItem>
                    <SelectItem value="bi">🇧🇮 Burundi</SelectItem>
                    <SelectItem value="cv">🇨🇻 Cabo Verde</SelectItem>
                    <SelectItem value="kh">🇰🇭 Cambodia</SelectItem>
                    <SelectItem value="cm">🇨🇲 Cameroon</SelectItem>
                    <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                    <SelectItem value="cf">🇨🇫 Central African Republic</SelectItem>
                    <SelectItem value="td">🇹🇩 Chad</SelectItem>
                    <SelectItem value="cl">🇨🇱 Chile</SelectItem>
                    <SelectItem value="cn">🇨🇳 China</SelectItem>
                    <SelectItem value="co">🇨🇴 Colombia</SelectItem>
                    <SelectItem value="km">🇰🇲 Comoros</SelectItem>
                    <SelectItem value="cg">🇨🇬 Congo</SelectItem>
                    <SelectItem value="cd">🇨🇩 Congo (Democratic Republic)</SelectItem>
                    <SelectItem value="cr">🇨🇷 Costa Rica</SelectItem>
                    <SelectItem value="ci">🇨🇮 Côte d'Ivoire</SelectItem>
                    <SelectItem value="hr">🇭🇷 Croatia</SelectItem>
                    <SelectItem value="cu">🇨🇺 Cuba</SelectItem>
                    <SelectItem value="cy">🇨🇾 Cyprus</SelectItem>
                    <SelectItem value="cz">🇨🇿 Czech Republic</SelectItem>
                    <SelectItem value="dk">🇩🇰 Denmark</SelectItem>
                    <SelectItem value="dj">🇩🇯 Djibouti</SelectItem>
                    <SelectItem value="dm">🇩🇲 Dominica</SelectItem>
                    <SelectItem value="do">🇩🇴 Dominican Republic</SelectItem>
                    <SelectItem value="ec">🇪🇨 Ecuador</SelectItem>
                    <SelectItem value="eg">🇪🇬 Egypt</SelectItem>
                    <SelectItem value="sv">🇸🇻 El Salvador</SelectItem>
                    <SelectItem value="gq">🇬🇶 Equatorial Guinea</SelectItem>
                    <SelectItem value="er">🇪🇷 Eritrea</SelectItem>
                    <SelectItem value="ee">🇪🇪 Estonia</SelectItem>
                    <SelectItem value="sz">🇸🇿 Eswatini</SelectItem>
                    <SelectItem value="et">🇪🇹 Ethiopia</SelectItem>
                    <SelectItem value="fj">🇫🇯 Fiji</SelectItem>
                    <SelectItem value="fi">🇫🇮 Finland</SelectItem>
                    <SelectItem value="fr">🇫🇷 France</SelectItem>
                    <SelectItem value="ga">🇬🇦 Gabon</SelectItem>
                    <SelectItem value="gm">🇬🇲 Gambia</SelectItem>
                    <SelectItem value="ge">🇬🇪 Georgia</SelectItem>
                    <SelectItem value="de">🇩🇪 Germany</SelectItem>
                    <SelectItem value="gh">🇬🇭 Ghana</SelectItem>
                    <SelectItem value="gr">🇬🇷 Greece</SelectItem>
                    <SelectItem value="gd">🇬🇩 Grenada</SelectItem>
                    <SelectItem value="gt">🇬🇹 Guatemala</SelectItem>
                    <SelectItem value="gn">🇬🇳 Guinea</SelectItem>
                    <SelectItem value="gw">🇬🇼 Guinea-Bissau</SelectItem>
                    <SelectItem value="gy">🇬🇾 Guyana</SelectItem>
                    <SelectItem value="ht">🇭🇹 Haiti</SelectItem>
                    <SelectItem value="hn">🇭🇳 Honduras</SelectItem>
                    <SelectItem value="hu">🇭🇺 Hungary</SelectItem>
                    <SelectItem value="is">🇮🇸 Iceland</SelectItem>
                    <SelectItem value="in">🇮🇳 India</SelectItem>
                    <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                    <SelectItem value="ir">🇮🇷 Iran</SelectItem>
                    <SelectItem value="iq">🇮🇶 Iraq</SelectItem>
                    <SelectItem value="ie">🇮🇪 Ireland</SelectItem>
                    <SelectItem value="il">🇮🇱 Israel</SelectItem>
                    <SelectItem value="it">🇮🇹 Italy</SelectItem>
                    <SelectItem value="jm">🇯🇲 Jamaica</SelectItem>
                    <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                    <SelectItem value="jo">🇯🇴 Jordan</SelectItem>
                    <SelectItem value="kz">🇰🇿 Kazakhstan</SelectItem>
                    <SelectItem value="ke">🇰🇪 Kenya</SelectItem>
                    <SelectItem value="ki">🇰🇮 Kiribati</SelectItem>
                    <SelectItem value="kp">🇰🇵 North Korea</SelectItem>
                    <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                    <SelectItem value="kw">🇰🇼 Kuwait</SelectItem>
                    <SelectItem value="kg">🇰🇬 Kyrgyzstan</SelectItem>
                    <SelectItem value="la">🇱🇦 Laos</SelectItem>
                    <SelectItem value="lv">🇱🇻 Latvia</SelectItem>
                    <SelectItem value="lb">🇱🇧 Lebanon</SelectItem>
                    <SelectItem value="ls">🇱🇸 Lesotho</SelectItem>
                    <SelectItem value="lr">🇱🇷 Liberia</SelectItem>
                    <SelectItem value="ly">🇱🇾 Libya</SelectItem>
                    <SelectItem value="li">🇱🇮 Liechtenstein</SelectItem>
                    <SelectItem value="lt">🇱🇹 Lithuania</SelectItem>
                    <SelectItem value="lu">🇱🇺 Luxembourg</SelectItem>
                    <SelectItem value="mg">🇲🇬 Madagascar</SelectItem>
                    <SelectItem value="mw">🇲🇼 Malawi</SelectItem>
                    <SelectItem value="my">🇲🇾 Malaysia</SelectItem>
                    <SelectItem value="mv">🇲🇻 Maldives</SelectItem>
                    <SelectItem value="ml">🇲🇱 Mali</SelectItem>
                    <SelectItem value="mt">🇲🇹 Malta</SelectItem>
                    <SelectItem value="mh">🇲🇭 Marshall Islands</SelectItem>
                    <SelectItem value="mr">🇲🇷 Mauritania</SelectItem>
                    <SelectItem value="mu">🇲🇺 Mauritius</SelectItem>
                    <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
                    <SelectItem value="fm">🇫🇲 Micronesia</SelectItem>
                    <SelectItem value="md">🇲🇩 Moldova</SelectItem>
                    <SelectItem value="mc">🇲🇨 Monaco</SelectItem>
                    <SelectItem value="mn">🇲🇳 Mongolia</SelectItem>
                    <SelectItem value="me">🇲🇪 Montenegro</SelectItem>
                    <SelectItem value="ma">🇲🇦 Morocco</SelectItem>
                    <SelectItem value="mz">🇲🇿 Mozambique</SelectItem>
                    <SelectItem value="mm">🇲🇲 Myanmar</SelectItem>
                    <SelectItem value="na">🇳🇦 Namibia</SelectItem>
                    <SelectItem value="nr">🇳🇷 Nauru</SelectItem>
                    <SelectItem value="np">🇳🇵 Nepal</SelectItem>
                    <SelectItem value="nl">🇳🇱 Netherlands</SelectItem>
                    <SelectItem value="nz">🇳🇿 New Zealand</SelectItem>
                    <SelectItem value="ni">🇳🇮 Nicaragua</SelectItem>
                    <SelectItem value="ne">🇳🇪 Niger</SelectItem>
                    <SelectItem value="ng">🇳🇬 Nigeria</SelectItem>
                    <SelectItem value="mk">🇲🇰 North Macedonia</SelectItem>
                    <SelectItem value="no">🇳🇴 Norway</SelectItem>
                    <SelectItem value="om">🇴🇲 Oman</SelectItem>
                    <SelectItem value="pk">🇵🇰 Pakistan</SelectItem>
                    <SelectItem value="pw">🇵🇼 Palau</SelectItem>
                    <SelectItem value="pa">🇵🇦 Panama</SelectItem>
                    <SelectItem value="pg">🇵🇬 Papua New Guinea</SelectItem>
                    <SelectItem value="py">🇵🇾 Paraguay</SelectItem>
                    <SelectItem value="pe">🇵🇪 Peru</SelectItem>
                    <SelectItem value="ph">🇵🇭 Philippines</SelectItem>
                    <SelectItem value="pl">🇵🇱 Poland</SelectItem>
                    <SelectItem value="pt">🇵🇹 Portugal</SelectItem>
                    <SelectItem value="qa">🇶🇦 Qatar</SelectItem>
                    <SelectItem value="ro">🇷🇴 Romania</SelectItem>
                    <SelectItem value="ru">🇷🇺 Russia</SelectItem>
                    <SelectItem value="rw">🇷🇼 Rwanda</SelectItem>
                    <SelectItem value="kn">🇰🇳 Saint Kitts and Nevis</SelectItem>
                    <SelectItem value="lc">🇱🇨 Saint Lucia</SelectItem>
                    <SelectItem value="vc">🇻🇨 Saint Vincent and the Grenadines</SelectItem>
                    <SelectItem value="ws">🇼🇸 Samoa</SelectItem>
                    <SelectItem value="sm">🇸🇲 San Marino</SelectItem>
                    <SelectItem value="st">🇸🇹 Sao Tome and Principe</SelectItem>
                    <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
                    <SelectItem value="sn">🇸🇳 Senegal</SelectItem>
                    <SelectItem value="rs">🇷🇸 Serbia</SelectItem>
                    <SelectItem value="sc">🇸🇨 Seychelles</SelectItem>
                    <SelectItem value="sl">🇸🇱 Sierra Leone</SelectItem>
                    <SelectItem value="sg">🇸🇬 Singapore</SelectItem>
                    <SelectItem value="sk">🇸🇰 Slovakia</SelectItem>
                    <SelectItem value="si">🇸🇮 Slovenia</SelectItem>
                    <SelectItem value="sb">🇸🇧 Solomon Islands</SelectItem>
                    <SelectItem value="so">🇸🇴 Somalia</SelectItem>
                    <SelectItem value="za">🇿🇦 South Africa</SelectItem>
                    <SelectItem value="ss">🇸🇸 South Sudan</SelectItem>
                    <SelectItem value="es">🇪🇸 Spain</SelectItem>
                    <SelectItem value="lk">🇱🇰 Sri Lanka</SelectItem>
                    <SelectItem value="sd">🇸🇩 Sudan</SelectItem>
                    <SelectItem value="sr">🇸🇷 Suriname</SelectItem>
                    <SelectItem value="se">🇸🇪 Sweden</SelectItem>
                    <SelectItem value="ch">🇨🇭 Switzerland</SelectItem>
                    <SelectItem value="sy">🇸🇾 Syria</SelectItem>
                    <SelectItem value="tw">🇹🇼 Taiwan</SelectItem>
                    <SelectItem value="tj">🇹🇯 Tajikistan</SelectItem>
                    <SelectItem value="tz">🇹🇿 Tanzania</SelectItem>
                    <SelectItem value="th">🇹🇭 Thailand</SelectItem>
                    <SelectItem value="tl">🇹🇱 Timor-Leste</SelectItem>
                    <SelectItem value="tg">🇹🇬 Togo</SelectItem>
                    <SelectItem value="to">🇹🇴 Tonga</SelectItem>
                    <SelectItem value="tt">🇹🇹 Trinidad and Tobago</SelectItem>
                    <SelectItem value="tn">🇹🇳 Tunisia</SelectItem>
                    <SelectItem value="tr">🇹🇷 Turkey</SelectItem>
                    <SelectItem value="tm">🇹🇲 Turkmenistan</SelectItem>
                    <SelectItem value="tv">🇹🇻 Tuvalu</SelectItem>
                    <SelectItem value="ug">🇺🇬 Uganda</SelectItem>
                    <SelectItem value="ua">🇺🇦 Ukraine</SelectItem>
                    <SelectItem value="ae">🇦🇪 United Arab Emirates</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="us">🇺🇸 United States</SelectItem>
                    <SelectItem value="uy">🇺🇾 Uruguay</SelectItem>
                    <SelectItem value="uz">🇺🇿 Uzbekistan</SelectItem>
                    <SelectItem value="vu">🇻🇺 Vanuatu</SelectItem>
                    <SelectItem value="va">🇻🇦 Vatican City</SelectItem>
                    <SelectItem value="ve">🇻🇪 Venezuela</SelectItem>
                    <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                    <SelectItem value="ye">🇾🇪 Yemen</SelectItem>
                    <SelectItem value="zm">🇿🇲 Zambia</SelectItem>
                    <SelectItem value="zw">🇿🇼 Zimbabwe</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nationality && <p className="text-sm text-red-500 mt-1">{errors.nationality}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clubs">Clubs</Label>
                <Input
                  id="clubs"
                  name="clubs"
                  placeholder="Enter clubs"
                  className={`border-gray-200 ${errors.clubs ? "border-red-500" : ""}`}
                  value={formData.clubs}
                  onChange={onInputChange}
                  disabled={disabled}
                />
                {errors.clubs && <p className="text-sm text-red-500 mt-1">{errors.clubs}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunch">Lunch Preference</Label>
                <Select
                  value={formData.lunch}
                  onValueChange={(value) => onSelectChange("lunch", value)}
                  disabled={disabled}
                >
                  <SelectTrigger id="lunch" className={errors.lunch ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select lunch preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                {errors.lunch && <p className="text-sm text-red-500 mt-1">{errors.lunch}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="honorRolls" className="cursor-pointer">
                    Honor Rolls
                  </Label>
                  <Switch
                    id="honorRolls"
                    checked={formData.honorRolls}
                    onCheckedChange={(checked) => onSelectChange("honorRolls", checked)}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="athletics" className="cursor-pointer">
                    Athletics
                  </Label>
                  <Switch
                    id="athletics"
                    checked={formData.athletics}
                    onCheckedChange={(checked) => onSelectChange("athletics", checked)}
                    disabled={disabled}
                  />
                </div>
              </div>
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


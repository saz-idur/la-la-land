"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { updateHealthProfile } from "@/app/actions/health-profile"
import { toast } from "@/components/ui/use-toast"

interface HealthProfile {
  id: string
  userId: string
  dateOfBirth: Date | null
  gender: string | null
  height: number | null
  weight: number | null
  allergies: string[]
  chronicConditions: string[]
  familyHistory: string[]
}

interface HealthProfileFormProps {
  initialData: HealthProfile | null
}

export function HealthProfileForm({ initialData }: HealthProfileFormProps) {
  const router = useRouter()
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : undefined,
  )
  const [gender, setGender] = useState(initialData?.gender || "")
  const [height, setHeight] = useState(initialData?.height?.toString() || "")
  const [weight, setWeight] = useState(initialData?.weight?.toString() || "")
  const [allergies, setAllergies] = useState(initialData?.allergies.join(", ") || "")
  const [chronicConditions, setChronicConditions] = useState(initialData?.chronicConditions.join(", ") || "")
  const [familyHistory, setFamilyHistory] = useState(initialData?.familyHistory.join(", ") || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateHealthProfile({
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        gender,
        height: height ? Number.parseFloat(height) : null,
        weight: weight ? Number.parseFloat(weight) : null,
        allergies: allergies ? allergies.split(",").map((item) => item.trim()) : [],
        chronicConditions: chronicConditions ? chronicConditions.split(",").map((item) => item.trim()) : [],
        familyHistory: familyHistory ? familyHistory.split(",").map((item) => item.trim()) : [],
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Health profile updated successfully",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update health profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating health profile:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Personal Health Information</CardTitle>
        <CardDescription>Update your health profile to get personalized recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="dob" className="text-sm font-medium">
                Date of Birth
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dob"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/5 border-white/10",
                      !dateOfBirth && "text-gray-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfBirth ? format(dateOfBirth, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">
                Height (cm)
              </label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="allergies" className="text-sm font-medium">
              Allergies (comma separated)
            </label>
            <Textarea
              id="allergies"
              placeholder="e.g., Peanuts, Penicillin, Latex"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="chronicConditions" className="text-sm font-medium">
              Chronic Conditions (comma separated)
            </label>
            <Textarea
              id="chronicConditions"
              placeholder="e.g., Asthma, Diabetes, Hypertension"
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="familyHistory" className="text-sm font-medium">
              Family Medical History (comma separated)
            </label>
            <Textarea
              id="familyHistory"
              placeholder="e.g., Heart disease, Cancer, Diabetes"
              value={familyHistory}
              onChange={(e) => setFamilyHistory(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <Button type="submit" className="w-full bg-genrivia-blue hover:bg-genrivia-blue/90" disabled={isSubmitting}>
            {isSubmitting ? "Updating Profile..." : "Update Health Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


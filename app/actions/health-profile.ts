"use server"

import { revalidatePath } from "next/cache"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function updateHealthProfile({
  dateOfBirth,
  gender,
  height,
  weight,
  allergies,
  chronicConditions,
  familyHistory,
}: {
  dateOfBirth: string | null
  gender: string
  height: number | null
  weight: number | null
  allergies: string[]
  chronicConditions: string[]
  familyHistory: string[]
}) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to update your health profile",
      }
    }

    // Check if health profile exists
    const existingProfile = await db.healthProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (existingProfile) {
      // Update existing profile
      await db.healthProfile.update({
        where: {
          userId: session.user.id,
        },
        data: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          height,
          weight,
          allergies,
          chronicConditions,
          familyHistory,
        },
      })
    } else {
      // Create new profile
      await db.healthProfile.create({
        data: {
          userId: session.user.id,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          height,
          weight,
          allergies,
          chronicConditions,
          familyHistory,
        },
      })
    }

    revalidatePath("/dashboard/health-profile")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Health profile updated successfully",
    }
  } catch (error) {
    console.error("Error in updateHealthProfile:", error)
    return {
      success: false,
      message: "Failed to update health profile",
    }
  }
}


import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { HealthProfileForm } from "@/components/health-profile/health-profile-form"
import { db } from "@/lib/db"

export default async function HealthProfilePage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/health-profile")
  }

  // Get user's health profile
  const healthProfile = await db.healthProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Health Profile" text="Manage your personal health information and preferences." />
      <div className="mt-8">
        <HealthProfileForm initialData={healthProfile} />
      </div>
    </DashboardShell>
  )
}


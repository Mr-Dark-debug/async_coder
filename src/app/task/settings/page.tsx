import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SidebarDemo } from '@/components/ui/demo'
import { SettingsContent } from '@/components/settings/settings-content'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen">
      <SidebarDemo>
        <SettingsContent />
      </SidebarDemo>
    </div>
  )
}
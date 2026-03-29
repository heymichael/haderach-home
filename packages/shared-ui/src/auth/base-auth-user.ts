import type { NavApp } from '../components/GlobalNav.tsx'

export interface BaseAuthUser {
  email: string
  photoURL?: string
  displayName?: string
  accessibleApps: NavApp[]
  accessibleAdminApps: NavApp[]
  signOut: () => void
  getIdToken: () => Promise<string>
}

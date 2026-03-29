import type { NavApp } from './app-catalog.ts'

export interface BaseAuthUser {
  email: string
  photoURL?: string
  displayName?: string
  accessibleApps: NavApp[]
  signOut: () => void
  getIdToken: () => Promise<string>
}

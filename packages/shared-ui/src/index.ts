export { cn } from "./lib/utils.ts"
export { Button, buttonVariants } from "./components/ui/button.tsx"
export { Input } from "./components/ui/input.tsx"
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select.tsx"
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./components/ui/card.tsx"
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu.tsx"
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./components/ui/tooltip.tsx"
export { Separator } from "./components/ui/separator.tsx"
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet.tsx"
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar.tsx"
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table.tsx"
export { DataTable } from "./components/ui/data-table.tsx"
export { FilterableHeader, setFilterFn } from "./components/ui/filterable-header.tsx"
export type { FilterableHeaderProps } from "./components/ui/filterable-header.tsx"
export { DetailRow, EditRow, SelectRow, CheckboxRow } from "./components/ui/form-rows.tsx"
export type { DetailRowProps, EditRowProps, SelectRowProps, CheckboxRowProps } from "./components/ui/form-rows.tsx"
export { formatCurrency, formatMonthHeader, pivotLongToWide } from "./lib/pivot.ts"
export type { PivotRow, PivotInput } from "./lib/pivot.ts"
export type { ColumnDef } from "@tanstack/react-table"
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs.tsx"
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart,
} from "./components/ui/chart.tsx"
export type { ChartConfig } from "./components/ui/chart.tsx"
export { useIsMobile } from "./hooks/use-mobile.ts"
export { usePrefetchApps } from "./hooks/use-prefetch-apps.ts"
export { GlobalNav } from "./components/GlobalNav.tsx"
export type { GlobalNavProps } from "./components/GlobalNav.tsx"
export type { NavApp } from "./auth/app-catalog.ts"
export { AppRail, useRailExpanded } from "./components/app-rail.tsx"
export type { AppRailProps } from "./components/app-rail.tsx"
export { PaneToolbar } from "./components/pane-toolbar.tsx"
export type { PaneToolbarProps, PaneId } from "./components/pane-toolbar.tsx"
export { PaneLayout } from "./components/pane-layout.tsx"
export type { PaneLayoutHandle, PaneLayoutProps } from "./components/pane-layout.tsx"
export {
  APP_CATALOG,
  APP_GRANTING_ROLES,
  ADMIN_CATALOG,
  ADMIN_GRANTING_ROLES,
  hasAppAccess,
  getAccessibleApps,
  getAccessibleRailApps,
  getAccessibleAdminApps,
} from "./auth/app-catalog.ts"
export type { BaseAuthUser } from "./auth/base-auth-user.ts"
export type { BaseUserDoc, UserDoc } from "./auth/user-doc.ts"
export { fetchUserDoc, buildDisplayName } from "./auth/user-doc.ts"
export { getAuthRuntimeConfig } from "./auth/runtime-config.ts"
export type { FirebaseWebConfig } from "./auth/runtime-config.ts"
export { AuthGate, AuthUserContext, useAuthUser } from "./auth/auth-gate.tsx"
export type { AuthGateProps, AuthGateCallbacks } from "./auth/auth-gate.tsx"
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog.tsx"
export { agentFetch } from "./lib/agent-fetch.ts"
export { fetchBranding, useBranding } from "./lib/branding.ts"
export type { Branding, LockupMode } from "./lib/branding.ts"
export { FeedbackPopover } from "./components/feedback-popover.tsx"
export type { FeedbackPopoverProps } from "./components/feedback-popover.tsx"
export { ChatPanel } from "./components/chat-panel.tsx"
export type { ChatPanelHandle, ChatPanelProps, ChatMessage, ChatChoice, ChatPendingAction } from "./components/chat-panel.tsx"
export { ChatTable } from "./components/chat-table.tsx"
export type { ChatTablePayload } from "./components/chat-table.tsx"
export { ViewModeToggle } from "./components/view-mode-toggle.tsx"
export type { ViewMode, ViewModeToggleProps } from "./components/view-mode-toggle.tsx"
export { ChatToggle } from "./components/chat-toggle.tsx"
export type { ChatToggleProps } from "./components/chat-toggle.tsx"
export { TagBadge, tagBadgeVariants } from "./components/ui/tag-badge.tsx"
export { MultiSelect } from "./components/ui/multi-select.tsx"
export type { MultiSelectItem, MultiSelectProps } from "./components/ui/multi-select.tsx"
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./components/ui/popover.tsx"
export { Calendar } from "./components/ui/calendar.tsx"
export type { CalendarProps } from "./components/ui/calendar.tsx"
export { DateRangePicker } from "./components/ui/date-range-picker.tsx"
export type { DateRangePickerProps } from "./components/ui/date-range-picker.tsx"
export type { DateRange } from "react-day-picker"
export { AdminModal } from "./components/admin/admin-modal.tsx"
export type { AdminModalProps } from "./components/admin/admin-modal.tsx"
export { UserTable } from "./components/admin/user-table.tsx"
export type { UserTableColumn, UserTableProps } from "./components/admin/user-table.tsx"

import { cn } from "../../lib/utils.ts"
import { Input } from "./input.tsx"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select.tsx"

interface DetailRowProps {
  label: string
  value?: string | null
  className?: string
}

function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <div className={cn("grid grid-cols-[160px_1fr] gap-2 py-1.5", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm">{value || "—"}</span>
    </div>
  )
}

interface EditRowProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  className?: string
}

function EditRow({ label, value, onChange, type = "text", className }: EditRowProps) {
  return (
    <div className={cn("grid grid-cols-[160px_1fr] gap-2 py-1.5 items-center", className)}>
      <label className="text-sm text-muted-foreground">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
      />
    </div>
  )
}

interface SelectRowProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}

function SelectRow({ label, value, onChange, options, className }: SelectRowProps) {
  return (
    <div className={cn("grid grid-cols-[160px_1fr] gap-2 py-1.5 items-center", className)}>
      <label className="text-sm text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface CheckboxRowProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  className?: string
}

function CheckboxRow({ label, checked, onChange, className }: CheckboxRowProps) {
  return (
    <div className={cn("grid grid-cols-[160px_1fr] gap-2 py-1.5 items-center", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input accent-primary"
      />
    </div>
  )
}

export { DetailRow, EditRow, SelectRow, CheckboxRow }
export type { DetailRowProps, EditRowProps, SelectRowProps, CheckboxRowProps }

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../../lib/utils.ts"
import { Button } from "./button.tsx"
import { Calendar } from "./calendar.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "./popover.tsx"

interface DateRangePickerProps {
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
  className?: string
  placeholder?: string
  numberOfMonths?: number
}

function DateRangePicker({
  range,
  onRangeChange,
  className,
  placeholder = "Pick a date range",
  numberOfMonths = 1,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 justify-start text-left font-normal",
              !range?.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} –{" "}
                  {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={onRangeChange}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { DateRangePicker }
export type { DateRangePickerProps }

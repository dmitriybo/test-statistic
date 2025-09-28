'use client'

import { FC, Ref, useEffect, useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'

interface DateFieldProps {
  label: string
  placeholder?: string
  name?: string
  value?: Date | undefined
  className?: string
  error?: string
  onChange?: (value: Date | undefined) => void
  onBlur?: () => void
  ref?: Ref<HTMLInputElement>
}

export const DateField: FC<DateFieldProps> = ({
  label,
  placeholder = 'Выберите дату',
  name,
  value,
  error,
  className,
  onChange,
  onBlur,
  ref,
}) => {
  if (!value) {
    value = undefined
  }
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(value)
  const id = useId()

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onChange?.(newDate)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!open) {
      onBlur?.()
    }
  }

  useEffect(() => {
    if (date?.getDate() !== value?.getDate()) {
      setDate(value)
    }
  }, [value])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Label className="px-1" htmlFor={id}>
        {label}
      </Label>
      <input name={name} ref={ref} type="hidden" value={date?.toISOString() ?? ''} />
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-48 justify-between font-normal" id={id} variant="outline">
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        {error && <p className="text-sm text-destructive -mt-2">{error}</p>}
        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
          <Calendar
            captionLayout="dropdown"
            mode="single"
            onSelect={(date) => {
              handleDateChange(date)
              setOpen(false)
            }}
            selected={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

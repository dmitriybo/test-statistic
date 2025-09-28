'use client'

import { FC, useState } from 'react'

import { Label } from '@/components/ui/label'
import { MultiSelect, MultiSelectProps } from '@/components/ui/multi-select'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectFieldProps extends Omit<Partial<MultiSelectProps>, 'onValueChange' | 'onChange'> {
  label: string
  placeholder?: string
  onChange?: (value: string[]) => void
  error?: string
  options: MultiSelectOption[]
}

export const MultiSelectField: FC<MultiSelectFieldProps> = ({ label, onChange, error, className, ...props }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleValueChange = (values: string[]) => {
    setSelectedValues(values)
    onChange?.(values)
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Label className="px-1" htmlFor="date">
        {label}
      </Label>
      <MultiSelect defaultValue={selectedValues} onValueChange={handleValueChange} {...props} />
      {error && <p className="text-sm text-destructive -mt-2">{error}</p>}
    </div>
  )
}

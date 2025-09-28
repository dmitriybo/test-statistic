import { ComponentPropsWithoutRef, FC, useId } from 'react'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps extends Partial<ComponentPropsWithoutRef<typeof Select>> {
  className?: string
  label: string
  placeholder?: string
  error?: string
  onChange?: (value: string) => void
  options?: SelectOption[]
}

export const SelectField: FC<SelectFieldProps> = ({
  className,
  label,
  placeholder,
  options,
  error,
  onChange,
  ...props
}) => {
  const id = useId()

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Label className="px-1" htmlFor={id}>
        {label}
      </Label>
      <Select onValueChange={onChange} {...props}>
        <SelectTrigger>
          <SelectValue id={id} placeholder={placeholder} />
        </SelectTrigger>
        {error && <p className="text-sm text-destructive -mt-2">{error}</p>}
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

import { ComponentPropsWithoutRef, FC, useId } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface CheckboxFieldProps extends Omit<Partial<ComponentPropsWithoutRef<typeof Checkbox>>, 'onChange'> {
  label: string
  className?: string
  onChange?: (value: boolean) => void
}

export const CheckboxField: FC<CheckboxFieldProps> = ({ label, className, onChange }) => {
  const id = useId()

  return (
    <div className={cn('flex items-center', className)}>
      <Checkbox id={id} onCheckedChange={(value) => onChange?.(Boolean(value))} />
      <Label className="pl-2" htmlFor={id}>
        {label}
      </Label>
    </div>
  )
}

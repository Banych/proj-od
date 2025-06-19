import { ComponentProps, forwardRef } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputWithLabelProps = ComponentProps<typeof Input> & {
  label: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  invalid?: boolean
  error?: string
}

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, id, orientation, size, invalid, error, ...others }, ref) => {
    return (
      <div
        className={cn(
          'flex gap-2',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
        )}
      >
        <Label htmlFor={id}>{label}</Label>
        <div className="flex flex-col gap-2">
          <Input
            {...others}
            ref={ref}
            id={id}
            className={cn(
              'w-full',
              others.type === 'checkbox'
                ? size === 'sm'
                  ? 'size-6'
                  : size === 'lg'
                    ? 'size-8'
                    : 'size-7'
                : '',
              invalid && 'border-red-500 focus:ring-red-500'
            )}
          />
          {error && (
            <p className="max-w-[300px] text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    )
  }
)

InputWithLabel.displayName = 'InputWithLabel'

export default InputWithLabel

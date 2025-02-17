import { ComponentProps, FC } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputWithLabelProps = ComponentProps<typeof Input> & {
    label: string
    orientation?: 'horizontal' | 'vertical'
    size?: 'sm' | 'md' | 'lg'
}

const InputWithLabel: FC<InputWithLabelProps> = ({
    label,
    id,
    orientation,
    size,
    ...others
}) => {
    return (
        <div
            className={cn(
                'flex gap-2',
                orientation === 'horizontal'
                    ? 'flex-row items-center'
                    : 'flex-col',
                size === 'sm'
                    ? 'text-sm'
                    : size === 'lg'
                      ? 'text-lg'
                      : 'text-base'
            )}
        >
            <Label htmlFor={id}>{label}</Label>
            <Input
                {...others}
                id={id}
                className={cn(
                    'w-full',
                    others.type === 'checkbox'
                        ? size === 'sm'
                            ? 'size-6'
                            : size === 'lg'
                              ? 'size-8'
                              : 'size-7'
                        : ''
                )}
            />
        </div>
    )
}

export default InputWithLabel

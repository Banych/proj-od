import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ComponentProps, FC } from 'react'

type InputWithLabelProps = ComponentProps<typeof Input> & {
    label: string
}

const InputWithLabel: FC<InputWithLabelProps> = ({ label, id, ...others }) => {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input {...others} id={id} />
        </div>
    )
}

export default InputWithLabel

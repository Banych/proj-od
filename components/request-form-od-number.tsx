import { Plus, X } from 'lucide-react'
import { FC } from 'react'
import {
  Control,
  Controller,
  useFieldArray,
  useFormState,
} from 'react-hook-form'
import { RequestFormValidatorType } from '../lib/validators/request-form.validator'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type Props = {
  control: Control<RequestFormValidatorType>
  isPending?: boolean
}

const RequestFormODNumber: FC<Props> = ({ control, isPending }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'odNumber',
    keyName: 'id',
  })

  const { errors } = useFormState({ control })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">OD номера</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '' })}
              disabled={fields.length >= 10 || isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-base font-normal">
            Добавить OD номер (макс. 10)
          </TooltipContent>
        </Tooltip>
      </div>
      {errors.odNumber && (
        <span className="text-red-500 text-sm">{errors.odNumber.message}</span>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fields.map((field, index) => (
          <Controller
            name={`odNumber.${index}.name`}
            control={control}
            key={field.id}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex items-center gap-2 col-span-1 col-end-2">
                <Input
                  value={value}
                  onChange={onChange}
                  placeholder="Введите OD"
                  disabled={isPending}
                  className={error ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default RequestFormODNumber

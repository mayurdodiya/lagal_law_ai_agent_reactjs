import type { Control, FieldPath, FieldValues } from "react-hook-form"

export type FormInputProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  id?: string
  name: TName
  label?: string
  className?: string
  labelClassName?: string
  containerClassName?: string
  noValidate?: boolean
  fullWidth?: boolean
}
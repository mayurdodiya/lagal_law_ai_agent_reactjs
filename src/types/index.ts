import type { ReactNode } from 'react'

export type ChildrenType = Readonly<{ children: ReactNode }>

export type FileWithPreview = File & { preview: string }

export type BelongsToType = {
  isAI: boolean
}

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
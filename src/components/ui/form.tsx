import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const Form = FormProvider

const FormField = ({ ...props }) => {
  return <Controller {...props} />
}

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return <Label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  return <Slot ref={ref} {...props} />
})
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef(({ className, ...props }, ref) => {
  const { error } = useFormContext()
  return error ? <p ref={ref} className={cn("text-sm text-destructive", className)} {...props}>{error.message}</p> : null
})
FormMessage.displayName = "FormMessage"

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }

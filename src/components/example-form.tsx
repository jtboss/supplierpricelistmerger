"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Loader2, Upload } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Form validation schema using Zod
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    file: z.any().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ExampleFormProps {
    onSubmit?: (data: FormData) => void
    className?: string
}

export function ExampleForm({ onSubmit, className }: ExampleFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle')

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    const handleSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            if (onSubmit) {
                onSubmit(data)
            }

            setSubmitStatus('success')
            form.reset()
        } catch {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={cn("w-full max-w-md mx-auto", className)}
        >
            <Card>
                <CardHeader>
                    <motion.div variants={itemVariants}>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Example Form
                        </CardTitle>
                        <CardDescription>
                            A demo form showcasing React Hook Form, Framer Motion, shadcn/ui, and Lucide icons
                        </CardDescription>
                    </motion.div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Name
                            </label>
                            <Input
                                id="name"
                                placeholder="Enter your name"
                                {...form.register("name")}
                                className={cn(
                                    form.formState.errors.name && "border-destructive"
                                )}
                            />
                            {form.formState.errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="text-sm text-destructive flex items-center gap-1"
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    {form.formState.errors.name.message}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...form.register("email")}
                                className={cn(
                                    form.formState.errors.email && "border-destructive"
                                )}
                            />
                            {form.formState.errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="text-sm text-destructive flex items-center gap-1"
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    {form.formState.errors.email.message}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Form'
                                )}
                            </Button>
                        </motion.div>

                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Form submitted successfully!
                            </motion.div>
                        )}

                        {submitStatus === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md"
                            >
                                <AlertCircle className="h-4 w-4" />
                                Something went wrong. Please try again.
                            </motion.div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
} 
"use client"

import { ExampleForm } from "@/components/example-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Code, Palette, Zap } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Main App
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                        shadcn/ui Setup Complete! 🎉
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Your Next.js project is now configured with shadcn/ui, Tailwind CSS, Framer Motion,
                        React Hook Form, and Lucide React icons.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-lg">shadcn/ui</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center">
                                Beautiful, accessible components built with Radix UI and Tailwind CSS
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-lg">Framer Motion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center">
                                Smooth animations and micro-interactions for enhanced user experience
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle className="text-lg">React Hook Form</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center">
                                Performant forms with easy validation and minimal re-renders
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <CardTitle className="text-lg">Lucide Icons</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center">
                                Beautiful, customizable SVG icons for modern web applications
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                {/* Example Form */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Interactive Demo
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Try out the form below to see all the technologies working together
                        </p>
                    </div>

                    <ExampleForm
                        onSubmit={(data) => {
                            console.log('Form submitted:', data)
                        }}
                    />
                </div>

                {/* Setup Summary */}
                <Card className="bg-slate-50 dark:bg-slate-800/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            What&apos;s Been Configured
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium">Packages Installed:</h4>
                                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>✅ shadcn/ui components (button, input, card)</li>
                                    <li>✅ Tailwind CSS with custom configuration</li>
                                    <li>✅ Framer Motion for animations</li>
                                    <li>✅ React Hook Form with Zod validation</li>
                                    <li>✅ Lucide React icons</li>
                                    <li>✅ clsx for conditional classes</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">Files Created/Updated:</h4>
                                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                    <li>📁 components.json</li>
                                    <li>📁 tailwind.config.ts</li>
                                    <li>📁 src/app/globals.css (updated with CSS variables)</li>
                                    <li>📁 src/components/ui/* (shadcn/ui components)</li>
                                    <li>📁 src/components/example-form.tsx</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Ready to build amazing UIs! 🚀
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="outline" asChild>
                            <a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noopener noreferrer">
                                Browse Components
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer">
                                Tailwind Docs
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="https://framer.com/motion" target="_blank" rel="noopener noreferrer">
                                Framer Motion
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 
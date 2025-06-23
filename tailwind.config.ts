import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // Aceternity UI Colors
            colors: {
                // shadcn/ui compatibility
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Aceternity UI specific colors
                aceternity: {
                    primary: "#a855f7",
                    secondary: "#ec4899",
                    text: {
                        primary: "#ffffff",
                        secondary: "#d1d5db",
                        muted: "#9ca3af",
                        accent: "#a855f7"
                    },
                    surface: {
                        card: "rgba(0, 0, 0, 0.4)",
                        "card-hover": "rgba(0, 0, 0, 0.6)",
                        glass: "rgba(255, 255, 255, 0.05)",
                        border: "rgba(255, 255, 255, 0.1)",
                        "border-hover": "rgba(168, 85, 247, 0.5)"
                    },
                    status: {
                        success: "#10b981",
                        warning: "#f59e0b",
                        error: "#ef4444",
                        info: "#3b82f6"
                    }
                }
            },
            // Gradients
            backgroundImage: {
                'gradient-primary': 'linear-gradient(to right, #a855f7, #ec4899)',
                'gradient-secondary': 'linear-gradient(to bottom right, #8b5cf6, #ec4899)',
                'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
                'gradient-beams': 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
                'gradient-glow': 'conic-gradient(from 90deg at 50% 50%, #E2CBFF 0%, #393BB2 50%, #E2CBFF 100%)',
                'gradient-card': 'linear-gradient(to right, #7c3aed, #ec4899)',
                'gradient-text-hero': 'linear-gradient(to right, #ffffff, #e879f9, #f9a8d4)',
                'gradient-text-accent': 'linear-gradient(to right, #a855f7, #ec4899)',
                'grid-pattern': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
            },
            // Typography
            fontSize: {
                'hero': 'clamp(3rem, 8vw, 7rem)',
                'h1': '3.75rem',
                'h2': '2.25rem',
                'h3': '1.875rem',
            },
            letterSpacing: {
                'tight': '-0.025em',
                'wide': '0.025em',
            },
            lineHeight: {
                'tight': '1.25',
                'relaxed': '1.75',
            },
            // Spacing
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            // Border radius
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                '2xl': '1.5rem',
                '3xl': '1.875rem',
            },
            // Box shadows
            boxShadow: {
                'glow-subtle': '0 0 20px rgba(168, 85, 247, 0.3)',
                'glow-medium': '0 0 40px rgba(168, 85, 247, 0.4)',
                'glow-strong': '0 0 60px rgba(168, 85, 247, 0.6)',
                'card': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'float': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            },
            // Animations
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "float": {
                    "0%": {
                        opacity: "0.3",
                        transform: "translateY(0px) rotate(0deg)"
                    },
                    "100%": {
                        opacity: "0.8",
                        transform: "translateY(-20px) rotate(5deg)"
                    }
                },
                "tilt": {
                    "0%, 50%, 100%": { transform: "rotate(0deg)" },
                    "25%": { transform: "rotate(1deg)" },
                    "75%": { transform: "rotate(-1deg)" }
                },
                "spin": {
                    "from": { transform: "rotate(0deg)" },
                    "to": { transform: "rotate(360deg)" }
                },
                "pulse": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" }
                },
                "shimmer": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" }
                },
                "beam-float": {
                    "0%, 100%": {
                        transform: "translateY(0px) rotate(0deg)",
                        opacity: "0.2"
                    },
                    "50%": {
                        transform: "translateY(-10px) rotate(2deg)",
                        opacity: "0.4"
                    }
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "float": "float 2s ease-in-out infinite alternate",
                "tilt": "tilt 10s infinite linear",
                "spin": "spin 2s linear infinite",
                "pulse": "pulse 2s infinite",
                "shimmer": "shimmer 2s infinite",
                "beam-float": "beam-float ease-in-out infinite alternate",
            },
            // Backdrop filters
            backdropBlur: {
                xs: '2px',
            },
            // Font families
            fontFamily: {
                sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            // Transition timing functions
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            // Transition durations
            transitionDuration: {
                '150': '150ms',
                '200': '200ms',
                '250': '250ms',
                '300': '300ms',
                '400': '400ms',
                '500': '500ms',
                '1000': '1000ms',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        // Custom plugin for Aceternity UI utilities
        function ({ addUtilities }: any) {
            const newUtilities = {
                '.text-gradient-hero': {
                    background: 'var(--gradient-text-hero)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                },
                '.text-gradient-accent': {
                    background: 'var(--gradient-text-accent)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                },
                '.glassmorphism': {
                    'backdrop-filter': 'blur(16px)',
                    background: 'var(--surface-glass)',
                    border: '1px solid var(--surface-border)',
                },
                '.grid-pattern': {
                    'background-image': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    'background-size': '50px 50px',
                    'mask-image': 'radial-gradient(ellipse at center, transparent 20%, black)',
                },
                '.glow-effect': {
                    'box-shadow': 'var(--shadow-glow-subtle)',
                    filter: 'brightness(1.1)',
                },
            }
            addUtilities(newUtilities)
        }
    ],
} satisfies Config

export default config 

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// The Frick color palette (beige/cream theme)
				'the-frick': {
					'bg': '#F4EFE6',              // Main background (warm beige)
					'surface': '#EBE4D8',         // Card/surface (darker beige)
					'card-beige': '#E8DCC8',      // Card variant 1
					'card-mint': '#C8DDD3',       // Card variant 2 (mint)
					'card-lavender': '#D5D3E8',   // Card variant 3 (lavender)
					'rust': '#CC7A63',            // Primary accent (terracotta/rust)
					'text': '#1A1A1A',            // Primary text (almost black)
					'text-hover': '#2A2A2A',      // Text hover state (slightly lighter)
					'text-muted': '#666666',      // Secondary text
					'border': '#D4C9BA',          // Borders
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				'pulse-hard': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.15)' },
				},
				'bounce-slight': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'float': {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'25%': { transform: 'translate(10px, -10px)' },
					'50%': { transform: 'translate(0, -5px)' },
					'75%': { transform: 'translate(-10px, -10px)' },
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'shine': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'pulse-hard': 'pulse-hard 2s ease-in-out infinite',
				'bounce-slight': 'bounce-slight 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'slide-in': 'slide-in 0.6s ease-out forwards',
				'shine': 'shine 3s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'display': ['ABC Diatype', 'Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'display-xs': 'clamp(1.125rem, 1.087rem + 0.163vw, 1.25rem)',
				'display-m': 'clamp(1.75rem, 1.673rem + 0.326vw, 2rem)',
				'display-l': 'clamp(2rem, 1.694rem + 1.306vw, 3rem)',
				'display-xl': 'clamp(2.5rem, 2.041rem + 1.959vw, 4rem)',
				'display-xxl': 'clamp(3rem, 2.388rem + 2.612vw, 5rem)',
			},
			spacing: {
				'site-margin': 'clamp(2rem, 1.082rem + 3.918vw, 5rem)',
			},
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;

import type { Config } from "tailwindcss";

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
				'cyber-dark': '#050508',
				'cyber-cyan': '#00f5ff',
				'cyber-blue': '#0ea5e9',
				'cyber-card': 'rgba(0, 245, 255, 0.03)',
				'cyber-border': 'rgba(0, 245, 255, 0.1)',
				'cockpit': {
					bg: '#09090B',
					surface: '#18181B',
					emerald: '#10B981',
					text: '#e2e2e2',
					'text-muted': '#bbcabf',
					border: 'rgba(255,255,255,0.1)',
				},
				'hex': {
					'surface': '#111318',
					'surface-dim': '#111318',
					'surface-bright': '#37393e',
					'surface-container-lowest': '#0c0e12',
					'surface-container-low': '#1a1c20',
					'surface-container': '#1e2024',
					'surface-container-high': '#282a2e',
					'surface-container-highest': '#333539',
					'primary': '#ffffff',
					'primary-fixed': '#00fbfb',
					'primary-fixed-dim': '#00dddd',
					'secondary': '#6fd7d6',
					'secondary-container': '#2fa09f',
					'tertiary': '#ffffff',
					'error': '#ffb4ab',
					'error-container': '#93000a',
					'outline': '#839493',
					'outline-variant': '#3a4a49',
					'cyan-glow': 'rgba(0, 251, 251, 0.3)',
				}
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
				display: ['Space Grotesk', 'sans-serif'],
				h1: ['Space Grotesk', 'sans-serif'],
				h2: ['Space Grotesk', 'sans-serif'],
				'body-base': ['Inter', 'sans-serif'],
				'body-sm': ['Inter', 'sans-serif'],
				'meta-mono': ['JetBrains Mono', 'monospace'],
				'code-block': ['JetBrains Mono', 'monospace'],
				'stat-lg': ['JetBrains Mono', 'monospace'],
				'headline-xl': ['Space Grotesk', 'sans-serif'],
				'headline-lg': ['Space Grotesk', 'sans-serif'],
				'monospace-data': ['Inter', 'sans-serif'],
				'label-caps': ['Space Grotesk', 'sans-serif'],
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
				'pulse-glow': {
					'0%, 100%': { opacity: '0.3' },
					'50%': { opacity: '0.7' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 4s infinite ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

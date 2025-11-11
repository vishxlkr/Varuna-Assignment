import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

export function Button({
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<Variant, string> = {
    primary: 'bg-gradient-to-r from-ocean-500 via-sky-500 to-indigo-500 text-white shadow-glow hover:brightness-110 focus-visible:outline-sky-300',
    secondary: 'bg-slate-800/80 text-slate-100 border border-slate-700 hover:bg-slate-700/80 focus-visible:outline-slate-500',
    danger: 'bg-red-600/90 text-white hover:bg-red-500 focus-visible:outline-red-300',
    ghost: 'bg-transparent text-slate-300 hover:bg-white/10 border border-white/10 focus-visible:outline-slate-500',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props} />
}


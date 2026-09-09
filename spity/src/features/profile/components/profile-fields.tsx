'use client'

import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { z } from 'zod'
import { cn } from '@/lib/class-names'

export function ProfileSelect({ label, hideLabel = false, options, error, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; hideLabel?: boolean; options: Record<string, string>; error?: string }) {
  const generated = useId()
  const id = props.id ?? generated
  return <div className="min-w-0"><label className={cn(hideLabel ? 'sr-only' : 'mb-1.5 block text-sm font-medium')} htmlFor={id}>{label}</label><select {...props} id={id} className="spity-input min-h-11" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}>
    {Object.entries(options).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
  </select>{error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}</div>
}
export function Choice({ children }: { children: ReactNode }) {
  return <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-checked:bg-secondary">{children}</label>
}
export function FormError({ message }: { message: string | null }) {
  return message ? <p className="text-pretty text-sm text-destructive" role="alert">{message}</p> : null
}
export async function apiData(response: Response): Promise<unknown> {
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const parsed = z.object({ error: z.string() }).safeParse(data)
    throw new Error(response.status === 401 ? 'Ta session a expiré. Reconnecte-toi avant de réessayer.' : parsed.success ? parsed.data.error : 'Impossible d’enregistrer. Réessaie dans un instant.')
  }
  return data
}
const uploadSchema = z.object({ media: z.object({ id: z.string().uuid(), url: z.string() }) })
export async function uploadProfileImage(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Choisis une image JPG, PNG ou WebP de 5 Mio maximum.')
  const body = new FormData()
  body.set('file', file)
  return uploadSchema.parse(await apiData(await fetch('/api/media', { method: 'POST', body }))).media
}
export function failureMessage(error: unknown) {
  return error instanceof Error && !(error instanceof z.ZodError) && error.name !== 'TypeError' ? error.message : 'Connexion interrompue ou réponse inattendue. Tes informations sont conservées : tu peux réessayer.'
}

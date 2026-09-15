import { z } from 'zod'

export class ApiRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

const errorSchema = z.object({ error: z.string() })

export async function requestJson<T>(url: string, schema: z.ZodType<T>, options?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, { cache: 'no-store', ...options })
  } catch (error) {
    if (options?.signal?.aborted) throw error
    throw new ApiRequestError('Connexion interrompue. Actualisez pour vérifier le résultat avant de réessayer.')
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const parsed = errorSchema.safeParse(payload)
    throw new ApiRequestError(parsed.success ? parsed.data.error : 'Le service est momentanément indisponible.', response.status)
  }

  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    throw new ApiRequestError('Le résultat n’a pas pu être confirmé. Actualisez avant de réessayer.')
  }

  return parsed.data
}

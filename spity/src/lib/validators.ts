import { z } from 'zod'

// === AUTH VALIDATORS ===

const utf8ByteLength = (value: string) => {
  return Array.from(value).reduce((length, character) => {
    const codePoint = character.codePointAt(0) ?? 0

    if (codePoint <= 0x7f) {
      return length + 1
    }

    if (codePoint <= 0x7ff) {
      return length + 2
    }

    return length + (codePoint <= 0xffff ? 3 : 4)
  }, 0)
}

const bcryptInputSchema = z.string().refine(
  (value) => utf8ByteLength(value) <= 72,
  'Le mot de passe ne doit pas dépasser 72 octets'
)

export const registerSchema = z.object({
  email: z.string().max(255, 'Email trop long').email('Email invalide'),
  password: bcryptInputSchema
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  role: z.enum(['grimpeur', 'club'], {
    message: 'Rôle invalide'
  }),
})

export const loginSchema = z.object({
  email: z.string().max(255, 'Email trop long').email('Email invalide'),
  password: bcryptInputSchema.min(1, 'Mot de passe requis'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
})

// === GRIMPEUR VALIDATORS ===

export const disciplinesEnum = z.enum([
  'bloc',
  'voie',
  'trad',
  'escalade',
  'via-ferrata',
  'grandes-voies',
  'speed'
])

export const disciplinesSchema = z.array(disciplinesEnum).min(1, 'Au moins une discipline requise')

export const gradeSchema = z.string().regex(/^[4-9][a-c]\+?$/, 'Cotation invalide')

export const niveauxSchema = z.record(
  z.string(),
  gradeSchema
)

export const materielSchema = z.array(z.string())

export const createGrimpeurProfileSchema = z.object({
  userId: z.string().uuid('ID utilisateur invalide'),
  disciplines: disciplinesSchema,
  niveaux: niveauxSchema,
  materiel: materielSchema,
})

export const updateGrimpeurProfileSchema = createGrimpeurProfileSchema.partial().omit({ userId: true })

// === CLUB VALIDATORS ===

export const createClubProfileSchema = z.object({
  userId: z.string().uuid('ID utilisateur invalide'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  bio: z.string().max(1000, 'La bio ne peut pas dépasser 1000 caractères').optional(),
  location: z.string().max(255, 'La localisation ne peut pas dépasser 255 caractères').optional(),
  ffmeNum: z.string().max(50).optional(),
})

export const updateClubProfileSchema = createClubProfileSchema.partial().omit({ userId: true })

// === SALLE VALIDATORS ===

export const createSalleSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  location: z.string().min(2, 'La localisation est requise').max(255),
  adresse: z.string().min(5, 'L\'adresse est requise').max(500),
  disciplines: disciplinesSchema,
})

export const updateSalleSchema = createSalleSchema.partial()

// === FALAISE VALIDATORS ===

export const createFalaiseSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  location: z.string().min(2, 'La localisation est requise').max(255),
  acces: z.string().max(500).optional(),
  niveaux: z.array(z.string()).optional(),
})

export const updateFalaiseSchema = createFalaiseSchema.partial()

// === VOIE VALIDATORS ===

export const createVoieSchema = z.object({
  falaiseId: z.string().uuid('ID falaise invalide'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(255),
  cotation: gradeSchema,
  etatVotes: z.record(z.string(), z.number()).optional(),
})

export const updateVoieSchema = createVoieSchema.partial().omit({ falaiseId: true })

// === POST VALIDATORS ===

export const createPostSchema = z.object({
  authorId: z.string().uuid('ID auteur invalide'),
  salleId: z.string().uuid('ID salle invalide').optional(),
  falaiseId: z.string().uuid('ID falaise invalide').optional(),
  clubId: z.string().uuid('ID club invalide').optional(),
  contenu: z.string().max(500, 'Le contenu ne peut pas dépasser 500 caractères').optional(),
  cotation: gradeSchema.optional(),
  isStory: z.boolean().default(false),
})

export const updatePostSchema = createPostSchema.partial().omit({ authorId: true })

// === COMMENT VALIDATORS ===

export const createCommentSchema = z.object({
  postId: z.string().uuid('ID post invalide'),
  authorId: z.string().uuid('ID auteur invalide'),
  contenu: z.string().min(1, 'Le commentaire ne peut pas être vide').max(500),
})

// === EVENT VALIDATORS ===

export const createEventSchema = z.object({
  clubId: z.string().uuid('ID club invalide'),
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(255),
  debut: z.string().datetime('Date invalide').or(z.date()),
  capacite: z.number().int().positive('La capacité doit être un nombre positif'),
})

export const updateEventSchema = createEventSchema.partial().omit({ clubId: true })

// === MEDIA VALIDATORS ===

export const createMediaSchema = z.object({
  postId: z.string().uuid('ID post invalide'),
  url: z.string().url('URL invalide').max(500),
})

// === HELPER TYPE EXPORTS ===

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateGrimpeurProfileInput = z.infer<typeof createGrimpeurProfileSchema>
export type CreateClubProfileInput = z.infer<typeof createClubProfileSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>

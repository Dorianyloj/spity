import { mysqlTable, varchar, timestamp, json, int, boolean, mysqlEnum, double } from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// === USERS ===
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['grimpeur', 'club']).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  resetPasswordToken: varchar('reset_password_token', { length: 255 }),
  resetPasswordExpires: timestamp('reset_password_expires'),
  failedLoginAttempts: int('failed_login_attempts').default(0),
  lockoutUntil: timestamp('lockout_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// === GRIMPEUR PROFILE ===
export const grimpeurProfiles = mysqlTable('grimpeur_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 80 }),
  bio: varchar('bio', { length: 500 }),
  location: varchar('location', { length: 255 }),
  climbingEnvironment: mysqlEnum('climbing_environment', ['indoor', 'outdoor', 'mixed']),
  availability: json('availability').$type<string[]>(),
  partnerSearch: json('partner_search').$type<Record<string, unknown>>(),
  goals: json('goals').$type<string[]>(),
  disciplines: json('disciplines').$type<string[]>().notNull(),
  niveaux: json('niveaux').$type<Record<string, string>>().notNull(),
  materiel: json('materiel').$type<string[]>().notNull(),
  karma: int('karma').default(0),
})

// === USER EQUIPMENT ===
export const userEquipment = mysqlTable('user_equipment', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: mysqlEnum('category', [
    'chaussons',
    'baudrier',
    'corde',
    'degaine',
    'mousqueton',
    'assureur',
    'casque',
    'crashpad',
    'longe',
    'sac',
    'autre',
  ]).notNull(),
  quantity: int('quantity').notNull().default(1),
  brand: varchar('brand', { length: 80 }),
  model: varchar('model', { length: 120 }).notNull(),
  color: varchar('color', { length: 60 }),
  size: varchar('size', { length: 60 }),
  lengthMeters: int('length_meters'),
  diameterMm: varchar('diameter_mm', { length: 20 }),
  condition: mysqlEnum('condition', ['neuf', 'bon', 'use', 'a_verifier']).notNull().default('bon'),
  availableForPartner: boolean('available_for_partner').notNull().default(true),
  notes: varchar('notes', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// === CLUB PROFILE ===
export const clubProfiles = mysqlTable('club_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  nom: varchar('nom', { length: 255 }).notNull(),
  bio: varchar('bio', { length: 1000 }),
  location: varchar('location', { length: 255 }),
  ffmeNum: varchar('ffme_num', { length: 50 }),
})

// === SALLE ===
export const salles = mysqlTable('salles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  nom: varchar('nom', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  adresse: varchar('adresse', { length: 500 }).notNull(),
  disciplines: json('disciplines').$type<string[]>().notNull(),
  photoUrl: varchar('photo_url', { length: 500 }),
  horaires: json('horaires').$type<Record<string, string>>(),
  tarifs: json('tarifs').$type<Record<string, string>>(),
  services: json('services').$type<string[]>(),
  siteWeb: varchar('site_web', { length: 500 }),
  latitude: double('latitude'),
  longitude: double('longitude'),
  niveauMin: varchar('niveau_min', { length: 10 }),
  niveauMax: varchar('niveau_max', { length: 10 }),
  frequentation: mysqlEnum('frequentation', ['calme', 'moderee', 'elevee']),
})

// === FALAISE ===
export const falaises = mysqlTable('falaises', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  nom: varchar('nom', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  acces: varchar('acces', { length: 500 }),
  niveaux: json('niveaux').$type<string[]>(),
  photoUrl: varchar('photo_url', { length: 500 }),
  latitude: double('latitude'),
  longitude: double('longitude'),
  orientation: mysqlEnum('orientation', ['nord', 'sud', 'est', 'ouest', 'multi']),
  approche: varchar('approche', { length: 255 }),
  parking: varchar('parking', { length: 255 }),
  saison: json('saison').$type<string[]>(),
  status: mysqlEnum('status', ['sec', 'humide', 'attention', 'ferme']),
})

// === VOIE ===
export const voies = mysqlTable('voies', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  falaiseId: varchar('falaise_id', { length: 36 }).notNull().references(() => falaises.id, { onDelete: 'cascade' }),
  nom: varchar('nom', { length: 255 }).notNull(),
  cotation: varchar('cotation', { length: 10 }).notNull(),
  etatVotes: json('etat_votes').$type<Record<string, number>>(),
  hauteur: int('hauteur'),
  degaines: int('degaines'),
  secteur: varchar('secteur', { length: 120 }),
  style: mysqlEnum('style', ['dalle', 'devers', 'vertical', 'fissure', 'pilier', 'mixte']),
  status: mysqlEnum('route_status', ['ok', 'humide', 'spit_a_verifier', 'fermee']),
})

// === PLACE REPORT ===
export const placeReports = mysqlTable('place_reports', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  falaiseId: varchar('falaise_id', { length: 36 }).references(() => falaises.id, { onDelete: 'cascade' }),
  salleId: varchar('salle_id', { length: 36 }).references(() => salles.id, { onDelete: 'cascade' }),
  authorId: varchar('author_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: mysqlEnum('report_type', ['condition', 'access', 'safety', 'info']).notNull(),
  status: mysqlEnum('report_status', ['open', 'resolved']).notNull().default('open'),
  message: varchar('message', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// === POST ===
export const posts = mysqlTable('posts', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  authorId: varchar('author_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  salleId: varchar('salle_id', { length: 36 }).references(() => salles.id),
  falaiseId: varchar('falaise_id', { length: 36 }).references(() => falaises.id),
  clubId: varchar('club_id', { length: 36 }).references(() => clubProfiles.id),
  contenu: varchar('contenu', { length: 500 }),
  cotation: varchar('cotation', { length: 10 }),
  isStory: boolean('is_story').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// === MEDIA ===
export const medias = mysqlTable('medias', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: varchar('post_id', { length: 36 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
})

// === COMMENT ===
export const comments = mysqlTable('comments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: varchar('post_id', { length: 36 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: varchar('author_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
})

// === LIKE ===
export const likes = mysqlTable('likes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: varchar('post_id', { length: 36 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
})

// === EVENT ===
export const events = mysqlTable('events', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  clubId: varchar('club_id', { length: 36 }).notNull().references(() => clubProfiles.id, { onDelete: 'cascade' }),
  titre: varchar('titre', { length: 255 }).notNull(),
  debut: timestamp('debut').notNull(),
  capacite: int('capacite').notNull(),
})

// === RELATIONS (identiques) ===
export const usersRelations = relations(users, ({ one, many }) => ({
  grimpeurProfile: one(grimpeurProfiles),
  clubProfile: one(clubProfiles),
  equipment: many(userEquipment),
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  medias: many(medias),
  comments: many(comments),
  likes: many(likes),
}))

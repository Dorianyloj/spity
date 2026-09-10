import {
  boolean,
  double,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// === USERS ===
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['grimpeur', 'club']).notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  isSuspended: boolean('is_suspended').notNull().default(false),
  sessionVersion: int('session_version').notNull().default(0),
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
export const grimpeurProfiles = mysqlTable(
  'grimpeur_profiles',
  {
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
  },
  (table) => [uniqueIndex('grimpeur_profiles_user_id_unique').on(table.userId)]
)

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
export const clubProfiles = mysqlTable(
  'club_profiles',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    nom: varchar('nom', { length: 255 }).notNull(),
    bio: varchar('bio', { length: 1000 }),
    location: varchar('location', { length: 255 }),
    ffmeNum: varchar('ffme_num', { length: 50 }),
  },
  (table) => [uniqueIndex('club_profiles_user_id_unique').on(table.userId)]
)

// === PARTNERSHIP REQUEST ===
export const partnershipRequests = mysqlTable(
  'partnership_requests',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    pairKey: varchar('pair_key', { length: 73 }).notNull(),
    senderId: varchar('sender_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    recipientId: varchar('recipient_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    status: mysqlEnum('partnership_status', ['pending', 'accepted', 'declined']).notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    respondedAt: timestamp('responded_at'),
  },
  (table) => [
    uniqueIndex('partnership_requests_pair_key_unique').on(table.pairKey),
    index('partnership_requests_sender_idx').on(table.senderId),
    index('partnership_requests_recipient_idx').on(table.recipientId),
    index('partnership_requests_status_idx').on(table.status),
  ]
)

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

// === PLACE CREATION REQUEST ===
// A suggestion remains private until it has been reviewed and published by an administrator.
export const placeCreationRequests = mysqlTable(
  'place_creation_requests',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    authorId: varchar('author_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    kind: mysqlEnum('kind', ['salle', 'falaise']).notNull(),
    status: mysqlEnum('request_status', ['pending', 'approved', 'rejected']).notNull().default('pending'),
    name: varchar('name', { length: 255 }).notNull(),
    disciplines: json('disciplines').$type<string[]>().notNull(),
    latitude: double('latitude').notNull(),
    longitude: double('longitude').notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    department: varchar('department', { length: 255 }).notNull(),
    region: varchar('region', { length: 255 }).notNull(),
    address: varchar('address', { length: 500 }),
    rockType: mysqlEnum('rock_type', ['calcaire', 'gres', 'granite', 'gneiss', 'schiste', 'conglomerat', 'volcanique', 'autre']),
    rainExposure: mysqlEnum('rain_exposure', ['abrite', 'partiellement_abrite', 'expose']),
    sunlight: mysqlEnum('sunlight', ['ombrage', 'mixte', 'ensoleille']),
    seasons: json('seasons').$type<string[]>(),
    orientations: json('orientations').$type<string[]>(),
    services: json('services').$type<string[]>(),
    website: varchar('website', { length: 500 }),
    access: varchar('access', { length: 500 }),
    approach: varchar('approach', { length: 255 }),
    parking: varchar('parking', { length: 255 }),
    restrictions: varchar('restrictions', { length: 500 }),
    sourceUrl: varchar('source_url', { length: 500 }),
    notes: varchar('notes', { length: 1000 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at'),
  },
  (table) => [
    index('place_creation_requests_author_idx').on(table.authorId),
    index('place_creation_requests_status_created_idx').on(table.status, table.createdAt),
  ]
)

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
  isHidden: boolean('is_hidden').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// === MEDIA ===
// Private uploads are independent of posts until a publishing workflow attaches them.
export const mediaUploads = mysqlTable('media_uploads', {
  id: varchar('id', { length: 36 }).primaryKey(),
  ownerId: varchar('owner_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  byteSize: int('byte_size', { unsigned: true }).notNull(),
  width: int('width', { unsigned: true }).notNull(),
  height: int('height', { unsigned: true }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [index('media_uploads_owner_idx').on(table.ownerId)])

export const medias = mysqlTable('medias', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: varchar('post_id', { length: 36 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
})

// === COMMENT ===
export const comments = mysqlTable(
  'comments',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: varchar('post_id', { length: 36 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
    authorId: varchar('author_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    contenu: varchar('contenu', { length: 500 }).notNull().default('Commentaire'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index('comments_post_created_idx').on(table.postId, table.createdAt)]
)

// === LIKE ===
export const likes = mysqlTable(
  'likes',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: varchar('post_id', { length: 36 }).notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    // Legacy likes remain undated; never fabricate their creation date in a migration.
    createdAt: timestamp('created_at'),
  },
  (table) => [uniqueIndex('likes_post_user_unique').on(table.postId, table.userId)]
)

export const adminAuditLogs = mysqlTable('admin_audit_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  actorId: varchar('actor_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  action: mysqlEnum('action', ['admin_granted', 'user_suspended', 'user_restored', 'post_hidden', 'post_restored']).notNull(),
  targetId: varchar('target_id', { length: 36 }).notNull(),
  reason: varchar('reason', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [index('admin_audit_created_idx').on(table.createdAt)])

// === EVENT ===
export const events = mysqlTable(
  'events',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    clubId: varchar('club_id', { length: 36 }).notNull().references(() => clubProfiles.id, { onDelete: 'cascade' }),
    titre: varchar('titre', { length: 255 }).notNull(),
    type: mysqlEnum('event_type', ['outing', 'contest', 'coaching', 'initiation']).notNull().default('outing'),
    description: varchar('description', { length: 1000 }),
    location: varchar('location', { length: 255 }),
    debut: timestamp('debut').notNull(),
    fin: timestamp('fin'),
    capacite: int('capacite').notNull(),
    status: mysqlEnum('event_status', ['scheduled', 'cancelled']).notNull().default('scheduled'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index('events_club_idx').on(table.clubId), index('events_start_idx').on(table.debut)]
)

// === EVENT REGISTRATION ===
export const eventRegistrations = mysqlTable(
  'event_registrations',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    eventId: varchar('event_id', { length: 36 }).notNull().references(() => events.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    status: mysqlEnum('registration_status', ['active', 'cancelled']).notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex('event_registrations_event_user_unique').on(table.eventId, table.userId),
    index('event_registrations_event_status_idx').on(table.eventId, table.status),
  ]
)

// === RELATIONS (identiques) ===
export const usersRelations = relations(users, ({ one, many }) => ({
  grimpeurProfile: one(grimpeurProfiles),
  clubProfile: one(clubProfiles),
  equipment: many(userEquipment),
  posts: many(posts),
  sentPartnershipRequests: many(partnershipRequests, { relationName: 'partnership_sender' }),
  receivedPartnershipRequests: many(partnershipRequests, { relationName: 'partnership_recipient' }),
  eventRegistrations: many(eventRegistrations),
}))

export const partnershipRequestsRelations = relations(partnershipRequests, ({ one }) => ({
  sender: one(users, {
    fields: [partnershipRequests.senderId],
    references: [users.id],
    relationName: 'partnership_sender',
  }),
  recipient: one(users, {
    fields: [partnershipRequests.recipientId],
    references: [users.id],
    relationName: 'partnership_recipient',
  }),
}))

export const clubProfilesRelations = relations(clubProfiles, ({ one, many }) => ({
  user: one(users, { fields: [clubProfiles.userId], references: [users.id] }),
  events: many(events),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubProfiles, { fields: [events.clubId], references: [clubProfiles.id] }),
  registrations: many(eventRegistrations),
}))

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, { fields: [eventRegistrations.eventId], references: [events.id] }),
  user: one(users, { fields: [eventRegistrations.userId], references: [users.id] }),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  medias: many(medias),
  comments: many(comments),
  likes: many(likes),
}))

import { config } from 'dotenv'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'

config({ path: '.env.local' })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to seed demo data')
}

const demoPassword = 'SpityDemo2026!'

const ids = {
  users: {
    lina: '11111111-1111-4111-8111-111111111111',
    nassim: '22222222-2222-4222-8222-222222222222',
    camille: '33333333-3333-4333-8333-333333333333',
    club: '44444444-4444-4444-8444-444444444444',
  },
  profiles: {
    lina: '55555555-5555-4555-8555-555555555551',
    nassim: '55555555-5555-4555-8555-555555555552',
    camille: '55555555-5555-4555-8555-555555555553',
    club: '55555555-5555-4555-8555-555555555554',
  },
  salles: {
    arkose: '66666666-6666-4666-8666-666666666661',
    mroc: '66666666-6666-4666-8666-666666666662',
  },
  falaises: {
    curis: '77777777-7777-4777-8777-777777777771',
    cormot: '77777777-7777-4777-8777-777777777772',
  },
  voies: {
    rouge: '88888888-8888-4888-8888-888888888881',
    dalle: '88888888-8888-4888-8888-888888888882',
    pilier: '88888888-8888-4888-8888-888888888883',
  },
  posts: {
    partner: '99999999-9999-4999-8999-999999999991',
    event: '99999999-9999-4999-8999-999999999992',
    topo: '99999999-9999-4999-8999-999999999993',
  },
  events: {
    outing: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    contest: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
  },
  reports: {
    curisCondition: 'abababab-abab-4bab-8bab-ababababab01',
    curisSafety: 'abababab-abab-4bab-8bab-ababababab02',
    cormotAccess: 'abababab-abab-4bab-8bab-ababababab03',
  },
}

const demoEmails = [
  'lina.demo@spity.local',
  'nassim.demo@spity.local',
  'camille.demo@spity.local',
  'club.demo@spity.local',
]

const publicBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

const imageUrls = {
  indoor: `${publicBaseUrl}/images/brand/escalade-salle.jpg`,
  crag: `${publicBaseUrl}/images/brand/escalade-falaise.jpeg`,
  sunset: `${publicBaseUrl}/images/brand/escalade-falaise-coucher-soleil.jpeg`,
  logo: `${publicBaseUrl}/images/brand/logo-spity.png`,
}

const toJson = (value) => JSON.stringify(value)

const escapeIdentifier = (identifier) => `\`${identifier.replaceAll('`', '``')}\``

const insert = async (connection, table, rows) => {
  if (rows.length === 0) {
    return
  }

  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
  const placeholders = rows.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ')
  const values = rows.flatMap((row) => columns.map((column) => row[column] ?? null))

  await connection.execute(
    `insert into ${escapeIdentifier(table)} (${columns.map(escapeIdentifier).join(', ')}) values ${placeholders}`,
    values
  )
}

const main = async () => {
  const connection = await mysql.createConnection(databaseUrl)
  const passwordHash = await bcrypt.hash(demoPassword, 12)

  await connection.beginTransaction()

  try {
    await connection.execute(
      `delete from comments where post_id in (?, ?, ?)`,
      Object.values(ids.posts)
    )
    await connection.execute(
      `delete from likes where post_id in (?, ?, ?)`,
      Object.values(ids.posts)
    )
    await connection.execute(
      `delete from medias where post_id in (?, ?, ?)`,
      Object.values(ids.posts)
    )
    await connection.execute(
      `delete from posts where id in (?, ?, ?)`,
      Object.values(ids.posts)
    )
    await connection.execute(
      `delete from events where id in (?, ?)`,
      Object.values(ids.events)
    )
    await connection.execute(
      `delete from place_reports where id in (?, ?, ?)`,
      Object.values(ids.reports)
    )
    await connection.execute(
      `delete from users where email in (${demoEmails.map(() => '?').join(', ')})`,
      demoEmails
    )
    await connection.execute(
      `delete from voies where id in (?, ?, ?)`,
      Object.values(ids.voies)
    )
    await connection.execute(
      `delete from falaises where id in (?, ?)`,
      Object.values(ids.falaises)
    )
    await connection.execute(
      `delete from salles where id in (?, ?)`,
      Object.values(ids.salles)
    )

    await insert(connection, 'users', [
      {
        id: ids.users.lina,
        email: demoEmails[0],
        password_hash: passwordHash,
        role: 'grimpeur',
        avatar_url: imageUrls.indoor,
        email_verified: true,
      },
      {
        id: ids.users.nassim,
        email: demoEmails[1],
        password_hash: passwordHash,
        role: 'grimpeur',
        avatar_url: imageUrls.crag,
        email_verified: true,
      },
      {
        id: ids.users.camille,
        email: demoEmails[2],
        password_hash: passwordHash,
        role: 'grimpeur',
        avatar_url: imageUrls.sunset,
        email_verified: true,
      },
      {
        id: ids.users.club,
        email: demoEmails[3],
        password_hash: passwordHash,
        role: 'club',
        avatar_url: imageUrls.logo,
        email_verified: true,
      },
    ])

    await insert(connection, 'grimpeur_profiles', [
      {
        id: ids.profiles.lina,
        user_id: ids.users.lina,
        display_name: 'Lina M.',
        bio: 'Bloc en semaine, falaise quand la météo tient. Je cherche des partenaires réguliers autour de Lyon.',
        location: 'Lyon',
        climbing_environment: 'mixed',
        availability: toJson(['weekday_evening', 'weekend_morning']),
        partner_search: toJson({ enabled: true, levelPreference: 'same_or_close', style: 'training', notes: 'OK pour filmer les essais et travailler les méthodes.' }),
        goals: toJson(['Progresser en bloc', 'Sortir plus en falaise']),
        disciplines: toJson(['bloc', 'voie']),
        niveaux: toJson({ bloc: '6b', voie: '6a' }),
        materiel: toJson(['chaussons', 'baudrier']),
        karma: 42,
      },
      {
        id: ids.profiles.nassim,
        user_id: ids.users.nassim,
        display_name: 'Nassim B.',
        bio: 'Voie et grande voie, disponible sur les pauses midi et le week-end.',
        location: 'Villeurbanne',
        climbing_environment: 'mixed',
        availability: toJson(['weekday_lunch', 'weekend_afternoon']),
        partner_search: toJson({ enabled: true, levelPreference: 'any', style: 'relaxed', notes: 'Je peux assurer en tête et en moulinette.' }),
        goals: toJson(['Préparer une grande voie', 'Trouver des partenaires réguliers']),
        disciplines: toJson(['voie', 'trad']),
        niveaux: toJson({ voie: '6a+', trad: '5c' }),
        materiel: toJson(['chaussons', 'baudrier', 'corde']),
        karma: 31,
      },
      {
        id: ids.profiles.camille,
        user_id: ids.users.camille,
        display_name: 'Camille R.',
        bio: 'Trad tranquille, sorties falaise et partage de matériel.',
        location: 'Chambéry',
        climbing_environment: 'outdoor',
        availability: toJson(['weekend_morning', 'weekend_afternoon']),
        partner_search: toJson({ enabled: false, levelPreference: 'same_or_close', style: 'discovery', notes: 'Disponible surtout sur sorties planifiées.' }),
        goals: toJson(['Partager du matériel', 'Sortir plus en falaise']),
        disciplines: toJson(['trad', 'voie']),
        niveaux: toJson({ trad: '5c', voie: '6b' }),
        materiel: toJson(['chaussons', 'baudrier', 'corde']),
        karma: 57,
      },
    ])

    await insert(connection, 'club_profiles', [
      {
        id: ids.profiles.club,
        user_id: ids.users.club,
        nom: 'Club Alpin Lyon',
        bio: 'Sorties falaise, initiations et entraînements encadrés pour grimpeurs autonomes ou en progression.',
        location: 'Lyon',
        ffme_num: 'FFME-069-2026',
      },
    ])

    await insert(connection, 'user_equipment', [
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        user_id: ids.users.lina,
        category: 'crashpad',
        quantity: 1,
        brand: 'Snap',
        model: 'Grand Rebound',
        color: 'Orange',
        condition: 'bon',
        available_for_partner: true,
      },
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
        user_id: ids.users.nassim,
        category: 'corde',
        quantity: 1,
        brand: 'Beal',
        model: 'Joker',
        color: 'Bleu',
        length_meters: 70,
        diameter_mm: '9.1',
        condition: 'bon',
        available_for_partner: true,
      },
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
        user_id: ids.users.camille,
        category: 'degaine',
        quantity: 12,
        brand: 'Petzl',
        model: 'Djinn Axess',
        color: 'Turquoise',
        condition: 'bon',
        available_for_partner: true,
      },
    ])

    await insert(connection, 'salles', [
      {
        id: ids.salles.arkose,
        nom: 'Arkose Lyon',
        location: 'Lyon 7e',
        adresse: '52 rue de Gerland, 69007 Lyon',
        disciplines: toJson(['bloc']),
        photo_url: imageUrls.indoor,
        horaires: toJson({ semaine: '10:00-23:00', weekEnd: '09:00-21:00' }),
        tarifs: toJson({ entree: '15 €', abonnement: '59 €/mois' }),
        services: toJson(['shop', 'restauration', 'location chaussons', 'vestiaires']),
        site_web: 'https://arkose.com',
        latitude: 45.7331,
        longitude: 4.8307,
        niveau_min: '4a',
        niveau_max: '7c',
        frequentation: 'moderee',
      },
      {
        id: ids.salles.mroc,
        nom: 'MROC Villeurbanne',
        location: 'Villeurbanne',
        adresse: '86 cours Tolstoï, 69100 Villeurbanne',
        disciplines: toJson(['bloc', 'voie']),
        photo_url: imageUrls.indoor,
        horaires: toJson({ semaine: '09:00-22:30', weekEnd: '09:30-20:00' }),
        tarifs: toJson({ entree: '16 €', abonnement: '62 €/mois' }),
        services: toJson(['douche', 'parking velo', 'location materiel', 'cours debutants']),
        site_web: 'https://mroc.fr',
        latitude: 45.7624,
        longitude: 4.8843,
        niveau_min: '4a',
        niveau_max: '8a',
        frequentation: 'elevee',
      },
    ])

    await insert(connection, 'falaises', [
      {
        id: ids.falaises.curis,
        nom: 'Curis-au-Mont-d’Or',
        location: 'Monts d’Or',
        acces: 'Approche courte depuis le parking du village. Vérifier les restrictions après pluie.',
        niveaux: toJson(['5b', '6a', '6b', '7a']),
        photo_url: imageUrls.sunset,
        latitude: 45.8733,
        longitude: 4.8218,
        orientation: 'sud',
        approche: '12 min depuis le parking du village',
        parking: 'Parking de Curis, 18 places',
        saison: toJson(['printemps', 'automne']),
        status: 'sec',
      },
      {
        id: ids.falaises.cormot,
        nom: 'Cormot',
        location: 'Bourgogne',
        acces: 'Secteurs variés, casque recommandé au pied des voies.',
        niveaux: toJson(['5c', '6a+', '6c', '7b']),
        photo_url: imageUrls.crag,
        latitude: 46.9684,
        longitude: 4.6328,
        orientation: 'multi',
        approche: '20 à 35 min selon secteur',
        parking: 'Parking principal avant le sentier balisé',
        saison: toJson(['printemps', 'ete', 'automne']),
        status: 'attention',
      },
    ])

    await insert(connection, 'voies', [
      {
        id: ids.voies.rouge,
        falaise_id: ids.falaises.curis,
        nom: 'Le Rouge Gorge',
        cotation: '7a',
        etat_votes: toJson({ sec: 12, humide: 1, equipe: 10 }),
        hauteur: 24,
        degaines: 10,
        secteur: 'Solitude',
        style: 'devers',
        route_status: 'ok',
      },
      {
        id: ids.voies.dalle,
        falaise_id: ids.falaises.curis,
        nom: 'Dalle du Matin',
        cotation: '6a+',
        etat_votes: toJson({ sec: 8, calme: 6, equipe: 8 }),
        hauteur: 18,
        degaines: 8,
        secteur: 'Dalle basse',
        style: 'dalle',
        route_status: 'ok',
      },
      {
        id: ids.voies.pilier,
        falaise_id: ids.falaises.cormot,
        nom: 'Pilier Bleu',
        cotation: '6c',
        etat_votes: toJson({ sec: 5, equipe: 5, approche_ok: 4 }),
        hauteur: 32,
        degaines: 12,
        secteur: 'Pilier principal',
        style: 'pilier',
        route_status: 'spit_a_verifier',
      },
    ])

    await insert(connection, 'place_reports', [
      {
        id: ids.reports.curisCondition,
        falaise_id: ids.falaises.curis,
        author_id: ids.users.lina,
        report_type: 'condition',
        report_status: 'open',
        message: 'Rocher sec ce matin, pied des voies encore un peu gras après les pluies.',
      },
      {
        id: ids.reports.curisSafety,
        falaise_id: ids.falaises.curis,
        author_id: ids.users.nassim,
        report_type: 'safety',
        report_status: 'open',
        message: 'Relais de la Dalle du Matin à surveiller, mousqueton marqué.',
      },
      {
        id: ids.reports.cormotAccess,
        falaise_id: ids.falaises.cormot,
        author_id: ids.users.camille,
        report_type: 'access',
        report_status: 'resolved',
        message: 'Sentier principal dégagé, accès OK avec casque conseillé au pied.',
      },
    ])

    await insert(connection, 'events', [
      {
        id: ids.events.outing,
        club_id: ids.profiles.club,
        titre: 'Sortie falaise découverte à Curis',
        debut: '2026-05-18 09:30:00',
        capacite: 8,
      },
      {
        id: ids.events.contest,
        club_id: ids.profiles.club,
        titre: 'Contest bloc local Spity Crew',
        debut: '2026-05-27 18:30:00',
        capacite: 24,
      },
    ])

    await insert(connection, 'posts', [
      {
        id: ids.posts.partner,
        author_id: ids.users.lina,
        salle_id: ids.salles.arkose,
        contenu: 'Session bloc ce soir vers 19h. Je cherche quelqu’un pour travailler les profils déversants et filmer quelques essais.',
        cotation: '6b',
        is_story: false,
      },
      {
        id: ids.posts.event,
        author_id: ids.users.club,
        falaise_id: ids.falaises.curis,
        club_id: ids.profiles.club,
        contenu: 'Sortie falaise samedi matin. Groupe limité à 8 personnes, niveau conseillé 5c/6a, encadrement bénévole.',
        cotation: '6a',
        is_story: false,
      },
      {
        id: ids.posts.topo,
        author_id: ids.users.nassim,
        falaise_id: ids.falaises.curis,
        contenu: 'Bonne session voie hier, les nouvelles ouvertures en dalle sont propres. Disponible demain midi pour assurer.',
        cotation: '6a+',
        is_story: true,
      },
    ])

    await insert(connection, 'medias', [
      {
        id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
        post_id: ids.posts.partner,
        url: imageUrls.indoor,
      },
      {
        id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
        post_id: ids.posts.event,
        url: imageUrls.sunset,
      },
      {
        id: 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
        post_id: ids.posts.topo,
        url: imageUrls.crag,
      },
    ])

    await insert(connection, 'likes', [
      { id: 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1', post_id: ids.posts.partner, user_id: ids.users.nassim },
      { id: 'dddddddd-dddd-4ddd-8ddd-ddddddddddd2', post_id: ids.posts.event, user_id: ids.users.lina },
      { id: 'dddddddd-dddd-4ddd-8ddd-ddddddddddd3', post_id: ids.posts.topo, user_id: ids.users.camille },
    ])

    await insert(connection, 'comments', [
      { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', post_id: ids.posts.partner, author_id: ids.users.nassim },
      { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2', post_id: ids.posts.event, author_id: ids.users.camille },
    ])

    await connection.commit()

    console.log('Demo data seeded successfully.')
    console.log(`Demo password for all demo accounts: ${demoPassword}`)
    console.log(`Accounts: ${demoEmails.join(', ')}`)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    await connection.end()
  }
}

void main()

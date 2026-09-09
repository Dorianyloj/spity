// Fictional, browser-only fixtures. Never import this module into the application.
export const assets = {
  cover: '/public/images/demo/climbing/verdon-cliff.jpg',
  bloc: '/public/images/demo/climbing/fontainebleau-bouldering.jpg',
  voie: '/public/images/demo/climbing/verdon-wall-climber.jpg',
  indoor: '/public/images/demo/climbing/indoor-gym-overview.jpg',
}
export const disciplines = { bloc: 'Bloc', voie: 'Voie', trad: 'Trad' }
export const environments = { indoor: 'En salle', outdoor: 'En extérieur', mixed: 'Salle & extérieur' }
export const slots = {
  weekday_morning: 'Semaine · matin', weekday_lunch: 'Semaine · midi', weekday_evening: 'Semaine · soir',
  weekend_morning: 'Week-end · matin', weekend_afternoon: 'Week-end · après-midi', weekend_evening: 'Week-end · soir',
}
export const levels = { same_or_close: 'Niveau proche du mien', stronger: 'Plus expérimenté', beginner_friendly: 'Débutants bienvenus', any: 'Tous les niveaux' }
export const styles = { relaxed: 'Sans pression', performance: 'Performance', training: 'Entraînement', discovery: 'Découverte' }
export const goalOptions = ['Trouver des partenaires réguliers', 'Progresser en voie', 'Progresser en bloc', 'Sortir plus en falaise', 'Préparer une grande voie', 'Reprendre après une pause', 'Participer à des événements club', 'Partager du matériel']
export const categories = { chaussons: 'Chaussons', baudrier: 'Baudrier', corde: 'Corde', degaine: 'Dégaines', mousqueton: 'Mousqueton', assureur: 'Assureur', casque: 'Casque', crashpad: 'Crashpad', longe: 'Longe', sac: 'Sac', autre: 'Autre' }
export const conditions = { neuf: 'Neuf', bon: 'Bon état', use: 'Usé', a_verifier: 'À vérifier' }
export const grades = ['4a', '4b', '4c', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+']

export function createDemo(empty = false) {
  const profile = {
    displayName: 'Camille Martin', avatar: null, location: 'Grenoble',
    bio: 'Du bloc après le travail, de la falaise dès que possible. J’aime les sessions où l’on s’encourage, où l’on apprend et où l’on prend le temps de profiter du lieu.',
    email: 'camille.martin@example.test', joined: '2026-03-12',
    disciplines: ['bloc', 'voie', 'trad'], grades: { bloc: '6b', voie: '6c', trad: '5c' }, environment: 'mixed',
    availability: ['weekday_evening', 'weekend_morning', 'weekend_afternoon'],
    partner: { enabled: true, level: 'same_or_close', style: 'relaxed', notes: 'Partante pour une cordée régulière autour de Grenoble. On échange sur notre pratique et notre matériel avant de partir.' },
    goals: ['Trouver des partenaires réguliers', 'Sortir plus en falaise', 'Progresser en voie'],
    equipment: [
      { id: 'gear-1', category: 'corde', brand: 'Beal', model: 'Karma', quantity: 1, detail: '70 m · 9,8 mm', condition: 'bon', shared: true, notes: 'Note privée : achat en juin, facture dans mes documents.' },
      { id: 'gear-2', category: 'assureur', brand: 'Petzl', model: 'Grigri', quantity: 1, detail: 'Gris', condition: 'bon', shared: true, notes: 'Note privée : matériel personnel, prêt uniquement pendant la session.' },
      { id: 'gear-3', category: 'crashpad', brand: 'Ocún', model: 'Paddy', quantity: 1, detail: '100 × 132 cm', condition: 'bon', shared: true, notes: '' },
      { id: 'gear-4', category: 'chaussons', brand: 'Scarpa', model: 'Instinct', quantity: 1, detail: 'Pointure 39', condition: 'use', shared: false, notes: 'Note privée : ressemelage à prévoir.' },
      { id: 'gear-5', category: 'baudrier', brand: 'Black Diamond', model: 'Momentum', quantity: 1, detail: 'Taille M', condition: 'bon', shared: false, notes: '' },
    ],
    posts: [
      { id: 'post-1', title: 'Une journée à Bleau', discipline: 'bloc', grade: '6b', date: '2026-09-06', image: assets.bloc, content: 'Du grès, des essais et beaucoup d’encouragements. Le bloc qui résistait a fini par passer. Merci à la petite équipe pour les parades !' },
      { id: 'post-2', title: 'Prendre de la hauteur', discipline: 'voie', grade: '6c', date: '2026-08-30', image: assets.voie, content: 'Première sortie dans le Verdon. Des longueurs qui donnent envie de revenir, et surtout une belle journée de cordée.' },
      { id: 'post-3', title: 'Les petites victoires du jeudi', discipline: 'bloc', grade: null, date: '2026-08-27', image: assets.indoor, content: 'Une séance technique en salle : moins tirer, mieux poser les pieds. On remet ça la semaine prochaine ?' },
    ],
  }
  if (empty) Object.assign(profile, { displayName: 'Nouveau membre', location: '', bio: '', disciplines: [], grades: {}, environment: '', availability: [], goals: [], equipment: [], posts: [], partner: { enabled: false, level: 'any', style: 'relaxed', notes: '' } })
  return profile
}

export function completion(profile) {
  const items = [
    { label: 'Une photo pour se reconnaître', action: 'identity', done: Boolean(profile.avatar) },
    { label: 'Une présentation et une ville', action: 'identity', done: Boolean(profile.bio.trim() && profile.location.trim()) },
    { label: 'Des disciplines et des niveaux', action: 'practice', done: profile.disciplines.length > 0 && profile.disciplines.every((key) => Boolean(profile.grades[key])) },
    { label: 'Des disponibilités renseignées', action: 'partners', done: profile.availability.length > 0 },
    { label: 'Des envies de grimpe', action: 'practice', done: profile.goals.length > 0 },
    { label: 'Un inventaire de matériel', action: 'equipment', done: profile.equipment.length > 0 },
  ]
  const count = items.filter((item) => item.done).length
  return { items, count, total: items.length, percent: Math.round(count / items.length * 100) }
}

// Explicit allowlist: a member view must never render account fields or private gear notes.
// This is only a UI projection of fictional data, NOT a server-side privacy boundary.
export function memberProjection(profile) {
  return {
    displayName: profile.displayName, avatar: profile.avatar, location: profile.location, bio: profile.bio, joined: profile.joined,
    disciplines: [...profile.disciplines], grades: { ...profile.grades }, environment: profile.environment,
    availability: [...profile.availability], partner: { ...profile.partner }, goals: [...profile.goals],
    equipment: profile.equipment.filter((item) => item.shared).map(({ id, category, brand, model, quantity, detail, condition }) => ({ id, category, brand, model, quantity, detail, condition })),
    posts: profile.posts.map((post) => ({ ...post })),
  }
}

export function stats(profile) {
  return { posts: profile.posts.length, disciplines: profile.disciplines.length, shared: profile.equipment.filter((item) => item.shared).length }
}

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

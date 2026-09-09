import { assets, categories, completion, conditions, createDemo, disciplines, environments, escapeHtml as esc, goalOptions, grades, levels, memberProjection, slots, stats, styles } from './model.mjs'

const $ = (selector) => document.querySelector(selector)
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`
const button = (action, label, symbol = '', variant = 'text-button', key = action) => `<button type="button" class="${variant}" data-action="${esc(action)}" data-focus="${esc(key)}">${symbol ? icon(symbol) : ''}${esc(label)}</button>`
const badge = (label, positive = false) => `<span class="badge${positive ? ' positive' : ''}">${esc(label)}</span>`
const formatDate = (value) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`))
const heading = (title, symbol, action = '', label = 'Modifier', description = '') => `<div class="card-heading"><div><h2 class="title-icon">${icon(symbol)}${esc(title)}</h2>${description ? `<p>${esc(description)}</p>` : ''}</div>${action && mode === 'owner' ? button(action, label, 'edit', 'text-button', `heading-${title}`) : ''}</div>`
const empty = (title, description, action, label, symbol = 'mountain') => `<div class="empty">${icon(symbol)}<h3>${esc(title)}</h3><p>${esc(description)}</p>${action ? button(action, label, 'plus', 'button primary') : ''}</div>`
let profile = createDemo()
let mode = 'owner'
let section = 'overview'
let filter = 'all'
let query = ''
let requestSent = false
let dialogAction = ''
let returnFocus = ''
let draftAvatar = null
let uploadSequence = 0
const objectUrls = new Set()
const dialog = $('#editor')

function avatar(value = profile.avatar, name = profile.displayName) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? '').join('').toLocaleUpperCase('fr-FR') || 'S'
  return value ? `<img src="${esc(value)}" alt="Photo de profil de ${esc(name)}">` : `<span aria-label="Initiales de ${esc(name)}">${esc(initials)}</span>`
}
function notify(message) { $('#feedback').textContent = message }
function focusKey(key) {
  const target = key ? document.querySelector(`[data-focus="${CSS.escape(key)}"]`) : null
  const fallback = $('#sections button[aria-pressed="true"]')
  ;(target ?? fallback)?.focus({ preventScroll: true })
}

function renderHero(view) {
  const numbers = stats(profile)
  $('#hero').innerHTML = `<img class="cover" src="${assets.cover}" alt="" width="1230" height="144">
    <div class="identity"><div class="avatar">${avatar(view.avatar, view.displayName)}</div><div class="identity-main">
      <div class="identity-top"><div class="identity-name"><h2>${esc(view.displayName)}</h2><div class="identity-meta"><span>${icon('pin')}${esc(view.location || 'Ville non renseignée')}</span><span>${icon('mountain')}${esc(environments[view.environment] || 'Pratique à préciser')}</span></div></div>
        <div class="identity-actions"><span class="badge ${view.partner.enabled ? 'positive' : ''}"><span class="badge-dot" aria-hidden="true"></span>${view.partner.enabled ? 'En recherche de partenaires' : 'Recherche en pause'}</span>
        ${mode === 'owner' ? button('identity', 'Modifier mon profil', 'edit', 'button', 'hero-identity') : view.partner.enabled ? button('request', requestSent ? 'Demande simulée' : 'Proposer une session', 'users', 'button primary', 'hero-request') : ''}</div></div>
      <p class="bio">${esc(view.bio || 'Une nouvelle histoire de grimpe commence ici. La présentation n’est pas encore renseignée.')}</p>
    </div></div>
    <dl class="hero-stats"><div><dt>publications</dt><dd>${numbers.posts}</dd></div><div><dt>disciplines</dt><dd>${numbers.disciplines}</dd></div><div><dt>équipements partagés</dt><dd>${numbers.shared}</dd></div><div class="member-since"><dt class="sr-only">Inscription</dt><dd class="sr-only">${esc(view.joined)}</dd><span aria-hidden="true">Membre depuis mars 2026</span></div></dl>`
}

function renderNavigation() {
  const entries = [['overview', mode === 'owner' ? 'Aperçu' : 'Profil', 'profile'], ['posts', 'Publications', 'grid'], ['equipment', mode === 'owner' ? 'Matériel' : 'Matériel partagé', 'gear'], ...(mode === 'owner' ? [['settings', 'Réglages', 'settings']] : [])]
  $('#sections').innerHTML = entries.map(([key, label, symbol]) => `<button type="button" data-section="${key}" data-focus="nav-${key}" aria-pressed="${section === key}">${icon(symbol)}${label}${key === 'posts' ? `<span class="nav-count">${profile.posts.length}</span>` : ''}</button>`).join('')
}

function practice(view) {
  return `<section class="card card-body">${heading('Ma pratique', 'mountain', 'practice')}${view.disciplines.length ? `<div class="level-grid">${view.disciplines.map((key) => `<div class="level"><h3>${icon('mountain')}${esc(disciplines[key])}</h3><strong>${esc(view.grades[key] || '—')}</strong><p>Niveau déclaré</p></div>`).join('')}</div><div class="practice-footer"><span>${icon('pin')}${esc(environments[view.environment] || 'Environnement à préciser')}</span><span>Des repères pour grimper ensemble, pas un classement.</span></div>` : empty('À chacun sa pratique', 'Bloc, voie ou trad : précise ce que tu aimes grimper et ton niveau.', mode === 'owner' ? 'practice' : 'demo-owner', mode === 'owner' ? 'Renseigner ma pratique' : 'Revenir à mon espace')}</section>`
}
function availability(view) {
  return `<section class="card card-body">${heading('Quand grimper ensemble ?', 'calendar', 'partners', 'Ajuster', 'Des créneaux habituels, à confirmer avant chaque sortie.')}${view.availability.length ? `<div class="availability">${Object.entries(slots).map(([key, label]) => { const selected = view.availability.includes(key); const [day, time] = label.split(' · '); return `<div class="${selected ? 'available' : ''}"><span>${day}</span><strong>${time}</strong><span class="slot-status">${selected ? icon('check') : ''}${selected ? 'Disponible' : 'Non indiqué'}</span></div>` }).join('')}</div>` : empty('Un créneau en commun ?', 'Les disponibilités ne sont pas encore renseignées.', mode === 'owner' ? 'partners' : 'demo-owner', mode === 'owner' ? 'Ajouter mes disponibilités' : 'Revenir à mon espace', 'calendar')}</section>`
}
function partner(view) {
  return `<section class="card card-body partner-card"><div class="partner-title">${icon('users')}<h2>${view.partner.enabled ? 'La prochaine cordée ?' : 'À ton rythme'}</h2></div><p>${view.partner.enabled ? 'Un peu de technique, de confiance et surtout le plaisir de grimper ensemble.' : 'La recherche de partenaires est en pause. Le profil et les publications restent visibles aux membres.'}</p><div class="partner-tags">${badge(levels[view.partner.level])}${badge(styles[view.partner.style])}</div>${view.partner.notes ? `<p class="partner-note">${esc(view.partner.notes)}</p>` : ''}${mode === 'owner' ? button('partners', 'Mes préférences de partenaire', 'settings', 'button', 'partner-preferences') : view.partner.enabled ? button('request', requestSent ? 'Voir la demande simulée' : 'Proposer une session', 'arrow', 'button primary', 'partner-request') : ''}</section>`
}
function readiness() {
  const result = completion(profile)
  return `<section class="card card-body">${heading('Un profil qui te ressemble', 'profile')}
    <div class="completion-top"><p class="small muted">${result.count} éléments sur ${result.total}</p><strong>${result.percent}<span class="small"> %</span></strong></div>
    <progress value="${result.count}" max="${result.total}" aria-label="Complétude du profil">${result.percent} %</progress>
    <p class="hint">${result.count === result.total ? 'Les informations essentielles sont renseignées.' : 'Quelques repères pour faciliter les premières rencontres.'}</p>
    <ul class="checklist">${result.items.map((item) => `<li>${icon(item.done ? 'check' : 'plus')}${item.done ? `${esc(item.label)}<span class="sr-only"> : complété</span>` : button(item.action, item.label, '', 'text-button', `complete-${item.label}`)}</li>`).join('')}</ul>
    <div class="privacy-note">${icon('lock')}<p>Ce suivi est privé. Il ne représente ni ton niveau ni ta fiabilité.</p></div>
  </section>`
}
function postCard(post) {
  return `<article class="post">${post.image ? `<img class="post-image" src="${esc(post.image)}" alt="" loading="lazy" width="320" height="240">` : `<div class="post-text-image">${icon('feed')}</div>`}<div class="post-body"><div>${badge(disciplines[post.discipline])}${post.grade ? ` ${badge(post.grade)}` : ''}</div><h3>${esc(post.title)}</h3><time datetime="${esc(post.date)}">${formatDate(post.date)}</time>${button(`post:${post.id}`, 'Lire la publication', 'arrow', 'text-button', `post-${post.id}`)}</div></article>`
}
function latestPosts(view) {
  return `<section class="card card-body">${heading('Au fil des sessions', 'feed', 'go-posts', 'Tout voir', 'Les dernières publications du profil.')}${view.posts.length ? `<div class="posts-grid">${view.posts.slice(0, 3).map(postCard).join('')}</div>` : empty('La première page est encore blanche', 'Une sortie, une réussite, une envie de grimper : tout commence par un partage.', mode === 'owner' ? 'compose' : 'demo-owner', mode === 'owner' ? 'Créer une publication' : 'Revenir à mon espace', 'feed')}</section>`
}
function renderOverview(view) {
  $('#panel').innerHTML = `<div class="profile-grid"><div class="stack">${practice(view)}${availability(view)}<section class="card card-body">${heading('Mes envies de grimpe', 'target', 'practice', 'Modifier', 'Ce qui me motive pour les prochaines sessions.')}${view.goals.length ? `<ul class="goals">${view.goals.map((goal) => `<li class="goal">${esc(goal)}</li>`).join('')}</ul>` : empty('Qu’est-ce qui te donne envie ?', 'Les objectifs aident à trouver des partenaires qui partagent tes envies.', mode === 'owner' ? 'practice' : 'demo-owner', mode === 'owner' ? 'Choisir mes objectifs' : 'Revenir à mon espace', 'target')}</section>${latestPosts(view)}</div><aside class="stack" aria-label="Partenaires et informations complémentaires">${partner(view)}${mode === 'owner' ? readiness() : `<section class="card card-body">${heading('Pour une première sortie', 'info')}<p class="small muted">Échangez sur vos niveaux, le lieu, les disponibilités et le matériel avant de vous retrouver.</p><p class="hint">Les informations sont déclarées par le membre. Spity ne certifie pas les compétences d’assurage ou l’état du matériel.</p></section>`}</aside></div>`
}

function renderPosts(view) {
  $('#panel').innerHTML = `<div class="view-toolbar"><div><h2>${mode === 'owner' ? 'Mes publications' : 'Publications'}</h2><p>Les moments de grimpe partagés avec la communauté.</p></div>${mode === 'owner' ? button('compose', 'Créer une publication', 'plus', 'button primary') : ''}</div><div class="card filter-bar"><div class="filter-field"><label for="post-filter">Discipline</label><select id="post-filter"><option value="all">Toutes les disciplines</option>${Object.entries(disciplines).map(([key, label]) => `<option value="${key}" ${filter === key ? 'selected' : ''}>${label}</option>`).join('')}</select></div><p class="small muted" id="post-count" role="status"></p></div><div id="post-results"></div>`
  updatePostResults(view)
}
function updatePostResults(view) {
  const posts = view.posts.filter((post) => filter === 'all' || post.discipline === filter)
  $('#post-count').textContent = `${posts.length} publication${posts.length > 1 ? 's' : ''}`
  $('#post-results').innerHTML = posts.length ? `<div class="posts-grid">${posts.map(postCard).join('')}</div>` : `<div class="card">${empty('Pas encore de publication ici', filter !== 'all' ? 'Aucune publication dans cette discipline.' : 'Partage un premier moment de grimpe avec la communauté.', filter !== 'all' ? 'clear-posts' : mode === 'owner' ? 'compose' : 'demo-owner', filter !== 'all' ? 'Voir toutes les publications' : mode === 'owner' ? 'Créer une publication' : 'Revenir à mon espace', 'feed')}</div>`
}
function gearCard(item) {
  const name = `${item.brand} ${item.model}`.trim()
  return `<article class="card gear-card">
    <div class="gear-heading"><div class="gear-icon">${icon('gear')}</div><div><p>${esc(categories[item.category])}</p><h3>${esc(name)}</h3></div></div>
    <div class="gear-details"><span class="number">Quantité : ${item.quantity}</span>${item.detail ? `<span>· ${esc(item.detail)}</span>` : ''}</div>
    ${badge(conditions[item.condition])} ${mode === 'owner' ? badge(item.shared ? 'Visible aux membres' : 'Privé', item.shared) : ''}
    ${mode === 'owner' && item.notes ? `<p class="gear-note">${esc(item.notes)}</p>` : ''}
    ${mode === 'owner' ? `<div class="gear-actions"><label class="check-label"><input type="checkbox" data-share="${esc(item.id)}" data-focus="share-${esc(item.id)}" aria-label="Partager ${esc(name)}" ${item.shared ? 'checked' : ''}>Disponible en session</label><div class="gear-buttons">${button(`equipment:${item.id}`, 'Modifier', 'edit', 'text-button', `edit-${item.id}`)}<button type="button" class="icon-button" data-action="delete:${esc(item.id)}" data-focus="remove-${esc(item.id)}" aria-label="Retirer ${esc(name)}">${icon('close')}</button></div></div>` : ''}
  </article>`
}
function renderEquipment(view) {
  $('#panel').innerHTML = `<div class="view-toolbar"><div><h2>${mode === 'owner' ? 'Mon matériel' : 'Matériel partagé'}</h2><p>${mode === 'owner' ? 'Ton inventaire reste privé, sauf les équipements que tu choisis de partager.' : 'Ces équipements peuvent être disponibles pendant une session commune.'}</p></div>${mode === 'owner' ? button('equipment', 'Ajouter du matériel', 'plus', 'button primary', 'add-equipment') : ''}</div>
    <div class="card filter-bar"><div class="filter-field"><label for="gear-query">Rechercher du matériel</label><input type="search" id="gear-query" value="${esc(query)}" placeholder="Corde, modèle, marque…"></div>
    ${mode === 'owner' ? `<div class="filter-field"><label for="gear-filter">Visibilité</label><select id="gear-filter"><option value="all">Tout mon matériel</option><option value="shared" ${filter === 'shared' ? 'selected' : ''}>Partagé avec les membres</option><option value="private" ${filter === 'private' ? 'selected' : ''}>Privé</option></select></div>` : ''}
    <p class="small muted" id="gear-count" role="status"></p></div><div id="gear-results"></div><div class="member-notice gear-warning">${icon('info')}<p>L’état du matériel est déclaratif. Le partage n’est ni une réservation ni une garantie de sécurité.</p></div>`
  updateGearResults(view)
}
function updateGearResults(view) {
  const items = view.equipment.filter((item) => (mode === 'member' || filter === 'all' || (filter === 'shared' ? item.shared : !item.shared)) && `${categories[item.category]} ${item.brand} ${item.model}`.toLocaleLowerCase('fr-FR').includes(query.toLocaleLowerCase('fr-FR').trim()))
  $('#gear-count').textContent = `${items.length} référence${items.length > 1 ? 's' : ''}`
  $('#gear-results').innerHTML = items.length ? `<div class="gear-grid">${items.map(gearCard).join('')}</div>` : `<div class="card">${empty('Aucun matériel à afficher', query || filter !== 'all' ? 'Essaie une autre recherche ou enlève les filtres.' : mode === 'owner' ? 'Ajoute un premier équipement pour préparer tes prochaines sessions.' : 'Ce membre ne partage pas encore de matériel.', query || filter !== 'all' ? 'clear-gear' : mode === 'owner' ? 'equipment' : 'go-overview', query || filter !== 'all' ? 'Effacer les filtres' : mode === 'owner' ? 'Ajouter un équipement' : 'Revenir au profil', 'gear')}</div>`
}
function renderSettings() {
  $('#panel').innerHTML = `<div class="profile-grid"><div class="stack"><section class="card card-body">${heading('Personnaliser mon profil', 'settings')}<div class="settings-list">${[['Identité et présentation', 'Nom affiché, photo, ville et bio.', 'identity'], ['Pratique et objectifs', 'Disciplines, niveaux déclarés et envies de grimpe.', 'practice'], ['Disponibilités et partenaires', 'Créneaux, style de session et recherche active ou en pause.', 'partners']].map(([title, description, action]) => `<div class="setting-row"><div><h3>${title}</h3><p>${description}</p></div>${button(action, 'Modifier', 'edit', 'button', `settings-${action}`)}</div>`).join('')}</div></section><section class="card card-body">${heading('Compte et sécurité', 'lock')}<p class="small muted">Ces informations ne font pas partie de la fiche visible aux membres.</p><div class="setting-row"><div><h3>Adresse e-mail de connexion</h3><p class="account-value">${esc(profile.email)}</p></div>${badge('Privé')}</div><div class="notice">${icon('info')}<p>La modification de l’e-mail, du mot de passe et la suppression du compte nécessitent des parcours sécurisés dédiés. Ils ne sont pas simulés ici. Aucun mot de passe ne te sera demandé dans cette maquette.</p></div></section></div><aside class="stack"><section class="card card-body">${heading('Ce que les membres voient', 'eye')}<ul class="privacy-list"><li>Ton nom affiché, ta photo, ta ville et ta bio.</li><li>Ta pratique, tes envies et tes disponibilités.</li><li>Ton statut de recherche et tes préférences de partenaire.</li><li>Tes publications et uniquement le matériel partagé.</li></ul>${button('demo-member', 'Vérifier ma vue membre', 'eye', 'button')}<div class="privacy-note">${icon('lock')}<p>L’e-mail, les réglages et les notes personnelles du matériel restent privés. La fiche est réservée aux membres connectés, pas aux moteurs de recherche.</p></div></section>${readiness()}</aside></div>`
}
function render() {
  const view = mode === 'owner' ? profile : memberProjection(profile)
  $('#page-title').textContent = mode === 'owner' ? 'Mon profil' : 'Mon profil, côté membres'
  $('#page-description').textContent = mode === 'owner' ? 'Ta pratique, tes envies, ta prochaine cordée.' : 'Vérifie les informations que tu choisis de partager.'
  document.querySelectorAll('[data-mode]').forEach((element) => element.setAttribute('aria-pressed', String(element.dataset.mode === mode)))
  $('#member-notice').hidden = mode !== 'member'
  if (mode === 'member' && section === 'settings') section = 'overview'
  renderHero(view)
  renderNavigation()
  if (section === 'overview') renderOverview(view)
  if (section === 'posts') renderPosts(view)
  if (section === 'equipment') renderEquipment(view)
  if (section === 'settings') renderSettings()
}

const options = (map, selected) => Object.entries(map).map(([key, label]) => `<option value="${esc(key)}" ${key === selected ? 'selected' : ''}>${esc(label)}</option>`).join('')
const field = (name, label, value, extra = '') => `<div class="form-field"><label for="${name}">${esc(label)}</label><input name="${name}" id="${name}" value="${esc(value)}" ${extra} aria-describedby="error-${name}"><p class="error" id="error-${name}" role="alert"></p></div>`
const textarea = (name, label, value, max) => `<div class="form-field"><label for="${name}">${esc(label)}</label><textarea id="${name}" name="${name}" maxlength="${max}" ${label.endsWith('(obligatoire)') ? 'required' : ''} aria-describedby="hint-${name} error-${name}">${esc(value)}</textarea><p class="hint" id="hint-${name}">${max} caractères maximum.</p><p class="error" id="error-${name}" role="alert"></p></div>`
const select = (name, label, map, value) => `<div class="form-field"><label for="${name}">${esc(label)}</label><select name="${name}" id="${name}">${options(map, value)}</select></div>`
const checkbox = (name, value, label, checked) => `<label class="choice"><input type="checkbox" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''}>${esc(label)}</label>`

function openDialog(action, trigger) {
  dialogAction = action
  returnFocus = trigger?.dataset.focus ?? ''
  let title = ''
  let description = 'Les modifications restent dans cette maquette. Rien n’est envoyé.'
  let body = ''
  let submit = 'Enregistrer dans la démo'
  if (action === 'identity') {
    title = 'Un profil qui te ressemble'
    draftAvatar = profile.avatar
    body = `<div class="photo-editor"><div class="avatar" id="photo-preview">${avatar()}</div><div><label for="photo-file">Photo de profil</label><input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="photo-hint photo-error"><p id="photo-hint" class="hint">JPG, PNG ou WebP · 2 Mo maximum. Aperçu local uniquement.</p><p id="photo-error" class="error" role="alert"></p>${button('remove-photo', 'Utiliser mes initiales', '', 'text-button')}</div></div><div class="form-grid">${field('displayName', 'Nom affiché (obligatoire)', profile.displayName, 'required minlength="2" maxlength="80" autocomplete="nickname"')}${field('location', 'Ville ou secteur', profile.location, 'maxlength="255" autocomplete="off"')}<div class="full">${textarea('bio', 'Quelques mots sur toi', profile.bio, 500)}</div></div><p class="notice">${icon('eye')}Ces informations apparaîtront dans la vue membre. Indique une ville ou un secteur, pas une adresse précise.</p>`
  } else if (action === 'practice') {
    title = 'Ma pratique et mes envies'
    body = `<fieldset><legend>Disciplines et niveaux déclarés</legend><p class="hint">Coche une discipline pour renseigner ton niveau. Les cotations sont des repères, pas une certification.</p>${Object.entries(disciplines).map(([key, label]) => `<div class="practice-choice"><label class="check-label"><input type="checkbox" name="discipline" value="${key}" ${profile.disciplines.includes(key) ? 'checked' : ''}>${label}</label><label class="sr-only" for="grade-${key}">Niveau en ${label.toLowerCase()}</label><select id="grade-${key}" name="grade-${key}" ${profile.disciplines.includes(key) ? '' : 'disabled'}>${options(Object.fromEntries(grades.map((grade) => [grade, grade])), profile.grades[key] || '5a')}</select></div>`).join('')}</fieldset>${select('environment', 'Environnement préféré', { '': 'À préciser', ...environments }, profile.environment)}<fieldset><legend>Mes objectifs</legend><div class="choice-grid">${goalOptions.map((goal) => checkbox('goal', goal, goal, profile.goals.includes(goal))).join('')}</div></fieldset>`
  } else if (action === 'partners') {
    title = 'Grimper avec les bonnes personnes'
    body = `<label class="choice"><input type="checkbox" name="enabled" ${profile.partner.enabled ? 'checked' : ''}>Je recherche des partenaires en ce moment</label><p class="hint">Une pause masque le bouton de demande dans la vue membre. Elle ne masque pas le reste du profil.</p><div class="form-grid">${select('level', 'Niveau recherché', levels, profile.partner.level)}${select('style', 'Style de session', styles, profile.partner.style)}</div><fieldset><legend>Mes disponibilités habituelles</legend><div class="choice-grid">${Object.entries(slots).map(([key, label]) => checkbox('slot', key, label, profile.availability.includes(key))).join('')}</div></fieldset>${textarea('partner-note', 'Un mot pour les futurs partenaires', profile.partner.notes, 300)}`
  } else if (action.startsWith('equipment')) {
    const item = profile.equipment.find((gear) => gear.id === action.split(':')[1])
    title = item ? 'Modifier un équipement' : 'Ajouter du matériel'
    body = `<div class="form-grid">${select('category', 'Catégorie', categories, item?.category ?? 'corde')}${field('quantity', 'Quantité (obligatoire)', item?.quantity ?? 1, 'type="number" min="1" max="200" step="1" required')}${field('brand', 'Marque', item?.brand ?? '', 'maxlength="80"')}${field('model', 'Modèle (obligatoire)', item?.model ?? '', 'required maxlength="120"')}${field('detail', 'Détails : taille, longueur…', item?.detail ?? '', 'maxlength="120"')}${select('condition', 'État déclaré', conditions, item?.condition ?? 'bon')}</div><label class="choice"><input type="checkbox" name="shared" ${item?.shared ? 'checked' : ''}>Disponible pendant une session, visible aux membres</label><p class="hint">La disponibilité n’est ni une réservation ni une garantie de bon état.</p>${textarea('gear-note', 'Notes privées', item?.notes ?? '', 500)}`
  } else if (action.startsWith('delete:')) {
    const item = profile.equipment.find((gear) => gear.id === action.split(':')[1])
    title = 'Retirer cet équipement ?'
    description = 'Seul l’inventaire fictif de cette maquette sera modifié.'
    body = `<p><strong>${esc(item.brand)} ${esc(item.model)}</strong> sera retiré de l’inventaire et de la vue membre. Tu peux restaurer le jeu de démonstration avec « Réinitialiser ».</p>`
    submit = 'Retirer de la démo'
  } else if (action === 'compose') {
    title = 'Partager un moment de grimpe'
    body = `${field('post-title', 'Titre (obligatoire)', '', 'required maxlength="100"')}${textarea('post-content', 'Ton récit (obligatoire)', '', 1000)}<div class="form-grid">${select('post-discipline', 'Discipline', disciplines, profile.disciplines[0] || 'bloc')}${select('post-grade', 'Cotation, si utile', { '': 'Sans cotation', ...Object.fromEntries(grades.map((grade) => [grade, grade])) }, '')}</div>${select('post-image', 'Illustration de démonstration', { '': 'Sans image', bloc: 'Bloc à Fontainebleau', voie: 'Escalade dans le Verdon', indoor: 'Séance en salle' }, '')}<p class="notice">${icon('info')}Ce formulaire sert à valider le parcours de publication. Aucun contenu n’est publié sur Spity.</p>`
    submit = 'Publier dans la démo'
  } else if (action.startsWith('post:')) {
    const post = profile.posts.find((item) => item.id === action.split(':')[1])
    title = post.title
    description = `${disciplines[post.discipline]} · ${formatDate(post.date)} · Publication fictive`
    body = `${post.image ? `<img class="post-detail-image" src="${esc(post.image)}" alt="Illustration de démonstration pour cette publication">` : ''}<p class="post-copy">${esc(post.content)}</p>${post.grade ? `<p class="hint">Cotation : ${esc(post.grade)}</p>` : ''}`
    submit = ''
  } else if (action === 'request') {
    title = requestSent ? 'Demande simulée' : 'Proposer une session'
    description = 'Un aperçu du premier échange. Aucun message ne sera envoyé.'
    body = requestSent ? `<p>La demande de démonstration est en attente. Elle n’existe pas dans les demandes réelles de Spity.</p>` : `<p class="small muted">À ${esc(profile.displayName)} · ${esc(profile.location || 'Lieu à convenir')}</p><div class="form-grid">${select('request-discipline', 'Discipline proposée', disciplines, profile.disciplines[0] || 'bloc')}${select('request-slot', 'Créneau à discuter', { '': 'À convenir ensemble', ...Object.fromEntries(profile.availability.map((key) => [key, slots[key]])) }, profile.availability[0] || '')}</div>${textarea('request-note', 'Ton message (obligatoire)', '', 300)}<p class="notice">${icon('info')}Le lieu, la date et les détails se confirment ensemble. Cette simulation n’envoie ni demande ni notification.</p>`
    submit = requestSent ? '' : 'Simuler la demande'
  }
  dialog.setAttribute('role', action.startsWith('delete:') ? 'alertdialog' : 'dialog')
  $('#dialog-content').innerHTML = `<div class="dialog-heading"><div><h2 id="dialog-title">${esc(title)}</h2><p id="dialog-description">${esc(description)}</p></div><button class="icon-button" type="button" data-action="cancel" aria-label="Fermer la fenêtre">${icon('close')}</button></div><form id="edit-form" novalidate><div class="dialog-body form-stack">${body}</div><div class="dialog-actions"><button type="button" class="button" id="cancel-dialog" data-action="cancel">${submit ? 'Annuler' : 'Fermer'}</button>${submit ? `<button class="button ${action.startsWith('delete:') ? 'danger' : 'primary'}" type="submit">${submit}</button>` : ''}</div></form>`
  if (!dialog.open) dialog.showModal()
  // Keep initial focus visible even when a long editor scrolls on a small phone.
  const initialFocus = action.startsWith('delete:') ? $('#cancel-dialog') : dialog.querySelector('[aria-label="Fermer la fenêtre"]')
  initialFocus.focus({ preventScroll: true })
}

function cleanUrls() {
  for (const url of objectUrls) if (url !== profile.avatar) { URL.revokeObjectURL(url); objectUrls.delete(url) }
}
function closeDialog() {
  uploadSequence += 1
  dialog.close()
  $('#dialog-content').replaceChildren()
  draftAvatar = null
  cleanUrls()
  focusKey(returnFocus)
}
function error(name, message) {
  const input = $(`#${name}`)
  const output = $(`#error-${name}`)
  if (output) output.textContent = message
  input?.setAttribute('aria-invalid', 'true')
  input?.focus()
  return false
}
function saveDialog(event) {
  event.preventDefault()
  const form = event.target
  form.querySelectorAll('[aria-invalid]').forEach((input) => input.removeAttribute('aria-invalid'))
  form.querySelectorAll('.error').forEach((output) => { output.textContent = '' })
  const data = new FormData(form)
  const value = (key) => String(data.get(key) ?? '').trim()
  if (dialogAction === 'identity') {
    if (value('displayName').length < 2 || value('displayName').length > 80) return error('displayName', 'Choisis un nom affiché de 2 à 80 caractères.')
    if (value('location').length > 255) return error('location', 'Indique au maximum 255 caractères.')
    if (value('bio').length > 500) return error('bio', 'La bio doit contenir au maximum 500 caractères.')
    Object.assign(profile, { displayName: value('displayName'), location: value('location'), bio: value('bio'), avatar: draftAvatar })
  } else if (dialogAction === 'practice') {
    profile.disciplines = data.getAll('discipline')
    profile.grades = Object.fromEntries(profile.disciplines.map((key) => [key, value(`grade-${key}`)]))
    profile.environment = value('environment')
    profile.goals = data.getAll('goal')
  } else if (dialogAction === 'partners') {
    profile.partner = { enabled: data.has('enabled'), level: value('level'), style: value('style'), notes: value('partner-note') }
    profile.availability = data.getAll('slot')
  } else if (dialogAction.startsWith('equipment')) {
    const quantity = Number(value('quantity'))
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 200) return error('quantity', 'Indique un nombre entier entre 1 et 200.')
    if (!value('model') || value('model').length > 120) return error('model', 'Indique un modèle de 1 à 120 caractères.')
    const id = dialogAction.split(':')[1] || `gear-${crypto.randomUUID()}`
    const item = { id, category: value('category'), brand: value('brand'), model: value('model'), quantity, detail: value('detail'), condition: value('condition'), shared: data.has('shared'), notes: value('gear-note') }
    const index = profile.equipment.findIndex((gear) => gear.id === id)
    if (index < 0) profile.equipment.push(item)
    else profile.equipment[index] = item
  } else if (dialogAction.startsWith('delete:')) {
    profile.equipment = profile.equipment.filter((gear) => gear.id !== dialogAction.split(':')[1])
    returnFocus = 'add-equipment'
  } else if (dialogAction === 'compose') {
    if (!value('post-title')) return error('post-title', 'Donne un titre à cette publication.')
    if (!value('post-content')) return error('post-content', 'Ajoute quelques mots pour raconter ta session.')
    profile.posts.unshift({ id: `post-${crypto.randomUUID()}`, title: value('post-title'), content: value('post-content'), discipline: value('post-discipline'), grade: value('post-grade') || null, image: assets[value('post-image')] || null, date: '2026-09-09' })
    section = 'posts'; filter = 'all'; returnFocus = 'compose'
  } else if (dialogAction === 'request') {
    if (!value('request-note')) return error('request-note', 'Ajoute un message pour proposer cette session.')
    requestSent = true
  }
  render()
  closeDialog()
  notify(dialogAction === 'request' ? 'Demande simulée, aucun message envoyé.' : 'Modification appliquée à la maquette uniquement.')
}

function setSection(value) {
  section = value; filter = 'all'; query = ''
  render()
  focusKey(`nav-${section}`)
}
function setMode(value) {
  mode = value; filter = 'all'; query = ''
  render()
  notify(mode === 'member' ? 'Vue membre : les informations privées ne sont pas affichées.' : 'Retour à ton espace personnel de démonstration.')
}
function reset() {
  if (dialog.open) closeDialog()
  profile = createDemo($('#scenario').value === 'empty')
  cleanUrls(); requestSent = false; section = 'overview'; filter = 'all'; query = ''; mode = 'owner'
  render(); notify('Exemple réinitialisé. Aucune donnée réelle n’a été modifiée.')
}
document.addEventListener('click', (event) => {
  const element = event.target.closest('button')
  if (!element) return
  if (element.dataset.mode) return setMode(element.dataset.mode)
  if (element.dataset.section) return setSection(element.dataset.section)
  const action = element.dataset.action
  if (!action) return
  if (action === 'cancel') return closeDialog()
  if (action === 'demo-member' || action === 'demo-owner') { setMode(action === 'demo-member' ? 'member' : 'owner'); $(`[data-mode="${mode}"]`).focus(); return }
  if (action === 'go-posts') return setSection('posts')
  if (action === 'go-overview') return setSection('overview')
  if (action === 'clear-posts') { filter = 'all'; render(); $('#post-filter').focus(); return }
  if (action === 'clear-gear') { filter = 'all'; query = ''; render(); $('#gear-query').focus(); return }
  if (action === 'remove-photo') { uploadSequence += 1; draftAvatar = null; $('#photo-preview').innerHTML = avatar(null); $('#photo-file').value = ''; return }
  openDialog(action, element)
})
document.addEventListener('change', (event) => {
  const input = event.target
  if (input.id === 'scenario') return reset()
  if (input.id === 'post-filter') { filter = input.value; updatePostResults(mode === 'owner' ? profile : memberProjection(profile)); return }
  if (input.id === 'gear-filter') { filter = input.value; updateGearResults(profile); return }
  if (input.name === 'discipline') $(`#grade-${input.value}`).disabled = !input.checked
  if (input.dataset.share) {
    profile.equipment.find((item) => item.id === input.dataset.share).shared = input.checked
    const key = input.dataset.focus
    render()
    if (document.querySelector(`[data-focus="${CSS.escape(key)}"]`)) focusKey(key)
    else $('#gear-filter')?.focus()
    notify('Visibilité du matériel mise à jour dans la maquette.')
  }
  if (input.id === 'photo-file') void loadPhoto(input)
})
async function loadPhoto(input) {
  const file = input.files[0]
  if (!file) return
  const sequence = ++uploadSequence
  const photoError = (message) => { $('#photo-error').textContent = message; input.setAttribute('aria-invalid', 'true'); input.value = '' }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) return photoError('Choisis une image JPG, PNG ou WebP de 2 Mo maximum.')
  const url = URL.createObjectURL(file)
  objectUrls.add(url)
  const image = new Image()
  image.src = url
  try {
    await image.decode()
    if (sequence !== uploadSequence || !dialog.open) { URL.revokeObjectURL(url); objectUrls.delete(url); return }
    draftAvatar = url
    input.removeAttribute('aria-invalid'); $('#photo-error').textContent = ''
    $('#photo-preview').innerHTML = avatar(url)
  } catch { URL.revokeObjectURL(url); objectUrls.delete(url); if (sequence === uploadSequence && dialog.open) photoError('Cette image ne peut pas être lue. Choisis un autre fichier.') }
}
document.addEventListener('input', (event) => {
  if (event.target.id === 'gear-query') { query = event.target.value; updateGearResults(mode === 'owner' ? profile : memberProjection(profile)) }
})
document.addEventListener('submit', (event) => { if (event.target.id === 'edit-form') saveDialog(event) })
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeDialog() })
$('#reset').addEventListener('click', reset)
render()

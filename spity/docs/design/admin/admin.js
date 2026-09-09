'use strict'

// Isolated design prototype: no API, persistence, production account or permission.
const initialAccounts = [
  { id: 'camille', name: 'Camille Martin', email: 'camille@example.test', role: 'Grimpeur', admin: true, suspended: false },
  { id: 'noah', name: 'Noah Bernard', email: 'noah@example.test', role: 'Grimpeur', admin: false, suspended: false },
  { id: 'vertical', name: 'Club Vertical', email: 'contact@vertical.example.test', role: 'Club', admin: false, suspended: false },
  { id: 'lea', name: 'Léa Moreau', email: 'lea@example.test', role: 'Grimpeur', admin: false, suspended: false },
  { id: 'jules', name: 'Jules Petit', email: 'jules@example.test', role: 'Grimpeur', admin: false, suspended: true },
  { id: 'horizon', name: 'Horizon Escalade', email: 'bonjour@horizon.example.test', role: 'Club', admin: false, suspended: false },
]
const initialPosts = [
  { id: 'p1', author: 'Noah Bernard', content: 'Première 6b en tête ! Merci aux partenaires de la session pour les conseils et les encouragements.', place: 'Session en salle · 6b', date: '9 sept. 2026 · 09:15', hidden: false },
  { id: 'p2', author: 'Club Vertical', content: 'Une sortie club ce samedi, ouverte à tous les niveaux. Pensez à vérifier votre matériel avant le départ.', place: 'Vie du club', date: '8 sept. 2026 · 18:30', hidden: false },
  { id: 'p3', author: 'Jules Petit', content: 'Exemple fictif de message publicitaire répété, utilisé uniquement pour présenter la modération.', place: 'Publication de démonstration', date: '8 sept. 2026 · 16:10', hidden: true },
  { id: 'p4', author: 'Léa Moreau', content: 'Qui aurait envie de découvrir les blocs de Fontainebleau ce week-end ? Je cherche un petit groupe pour une session tranquille.', place: 'Fontainebleau · Bloc', date: '8 sept. 2026 · 12:20', hidden: false },
  { id: 'p5', author: 'Horizon Escalade', content: 'Bienvenue aux nouveaux adhérents ! La prochaine séance découverte se prépare avec nos bénévoles.', place: 'Vie du club', date: '7 sept. 2026 · 17:45', hidden: false },
]
const initialHistory = [
  { action: 'Compte suspendu', target: 'Jules Petit', reason: 'Exemple : répétition de messages publicitaires.', date: '9 sept. 2026 · 09:42', icon: 'lock' },
  { action: 'Publication masquée', target: 'Publication de Jules Petit', reason: 'Exemple : contenu publicitaire hors sujet.', date: '9 sept. 2026 · 09:40', icon: 'eye-off' },
  { action: 'Publication rétablie', target: 'Publication de Noah Bernard', reason: 'Exemple : contenu vérifié et conforme.', date: '8 sept. 2026 · 18:12', icon: 'feed' },
]
let accounts = structuredClone(initialAccounts)
let posts = structuredClone(initialPosts)
let history = structuredClone(initialHistory)
let pending = null
let returnFocus = null
const byId = (id) => document.getElementById(id)
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`
const avatar = (name, club = false) => `<span class="avatar${club ? ' club' : ''}" aria-hidden="true">${club ? icon('building') : escapeHtml(name.split(' ').map((part) => part[0]).slice(0, 2).join(''))}</span>`
const status = (suspended) => `<span class="status ${suspended ? 'suspended' : 'active'}">${suspended ? icon('lock') : '<span class="status-dot" aria-hidden="true"></span>'}${suspended ? 'Suspendu' : 'Actif'}</span>`
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr')
const announce = (message) => { byId('feedback').textContent = message }

function showView(name) {
  document.querySelectorAll('.view').forEach((section) => { section.hidden = section.id !== name })
  document.querySelectorAll('.section-nav [data-view]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.view === name)) })
}

function renderOverview() {
  const suspended = accounts.filter((account) => account.suspended).length
  const hidden = posts.filter((post) => post.hidden).length
  const stats = [
    ['Comptes', accounts.length, `${accounts.length - suspended} actifs · ${suspended} suspendu${suspended > 1 ? 's' : ''}`, 'users'],
    ['Clubs', accounts.filter((account) => account.role === 'Club').length, 'Au sein de la communauté', 'building'],
    ['Publications', posts.length, `${posts.length - hidden} visibles · ${hidden} masquée${hidden > 1 ? 's' : ''}`, 'feed'],
    ['Administrateurs', accounts.filter((account) => account.admin).length, 'Accès à cet espace', 'shield'],
  ]
  byId('stats').innerHTML = stats.map(([label, value, detail, glyph]) => `<div class="stat"><div class="stat-top"><span>${label}</span>${icon(glyph)}</div><div class="stat-value">${value}</div><p class="stat-detail">${detail}</p></div>`).join('')
  byId('recent-accounts').innerHTML = [accounts[0], accounts[1], accounts[2], accounts[4]].map((account) => `<div class="account-item">${avatar(account.name, account.role === 'Club')}<div class="person"><strong>${escapeHtml(account.name)}</strong><small>${account.role}${account.admin ? ' · Administrateur' : ''}</small></div>${status(account.suspended)}</div>`).join('')
  byId('recent-history').innerHTML = history.slice(0, 3).map((entry) => `<li><span class="activity-icon">${icon(entry.icon)}</span><div><strong>${escapeHtml(entry.action)}</strong><p>${escapeHtml(entry.target)} · Admin démo</p><time>${escapeHtml(entry.date)}</time></div></li>`).join('')
}

function renderAccounts() {
  const query = normalize(byId('account-search').value.trim())
  const role = byId('account-role').value
  const filter = byId('account-status').value
  const filtered = accounts.filter((account) => normalize(`${account.name} ${account.email}`).includes(query) && (role === 'all' || account.role === role) && (filter === 'all' || account.suspended === (filter === 'suspended')))
  byId('account-count').textContent = `${filtered.length} compte${filtered.length > 1 ? 's' : ''} sur ${accounts.length} · Données fictives`
  byId('account-rows').innerHTML = filtered.map((account) => `<tr><td><div class="person-cell">${avatar(account.name, account.role === 'Club')}<div class="person"><strong>${escapeHtml(account.name)}</strong><small>${escapeHtml(account.email)}</small></div></div></td><td>${account.role}</td><td>${account.admin ? `<span class="status admin">${icon('shield')}Administrateur</span>` : 'Standard'}</td><td>${status(account.suspended)}</td><td class="align-right">${account.admin ? `<span class="protected">${icon('lock')}Compte protégé</span>` : `<button class="button ${account.suspended ? 'secondary' : 'outline'}" type="button" data-action="account" data-id="${account.id}" aria-label="${account.suspended ? 'Réactiver' : 'Suspendre'} le compte de ${escapeHtml(account.name)}">${account.suspended ? 'Réactiver' : 'Suspendre'}</button>`}</td></tr>`).join('')
  byId('accounts-empty').hidden = filtered.length > 0
}

function renderPosts() {
  const query = normalize(byId('post-search').value.trim())
  const filter = byId('post-status').value
  const filtered = posts.filter((post) => normalize(`${post.author} ${post.content}`).includes(query) && (filter === 'all' || post.hidden === (filter === 'hidden')))
  byId('post-count').textContent = `${filtered.length} publication${filtered.length > 1 ? 's' : ''} · Données fictives`
  byId('post-list').innerHTML = filtered.map((post) => `<article class="card post-card"><div class="post-author">${avatar(post.author, /Club|Horizon/.test(post.author))}<div class="person"><strong>${escapeHtml(post.author)}</strong><small>${post.date}</small></div><span class="status ${post.hidden ? 'hidden' : 'visible'}">${post.hidden ? icon('eye-off') : '<span class="status-dot" aria-hidden="true"></span>'}${post.hidden ? 'Masquée' : 'Visible'}</span></div><p class="post-content">${escapeHtml(post.content)}</p><p class="post-context">${escapeHtml(post.place)}</p><div class="post-actions"><small>${post.hidden ? 'Non affichée dans le fil' : 'Affichée dans le fil'}</small><button type="button" class="button ${post.hidden ? 'secondary' : 'outline'}" data-action="post" data-id="${post.id}" aria-label="${post.hidden ? 'Rétablir' : 'Masquer'} la publication de ${escapeHtml(post.author)}">${post.hidden ? 'Rétablir' : 'Masquer'}</button></div></article>`).join('')
  byId('posts-empty').hidden = filtered.length > 0
}

function renderHistory() {
  byId('history-rows').innerHTML = history.map((entry) => `<tr><td><time>${escapeHtml(entry.date)}</time></td><td>Admin démo</td><td><strong>${escapeHtml(entry.action)}</strong><span class="history-target">${escapeHtml(entry.target)}</span></td><td>${escapeHtml(entry.reason)}</td></tr>`).join('')
}
function renderAll() { renderOverview(); renderAccounts(); renderPosts(); renderHistory() }

function openConfirmation(kind, id, trigger) {
  const account = kind === 'account' ? accounts.find((item) => item.id === id) : null
  const post = kind === 'post' ? posts.find((item) => item.id === id) : null
  if ((!account && !post) || account?.admin) return
  const restoring = account ? account.suspended : post.hidden
  pending = { kind, id, restoring }
  returnFocus = { trigger, kind, id }
  byId('reason').value = ''
  byId('reason').removeAttribute('aria-invalid')
  byId('reason-error').textContent = ''
  byId('dialog-title').textContent = account ? `${restoring ? 'Réactiver' : 'Suspendre'} ${account.name} ?` : `${restoring ? 'Rétablir' : 'Masquer'} cette publication ?`
  byId('dialog-description').textContent = account
    ? restoring ? 'Le compte pourra à nouveau accéder à Spity. Ses données seront conservées.' : 'Le compte ne pourra plus accéder à Spity. Ses données seront conservées et vous pourrez le réactiver.'
    : restoring ? `La publication de ${post.author} sera de nouveau visible dans le fil et sur son profil.` : `La publication de ${post.author} ne sera plus visible dans le fil ni sur son profil. Elle ne sera pas supprimée.`
  byId('confirm-action').textContent = account ? `${restoring ? 'Réactiver' : 'Suspendre'} le compte` : `${restoring ? 'Rétablir' : 'Masquer'} la publication`
  byId('confirm-action').className = `button ${restoring ? 'primary' : 'danger'}`
  byId('confirmation').showModal()
}

document.querySelectorAll('nav svg').forEach((svg) => svg.setAttribute('aria-hidden', 'true'))
document.addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return
  if (button.dataset.view) showView(button.dataset.view)
  if (button.hasAttribute('data-app-preview')) announce('Cette maquette couvre uniquement l’administration. Les autres rubriques restent inchangées dans Spity.')
  if (button.dataset.action) openConfirmation(button.dataset.action, button.dataset.id, button)
})
byId('account-filters').addEventListener('input', renderAccounts)
byId('post-filters').addEventListener('input', renderPosts)
for (const id of ['account-filters', 'post-filters']) byId(id).addEventListener('submit', (event) => event.preventDefault())
byId('reset-filters').addEventListener('click', () => { byId('account-filters').reset(); renderAccounts(); byId('account-search').focus() })
byId('reset-post-filters').addEventListener('click', () => { byId('post-filters').reset(); renderPosts(); byId('post-search').focus() })
byId('cancel-action').addEventListener('click', () => byId('confirmation').close())
byId('confirmation').addEventListener('close', () => {
  const focus = returnFocus
  pending = null
  returnFocus = null
  if (!focus) return
  const replacement = document.querySelector(`[data-action="${focus.kind}"][data-id="${focus.id}"]`)
  const fallback = byId(focus.kind === 'account' ? 'account-search' : 'post-search')
  const target = focus.trigger.isConnected ? focus.trigger : replacement ?? fallback
  target.focus()
})
byId('confirmation-form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (!pending) return
  const reason = byId('reason').value.trim()
  if (reason.length < 8 || reason.length > 500) {
    byId('reason').setAttribute('aria-invalid', 'true')
    byId('reason-error').textContent = 'Indiquez un motif de 8 à 500 caractères.'
    byId('reason').focus()
    return
  }
  const { kind, id, restoring } = pending
  let action, target
  if (kind === 'account') {
    const account = accounts.find((item) => item.id === id)
    if (!account || account.admin) return
    account.suspended = !restoring
    action = restoring ? 'Compte réactivé' : 'Compte suspendu'
    target = account.name
  } else {
    const post = posts.find((item) => item.id === id)
    if (!post) return
    post.hidden = !restoring
    action = restoring ? 'Publication rétablie' : 'Publication masquée'
    target = `Publication de ${post.author}`
  }
  history.unshift({ action, target, reason, icon: kind === 'account' ? 'lock' : 'eye-off', date: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) })
  renderAll()
  byId('confirmation').close()
  announce(`Simulation : ${action.toLocaleLowerCase('fr')} — ${target}. Le motif figure dans l’historique.`)
})
byId('reset-demo').addEventListener('click', () => {
  accounts = structuredClone(initialAccounts)
  posts = structuredClone(initialPosts)
  history = structuredClone(initialHistory)
  byId('account-filters').reset()
  byId('post-filters').reset()
  renderAll()
  announce('La démo a été réinitialisée. Aucune donnée réelle n’a été modifiée.')
})
renderAll()

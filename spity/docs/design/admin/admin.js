import { calculateDashboard, comparison, DEMO_DATE, demoInteractions, formatDay } from './dashboard.mjs'

// Isolated design prototype: no API, persistence, production account or permission.
const initialAccounts = [
  { id: 'camille', name: 'Camille Martin', email: 'camille@example.test', role: 'Grimpeur', admin: true, suspended: false },
  { id: 'noah', name: 'Noah Bernard', email: 'noah@example.test', role: 'Grimpeur', admin: false, suspended: false },
  { id: 'vertical', name: 'Club Vertical', email: 'contact@vertical.example.test', role: 'Club', admin: false, suspended: false },
  { id: 'lea', name: 'Léa Moreau', email: 'lea@example.test', role: 'Grimpeur', admin: false, suspended: false },
  { id: 'jules', name: 'Jules Petit', email: 'jules@example.test', role: 'Grimpeur', admin: false, suspended: true },
  { id: 'horizon', name: 'Horizon Escalade', email: 'bonjour@horizon.example.test', role: 'Club', admin: false, suspended: false },
].map((account, index) => ({ ...account, createdAt: ['2026-09-05', '2026-08-12', '2026-07-31', '2026-07-05', '2026-08-26', '2026-06-16'][index] }))
const initialPosts = [
  { id: 'p1', author: 'Noah Bernard', content: 'Première 6b en tête ! Merci aux partenaires de la session pour les conseils et les encouragements.', place: 'Session en salle · 6b', date: '9 sept. 2026 · 09:15', hidden: false },
  { id: 'p2', author: 'Club Vertical', content: 'Une sortie club ce samedi, ouverte à tous les niveaux. Pensez à vérifier votre matériel avant le départ.', place: 'Vie du club', date: '8 sept. 2026 · 18:30', hidden: false },
  { id: 'p3', author: 'Jules Petit', content: 'Exemple fictif de message publicitaire répété, utilisé uniquement pour présenter la modération.', place: 'Publication de démonstration', date: '8 sept. 2026 · 16:10', hidden: true },
  { id: 'p4', author: 'Léa Moreau', content: 'Qui aurait envie de découvrir les blocs de Fontainebleau ce week-end ? Je cherche un petit groupe pour une session tranquille.', place: 'Fontainebleau · Bloc', date: '8 sept. 2026 · 12:20', hidden: false },
  { id: 'p5', author: 'Horizon Escalade', content: 'Bienvenue aux nouveaux adhérents ! La prochaine séance découverte se prépare avec nos bénévoles.', place: 'Vie du club', date: '7 sept. 2026 · 17:45', hidden: false },
].map((post, index) => {
  const publishedAt = ['2026-09-09', '2026-09-02', '2026-08-28', '2026-08-23', '2026-08-16'][index]
  return { ...post, publishedAt, authorId: ['noah', 'vertical', 'jules', 'lea', 'horizon'][index], date: `${formatDay(publishedAt)} 2026` }
})
const initialHistory = [
  { action: 'Compte suspendu', target: 'Jules Petit', reason: 'Exemple : répétition de messages publicitaires.', date: '9 sept. 2026 · 09:42', icon: 'lock' },
  { action: 'Publication masquée', target: 'Publication de Jules Petit', reason: 'Exemple : contenu publicitaire hors sujet.', date: '9 sept. 2026 · 09:40', icon: 'eye-off' },
  { action: 'Publication rétablie', target: 'Publication de Léa Moreau', reason: 'Exemple : contenu vérifié et conforme.', date: '8 sept. 2026 · 18:12', icon: 'feed' },
].map((entry, index) => ({ ...entry, occurredAt: index === 2 ? '2026-09-08' : DEMO_DATE }))
let accounts = structuredClone(initialAccounts)
let posts = structuredClone(initialPosts)
let history = structuredClone(initialHistory)
let pending = null
let returnFocus = null
let dashboardDays = 30
let dashboardModel = null
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
  if (name === 'overview') renderChart()
}

function renderOverview() {
  dashboardModel = calculateDashboard({ accounts, posts, interactions: demoInteractions, history, days: dashboardDays })
  const { current, previous, totals } = dashboardModel
  byId('dashboard-dates').textContent = `${formatDay(dashboardModel.start)} – ${formatDay(dashboardModel.end)} 2026 · comparaison avec les ${dashboardDays} jours précédents`
  const stats = [
    ['accounts', 'Nouveaux comptes', `${totals.accounts} comptes au total`, 'users'],
    ['posts', 'Publications créées', `${totals.posts} publications au total, y compris masquées`, 'feed'],
    ['interactions', 'Interactions', `${current.likes} j’aime · ${current.comments} commentaires`, 'feed'],
    ['contributors', 'Contributeurs', 'Comptes ayant publié sur cette période', 'profile'],
  ]
  byId('stats').innerHTML = stats.map(([key, label, detail, glyph]) => `<div class="stat" data-stat="${key}"><div class="stat-top"><span>${label}</span>${icon(glyph)}</div><div class="stat-value">${current[key]}</div><p class="stat-comparison${current[key] > previous[key] ? ' increasing' : ''}">${escapeHtml(comparison(current[key], previous[key]))}</p><p class="stat-detail">${detail}</p></div>`).join('')
  byId('community-breakdown').innerHTML = `<div class="community-total"><strong>${totals.accounts}</strong><span>comptes inscrits</span></div><div class="distribution">${[['Grimpeurs', totals.climbers, 'climbers'], ['Clubs', totals.clubs, 'clubs']].map(([label, value, key]) => {
    const share = totals.accounts ? value / totals.accounts * 100 : 0
    return `<div class="distribution-row"><div><span>${label}</span><span><strong>${value}</strong> · ${Math.round(share)} %</span></div><svg class="distribution-bar" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true"><rect class="bar-track" width="100" height="4" rx="2"/><rect class="bar-${key}" width="${share}" height="4" rx="2"/></svg></div>`
  }).join('')}</div><dl class="community-facts"><div><dt>Comptes non suspendus</dt><dd>${totals.accounts - totals.suspended} / ${totals.accounts}</dd></div><div><dt>Accès administrateur</dt><dd>${totals.admins}</dd></div></dl><p class="community-note">L’accès administrateur s’ajoute au profil : il ne crée pas un compte supplémentaire.</p>`
  byId('moderation-metrics').innerHTML = `<div><div class="moderation-number">${icon('lock')}<strong id="suspended-count">${totals.suspended}</strong><span>compte${totals.suspended > 1 ? 's' : ''} suspendu${totals.suspended > 1 ? 's' : ''}</span></div><button class="text-button" type="button" data-filter-link="suspended">Voir les comptes suspendus ${icon('arrow')}</button></div><div><div class="moderation-number">${icon('eye-off')}<strong id="hidden-count">${totals.hidden}</strong><span>publication${totals.hidden > 1 ? 's' : ''} masquée${totals.hidden > 1 ? 's' : ''}</span></div><button class="text-button" type="button" data-filter-link="hidden">Voir les publications masquées ${icon('arrow')}</button></div><div><div class="moderation-number">${icon('shield')}<strong id="actions-count">${totals.actions}</strong><span>action${totals.actions > 1 ? 's' : ''} sur ${dashboardDays} jours</span></div><button class="text-button" type="button" data-view="history">Voir tout l’historique ${icon('arrow')}</button></div>`
  renderChart()
  byId('recent-accounts').innerHTML = [accounts[0], accounts[1], accounts[2], accounts[4]].map((account) => `<div class="account-item">${avatar(account.name, account.role === 'Club')}<div class="person"><strong>${escapeHtml(account.name)}</strong><small>${account.role}${account.admin ? ' · Administrateur' : ''}</small></div>${status(account.suspended)}</div>`).join('')
  byId('recent-history').innerHTML = history.slice(0, 3).map((entry) => `<li><span class="activity-icon">${icon(entry.icon)}</span><div><strong>${escapeHtml(entry.action)}</strong><p>${escapeHtml(entry.target)} · Admin démo</p><time>${escapeHtml(entry.date)}</time></div></li>`).join('')
}

function renderChart() {
  if (!dashboardModel || byId('overview').hidden) return
  const metric = byId('chart-metric').value
  const label = { accounts: 'Inscriptions', posts: 'Publications', interactions: 'Interactions' }[metric]
  const { buckets, bucketDays, current } = dashboardModel
  const total = current[metric]
  byId('chart-subtitle').textContent = `${total} ${label.toLocaleLowerCase('fr')} sur la période${metric === 'interactions' ? ' · j’aime et commentaires' : ''}`
  const chart = byId('activity-chart')
  const width = Math.max(280, Math.min(900, chart.clientWidth))
  const left = 30, right = width - 16, top = 20, bottom = 200
  const max = Math.max(4, Math.ceil(Math.max(...buckets.map((bucket) => bucket[metric])) / 4) * 4)
  const points = buckets.map((bucket, index) => ({ x: left + index / (buckets.length - 1) * (right - left), y: bottom - bucket[metric] / max * (bottom - top), bucket }))
  const line = points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const ticks = [0, 1, 2, 3, 4].map((step) => {
    const y = bottom - step / 4 * (bottom - top)
    return `<line x1="${left}" x2="${right}" y1="${y}" y2="${y}" class="chart-gridline"/><text x="${left - 10}" y="${y + 4}" text-anchor="end" class="chart-label">${max * step / 4}</text>`
  }).join('')
  const labelIndices = [...new Set([0, Math.floor((buckets.length - 1) / 2), buckets.length - 1])]
  chart.innerHTML = `<svg class="trend-chart" viewBox="0 0 ${width} 236" role="img" aria-labelledby="trend-title trend-description"><title id="trend-title">${label} sur ${dashboardDays} jours</title><desc id="trend-description">${total} au total. Valeurs par ${bucketDays === 1 ? 'jour' : `tranche de ${bucketDays} jours`}. Les valeurs exactes sont disponibles dans le tableau sous le graphique.</desc>${ticks}<polygon class="chart-area" points="${left},${bottom} ${line} ${right},${bottom}"/><polyline class="chart-line" points="${line}"/>${points.map(({ x, y, bucket }) => `<circle cx="${x}" cy="${y}" r="4" class="chart-point"><title>${formatDay(bucket.start)}${bucket.start === bucket.end ? '' : ` – ${formatDay(bucket.end)}`} : ${bucket[metric]}</title></circle>`).join('')}${labelIndices.map((index) => `<text class="chart-label" x="${points[index].x}" y="228" text-anchor="${index === 0 ? 'start' : index === buckets.length - 1 ? 'end' : 'middle'}">${formatDay(buckets[index].start)}</text>`).join('')}</svg>`
  byId('chart-caption').textContent = `${label} par ${bucketDays === 1 ? 'jour' : `tranche de ${bucketDays} jours`} · historique incluant les contenus masqués.`
  byId('chart-empty').hidden = total !== 0
  byId('chart-column').textContent = label
  byId('chart-table-caption').textContent = `${label} du ${formatDay(dashboardModel.start)} au ${formatDay(dashboardModel.end)} 2026`
  byId('chart-rows').innerHTML = buckets.map((bucket) => `<tr><th scope="row">${formatDay(bucket.start)}${bucket.start === bucket.end ? '' : ` – ${formatDay(bucket.end)}`}</th><td>${bucket[metric]}</td></tr>`).join('')
}

function selectPeriod(days) {
  dashboardDays = days
  document.querySelectorAll('.period-picker button').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.period) === days)))
  renderOverview()
  byId('dashboard-announcement').textContent = `Statistiques mises à jour sur ${days} jours : ${dashboardModel.current.accounts} inscriptions, ${dashboardModel.current.posts} publications et ${dashboardModel.current.interactions} interactions.`
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
  if (button.dataset.period) selectPeriod(Number(button.dataset.period))
  if (button.dataset.filterLink === 'suspended') {
    byId('account-filters').reset(); byId('account-status').value = 'suspended'; renderAccounts(); showView('accounts'); byId('account-status').focus()
  }
  if (button.dataset.filterLink === 'hidden') {
    byId('post-filters').reset(); byId('post-status').value = 'hidden'; renderPosts(); showView('posts'); byId('post-status').focus()
  }
  if (button.hasAttribute('data-app-preview')) announce('Cette maquette couvre uniquement l’administration. Les autres rubriques restent inchangées dans Spity.')
  if (button.dataset.action) openConfirmation(button.dataset.action, button.dataset.id, button)
})
byId('chart-metric').addEventListener('change', () => {
  renderChart()
  byId('dashboard-announcement').textContent = byId('chart-subtitle').textContent
})
window.addEventListener('resize', renderChart)
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
  history.unshift({ action, target, reason, icon: kind === 'account' ? 'lock' : 'eye-off', occurredAt: DEMO_DATE, date: `${formatDay(DEMO_DATE)} 2026 · simulation` })
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
  byId('chart-metric').value = 'interactions'
  selectPeriod(30)
  renderAll()
  announce('La démo a été réinitialisée. Aucune donnée réelle n’a été modifiée.')
})
renderAll()

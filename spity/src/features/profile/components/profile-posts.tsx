'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare, Plus } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { z } from 'zod'
import { Badge, Button, Input, Textarea } from '@/components/ui'
import type { PublicProfile } from '../lib/public-profile-repository'
import { gradeOptions } from '../lib/presentation'
import { createProfilePostSchema } from '../workspace-schemas'
import ProfileDialog from './profile-dialog'
import { apiData, failureMessage, FormError, ProfileSelect, uploadProfileImage } from './profile-fields'
import { ProfileEmpty } from './profile-presentation'

const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: 'Europe/Paris' }).format(new Date(date))
export function ProfilePosts({ profile, summary = false, basePath, onCompose, onAll }: { profile: PublicProfile; summary?: boolean; basePath: string; onCompose?: () => void; onAll?: () => void }) {
  const [selected, setSelected] = useState<PublicProfile['posts'][number] | null>(null)
  const [filter, setFilter] = useState('all')
  const posts = summary ? profile.posts.slice(0, 3) : profile.posts.filter((post) => filter === 'all' || (filter === 'photo' ? Boolean(post.imageUrl) : !post.imageUrl))
  return <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-balance text-xl font-bold">{summary ? 'Au fil des sessions' : 'Publications'}</h2>{summary ? onAll && <Button variant="secondary" onClick={onAll}>Tout voir</Button> : onCompose && <Button onClick={onCompose}><Plus size={16} aria-hidden="true" />Créer une publication</Button>}</div>
    {!summary && <div className="rounded-lg bg-card p-4 text-foreground"><ProfileSelect label="Filtrer les publications de cette page" options={{ all: 'Toutes', photo: 'Avec photo', text: 'Sans photo' }} value={filter} onChange={(event) => setFilter(event.target.value)} /><p className="mt-2 text-xs text-muted-foreground tabular-nums" role="status">{posts.length} affichée(s) sur cette page · {profile.postCount} au total</p></div>}
    {posts.length ? <div className="grid gap-4 sm:grid-cols-3">{posts.map((post) => <article key={post.id} className="overflow-hidden rounded-lg border border-border bg-card text-foreground"><div className="relative aspect-video bg-secondary sm:aspect-4/3">{post.imageUrl ? <Image fill sizes="(max-width: 640px) 100vw, 33vw" src={post.imageUrl} alt="" className="object-cover" unoptimized={post.imageUrl.startsWith('/api/')} /> : <div className="flex size-full items-center justify-center"><MessageSquare size={40} aria-hidden="true" /></div>}</div><div className="p-4"><div className="flex flex-wrap gap-2"><Badge variant="secondary">Session</Badge>{post.cotation && <Badge>{post.cotation}</Badge>}</div><h3 className="mt-3 line-clamp-2 wrap-anywhere text-balance font-semibold">{post.content.split('\n')[0]}</h3><time className="mt-2 block text-xs text-muted-foreground" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time><Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelected(post)}>Lire la publication</Button></div></article>)}</div> : <div className="rounded-lg bg-card p-5 text-foreground"><ProfileEmpty title={filter === 'all' ? 'La première page est encore blanche' : 'Aucune publication avec ce filtre'} action={filter !== 'all' ? <Button variant="secondary" onClick={() => setFilter('all')}>Afficher toutes les publications</Button> : onCompose ? <Button onClick={onCompose}>Créer une publication</Button> : <Link className="spity-btn spity-btn--secondary" href="/app">Explorer le feed</Link>}>{filter === 'all' ? 'Les moments de grimpe partagés par ce profil apparaîtront ici.' : 'Le filtre concerne uniquement la page affichée.'}</ProfileEmpty></div>}
    {!summary && profile.pageCount > 1 && <nav aria-label="Pages de publications" className="flex flex-wrap items-center justify-between gap-3 text-sm">{profile.page > 1 ? <Link className="spity-btn spity-btn--secondary" href={`${basePath}?section=posts&page=${profile.page - 1}#profile-sections`}>Précédente</Link> : <span />}<span className="tabular-nums">Page {profile.page} sur {profile.pageCount}</span>{profile.page < profile.pageCount && <Link className="spity-btn spity-btn--secondary" href={`${basePath}?section=posts&page=${profile.page + 1}#profile-sections`}>Suivante</Link>}</nav>}
    {selected && <ProfileDialog title="Un moment de grimpe" description={`${profile.displayName} · ${formatDate(selected.createdAt)}`} onClose={() => setSelected(null)}><div className="space-y-4 p-5">{selected.imageUrl && <Image width={600} height={450} src={selected.imageUrl} alt={`Photo de la publication de ${profile.displayName}`} className="max-h-96 w-full rounded-lg object-contain" unoptimized={selected.imageUrl.startsWith('/api/')} />}<p className="wrap-anywhere whitespace-pre-wrap text-pretty">{selected.content}</p>{selected.cotation && <Badge>{selected.cotation}</Badge>}<div className="flex justify-end"><Button variant="secondary" onClick={() => setSelected(null)}>Fermer</Button></div></div></ProfileDialog>}
  </section>
}

export function ProfilePostComposer({ onClose, onPublished }: { onClose: () => void; onPublished: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | undefined>()
  const uploaded = useRef<string | null>(null)
  const attached = useRef(false)
  useEffect(() => () => { if (uploaded.current && !attached.current) void fetch(`/api/media/${uploaded.current}`, { method: 'DELETE', keepalive: true }).catch(() => undefined) }, [])
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const parsed = createProfilePostSchema.safeParse({ content: data.get('content'), cotation: data.get('cotation') || null })
    setError(null); setContentError(undefined)
    if (!parsed.success) { setContentError(parsed.error.issues[0].message); return }
    setBusy(true)
    try {
      const file = data.get('file')
      if (file instanceof File && file.size > 0) { uploaded.current ??= (await uploadProfileImage(file)).id; parsed.data.mediaId = uploaded.current }
      z.object({ id: z.string().uuid() }).parse(await apiData(await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) })))
      attached.current = true
      onPublished()
    } catch (error) { setError(failureMessage(error)) } finally { setBusy(false) }
  }
  return <ProfileDialog title="Partager un moment de grimpe" description="Ta publication sera visible aux membres dans le feed et sur ton profil." onClose={onClose} busy={busy}><form noValidate onSubmit={publish}><fieldset disabled={busy} className="space-y-4 p-5 sm:p-6"><Textarea label="Ton récit" name="content" required maxLength={500} error={contentError} placeholder="Une sortie, une réussite ou une envie de grimper…" /><p className="text-xs text-muted-foreground">500 caractères maximum.</p><ProfileSelect name="cotation" label="Cotation, si utile" options={{ '': 'Sans cotation', ...Object.fromEntries(gradeOptions.map((grade) => [grade, grade])) }} /><Input name="file" label="Photo (facultative)" type="file" accept="image/jpeg,image/png,image/webp" onChange={() => { const previous = uploaded.current; uploaded.current = null; if (previous) void fetch(`/api/media/${previous}`, { method: 'DELETE' }).catch(() => undefined) }} /><p className="text-pretty text-xs text-muted-foreground">JPG, PNG ou WebP · 5 Mio maximum. Choisis une photo que tu as le droit de partager.</p><FormError message={error} /></fieldset><div className="flex flex-wrap justify-end gap-3 border-t border-border p-5"><Button variant="secondary" disabled={busy} onClick={onClose}>Annuler</Button><Button type="submit" isLoading={busy} loadingText="Publication…">Publier</Button></div></form></ProfileDialog>
}

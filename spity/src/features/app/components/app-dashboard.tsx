import Image from 'next/image'
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react'
import {
  Avatar,
  Badge,
  Card,
} from '@/components/ui'
import type { AuthUser } from '@/features/auth/schemas'
import { demoClimbingAssets } from '@/lib/brand-assets'
import AppShell from './app-shell'

type AppDashboardProps = {
  user: AuthUser
}

type FeedPost = {
  id: string
  author: string
  context: string
  content: string
  tag: string
  meta: string
  likes: number
  comments: number
  image?: string
  imageAlt?: string
}

const feedPosts: FeedPost[] = [
  {
    id: 'lina-session',
    author: 'Lina M.',
    context: 'Arkose Lyon · Bloc · 6b',
    content: 'Session bloc ce soir vers 19 h. Je cherche quelqu’un pour travailler les profils déversants et filmer quelques essais.',
    tag: 'Recherche partenaire',
    meta: 'Il y a 18 min',
    likes: 24,
    comments: 6,
    image: demoClimbingAssets.indoorWall,
    imageAlt: 'Mur d’escalade en salle',
  },
  {
    id: 'club-curis',
    author: 'Club Alpin Lyon',
    context: 'Curis-au-Mont-d’Or · Sortie club',
    content: 'Sortie falaise samedi matin. Groupe limité à 8 personnes, niveau conseillé 5c/6a, encadrement bénévole.',
    tag: 'Événement',
    meta: 'Il y a 1 h',
    likes: 48,
    comments: 12,
    image: demoClimbingAssets.verdonRoute,
    imageAlt: 'Grimpeur sur une voie en falaise',
  },
  {
    id: 'nassim-session',
    author: 'Nassim B.',
    context: 'MROC Villeurbanne · Voie · 6a+',
    content: 'Bonne session voie hier, les nouvelles ouvertures en dalle sont propres. Disponible demain midi pour assurer.',
    tag: 'Session',
    meta: 'Hier',
    likes: 16,
    comments: 3,
  },
  {
    id: 'chloe-topo',
    author: 'Chloé R.',
    context: 'Fontainebleau · Bloc',
    content: 'Le secteur est sec ce matin. J’ai ajouté une bêta sur les deux premiers mouvements du rouge à droite.',
    tag: 'Topo',
    meta: 'Hier',
    likes: 31,
    comments: 9,
    image: demoClimbingAssets.fontainebleauBoulders,
    imageAlt: 'Blocs de grès à Fontainebleau',
  },
]

export default function AppDashboard({ user }: AppDashboardProps) {
  return (
    <AppShell activeItem="feed" user={user}>
      <section aria-labelledby="feed-heading" className="mx-auto max-w-2xl space-y-4">
        <header className="px-1 pb-2 pt-1">
          <p className="text-sm font-semibold text-primary">Pour vous</p>
          <h1 id="feed-heading" className="mt-1 text-3xl font-bold text-white sm:text-4xl">
            Fil d’actualité
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-sm text-white/75">
            Les sorties, idées et infos utiles partagées par la communauté escalade.
          </p>
        </header>

        <div className="space-y-4">
          {feedPosts.map((post) => (
            <article key={post.id} aria-labelledby={`${post.id}-author`}>
              <Card hover={false} className="overflow-hidden rounded-xl border-border/80 bg-card">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar
                    alt={`Avatar de ${post.author}`}
                    className="bg-secondary text-secondary-foreground"
                    fallback={post.author}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p id={`${post.id}-author`} className="truncate text-sm font-semibold text-foreground">
                      {post.author}
                    </p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" aria-hidden="true" />
                      {post.context}
                    </p>
                  </div>
                  <button
                    aria-label={`Plus d’options pour la publication de ${post.author}`}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    type="button"
                  >
                    <MoreHorizontal className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="px-4 pb-4">
                  <p className="text-pretty text-sm text-foreground sm:text-base">{post.content}</p>
                  <Badge className="mt-3" variant="secondary">{post.tag}</Badge>
                </div>

                {post.image && (
                  <div className="relative aspect-square bg-muted">
                    <Image
                      alt={post.imageAlt ?? ''}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      src={post.image}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between px-3 pt-3">
                  <div className="flex items-center">
                    <button
                      aria-label={`Aimer la publication de ${post.author}`}
                      className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                      type="button"
                    >
                      <Heart className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`Commenter la publication de ${post.author}`}
                      className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                      type="button"
                    >
                      <MessageCircle className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`Partager la publication de ${post.author}`}
                      className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                      type="button"
                    >
                      <Send className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    aria-label={`Enregistrer la publication de ${post.author}`}
                    className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                    type="button"
                  >
                    <Bookmark className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <p className="text-sm font-semibold text-foreground tabular-nums">{post.likes} J’aime</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {post.comments} commentaires
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{post.meta}</p>
                </div>
              </Card>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

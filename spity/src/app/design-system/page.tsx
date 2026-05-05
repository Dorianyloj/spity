import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Avatar,
  Badge,
  GradeBadge,
  Tag,
  StatCard,
  StoryAvatar,
  Spinner,
  Skeleton,
} from '@/components/ui'
import { Heart, MessageCircle, Share2, TrendingUp, Mountain, Award } from 'lucide-react'
import BrandMark from '@/components/brand/brand-mark'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'

export default function DesignSystemPage() {
  return (
    <div
      className="min-h-screen bg-background bg-fixed bg-cover bg-center p-8"
      style={{ backgroundImage: makePanelBackground(brandAssets.cragClose) }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <BrandMark className="mx-auto bg-white/6 shadow-xl shadow-black/20 ring-1 ring-white/12" priority size={64} tone="dark" />
          <h1 className="text-4xl font-bold spity-gradient-coral bg-clip-text text-transparent">
            Spity Design System
          </h1>
          <p className="text-muted-foreground">
            Composants UI réutilisables pour la communauté escalade
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Boutons</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primaire</Button>
                <Button variant="secondary">Secondaire</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="primary" isLoading>
                  Chargement
                </Button>
                <Button variant="primary" disabled>
                  Désactivé
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="primary" size="sm">
                  Petit
                </Button>
                <Button variant="primary" size="md">
                  Moyen
                </Button>
                <Button variant="primary" size="lg">
                  Grand
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Cartes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Titre de carte</CardTitle>
                <CardDescription>
                  Description courte de la carte avec des détails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Contenu de la carte avec du texte.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
                <Button variant="ghost" size="sm">
                  Annuler
                </Button>
              </CardFooter>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Carte sans hover</CardTitle>
                <CardDescription>Cette carte ne s&apos;anime pas au survol</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Utile pour les cartes interactives avec des éléments cliquables à l&apos;intérieur.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Formulaires</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Input label="Email" type="email" placeholder="exemple@spity.com" />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Avec erreur"
                error="Ce champ est requis"
                placeholder="Champ invalide"
              />
              <Textarea
                label="Bio"
                placeholder="Parlez-nous de vous..."
                rows={4}
              />
            </CardContent>
          </Card>
        </section>

        {/* Avatars */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Avatars</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar size="sm" />
                <Avatar size="md" fallback="JD" />
                <Avatar size="lg" fallback="MR" ring />
                <Avatar
                  size="xl"
                  src={brandAssets.logoTransparent}
                  alt="Avatar exemple"
                  ring
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Badges</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primaire</Badge>
                <Badge variant="secondary">Secondaire</Badge>
                <Badge variant="success">Succès</Badge>
                <Badge variant="warning">Attention</Badge>
                <Badge variant="destructive">Erreur</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Grade Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Badges de Cotation</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <GradeBadge grade="3a" />
                <GradeBadge grade="4c" />
                <GradeBadge grade="5b" />
                <GradeBadge grade="6a+" />
                <GradeBadge grade="7b" />
                <GradeBadge grade="8a" />
                <GradeBadge grade="9a" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tags */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Tags de Lieu</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <Tag variant="gym">Salle d&apos;escalade</Tag>
                <Tag variant="outdoor">Site naturel</Tag>
                <Tag variant="club">Club FFME</Tag>
                <Tag variant="gym" icon={false}>
                  Sans icône
                </Tag>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stat Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard value="247" label="Ascensions" icon={Mountain} />
            <StatCard
              value="32"
              label="Voies enchaînées"
              icon={TrendingUp}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              value="128"
              label="Points Karma"
              icon={Award}
              trend={{ value: 5, isPositive: false }}
            />
          </div>
        </section>

        {/* Story Avatars */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Stories</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 overflow-x-auto spity-no-scrollbar pb-2">
                <StoryAvatar username="Jean" fallback="J" seen={false} />
                <StoryAvatar username="Marie" fallback="M" seen={false} />
                <StoryAvatar username="Alex" fallback="A" seen={true} />
                <StoryAvatar
                  username="Sophie"
                  src={brandAssets.logoTransparent}
                  seen={false}
                />
                <StoryAvatar username="Thomas" fallback="T" seen={true} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Loading States */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">États de Chargement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Spinners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Spinner size="sm" label="Petit" />
                <Spinner size="md" label="Moyen" />
                <Spinner size="lg" label="Grand" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skeletons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="rect" className="w-full h-32" />
                <div className="flex gap-2">
                  <Skeleton variant="circle" className="w-12 h-12" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-full" />
                    <Skeleton variant="text" className="w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Post Card Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Exemple : Carte de Post</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar
                  src={brandAssets.logoTransparent}
                  alt="Pierre Durand"
                  size="md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Pierre Durand</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Il y a 2h</span>
                    <span>•</span>
                    <Tag variant="outdoor" icon>
                      Fontainebleau
                    </Tag>
                  </div>
                </div>
                <GradeBadge grade="7a" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Superbe session aujourd&apos;hui ! Enfin enchaîné cette ligne qui me
                résistait depuis des semaines 🧗‍♂️
              </p>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center text-muted-foreground">
                [Image du post]
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                <Heart size={18} />
                42
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle size={18} />
                12
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 size={18} />
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Palette de Couleurs</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 rounded-lg bg-primary"></div>
                  <p className="text-xs font-medium">Corail (Primary)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-lg bg-secondary"></div>
                  <p className="text-xs font-medium">Slate (Secondary)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-lg bg-background border"></div>
                  <p className="text-xs font-medium">Crème Pierre (Background)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-lg" style={{ background: 'var(--spity-granite)' }}></div>
                  <p className="text-xs font-medium">Granite (Muted)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

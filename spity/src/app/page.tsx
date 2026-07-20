'use client'

import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Camera,
  Compass,
  MapPin,
  Mountain,
  Route,
  ShieldCheck,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, type ReactNode } from 'react'
import BrandMark from '@/components/brand/brand-mark'
import { brandAssets } from '@/lib/brand-assets'

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
}

type Feature = {
  eyebrow: string
  title: string
  description: string
  icon: typeof Users
}

type Adventure = {
  number: string
  title: string
  description: string
  icon: typeof Mountain
  accent: string
}

type FeedItem = {
  title: string
  meta: string
  tag: string
}

const features: Feature[] = [
  {
    eyebrow: 'Matching',
    title: 'Trouver le bon partenaire',
    description: 'Discipline, niveau, lieu et disponibilités pour éviter les groupes désordonnés.',
    icon: Users,
  },
  {
    eyebrow: 'Topos',
    title: 'Lire le terrain en direct',
    description: 'Cotations par consensus, état des voies, alertes sécurité et retours de session.',
    icon: Route,
  },
  {
    eyebrow: 'Agenda',
    title: 'Rejoindre les sorties locales',
    description: 'Clubs, contests, initiations et coaching visibles au même endroit.',
    icon: CalendarDays,
  },
]

const adventures: Adventure[] = [
  {
    number: '01',
    title: 'Sessions',
    description: 'Organisez une sortie bloc, voie ou falaise avec des grimpeurs compatibles.',
    icon: Users,
    accent: 'from-[#8bb957] to-[#5f8f50]',
  },
  {
    number: '02',
    title: 'Spots',
    description: 'Explorez salles, falaises et clubs avec des filtres utiles pour la pratique.',
    icon: MapPin,
    accent: 'from-[#4f7fb5] to-[#264653]',
  },
  {
    number: '03',
    title: 'Topos',
    description: 'Contribuez aux voies, signalez les infos critiques et gagnez du karma.',
    icon: Mountain,
    accent: 'from-[#5a9a6f] to-[#2f5f42]',
  },
]

const feedItems: FeedItem[] = [
  {
    title: 'Sortie Curis-au-Mont-d’Or',
    meta: 'Voie · 6a conseillé · 8 places',
    tag: 'Club',
  },
  {
    title: 'Bêta vidéo sur le 7a rouge',
    meta: 'Arkose Lyon · Bloc · il y a 18 min',
    tag: 'Topo',
  },
  {
    title: 'Partenaire dispo ce soir',
    meta: 'MROC · voie · assurage ok',
    tag: 'Match',
  },
]

function AnimatedSection({ children, className = '', delay = 0, id }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#173236] text-white">
      <section className="relative flex min-h-[92svh] flex-col overflow-hidden">
        <Image
          src={brandAssets.heroSunset}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(23, 50, 54, 0.08) 0%, rgba(23, 50, 54, 0.62) 58%, #173236 100%), linear-gradient(110deg, rgba(23, 50, 54, 0.78) 0%, rgba(47, 111, 78, 0.2) 48%, rgba(239, 246, 239, 0.16) 100%)',
          }}
          aria-hidden="true"
        />
        <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 text-sm text-white/[0.78] md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Accueil Spity">
            <BrandMark className="bg-white/6 shadow-lg shadow-black/20 ring-1 ring-white/12" priority size={42} tone="dark" />
            <span className="text-lg font-bold text-white">Spity</span>
          </Link>
          <div className="hidden items-center gap-10 md:flex">
            <a href="#activites" className="transition-colors hover:text-white">
              Activités
            </a>
            <a href="#galerie" className="transition-colors hover:text-white">
              Topos
            </a>
            <a href="#communaute" className="transition-colors hover:text-white">
              Communauté
            </a>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-white/30 px-4 py-2 font-semibold text-white transition-colors hover:bg-white hover:text-[#173236]"
          >
            Connexion
          </Link>
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-16 pt-8 md:px-8">
          <div className="max-w-4xl">
            <motion.p
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/10 px-4 py-2 text-sm font-semibold text-white/[0.86] backdrop-blur"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="h-2 w-2 rounded-full bg-[#8bb957]" />
              Réseau social pour grimpeurs, clubs et salles
            </motion.p>

            <motion.h1
              className="max-w-3xl text-6xl font-black leading-[0.9] text-white drop-shadow-2xl sm:text-7xl md:text-8xl lg:text-9xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              SPITY
              <span className="ml-2 align-top text-4xl text-[#8bb957] md:text-6xl">*</span>
            </motion.h1>

            <motion.p
              className="mt-7 max-w-2xl text-base leading-8 text-white/[0.82] md:text-lg"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Une expérience immersive pour trouver des partenaires, suivre les topos vivants, découvrir
              les lieux proches et rejoindre les événements clubs sans changer d&apos;application.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-[#173236] transition-transform hover:-translate-y-0.5"
              >
                Rejoindre Spity
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.28] bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition-colors hover:bg-white/[0.18]"
              >
                Voir la démo
                <Compass size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-px px-5 pb-8 md:grid-cols-4 md:px-8">
          {[
            ['300K+', 'licenciés FFME'],
            ['1200+', 'clubs affiliés'],
            ['800+', 'salles indoor'],
            ['1 app', 'pour tout connecter'],
          ].map(([value, label]) => (
            <div key={label} className="border-t border-white/[0.18] bg-[#173236]/[0.28] py-4 backdrop-blur-sm md:px-5">
              <p className="text-2xl font-black text-[#8bb957]">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase text-white/[0.62]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <AnimatedSection className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8 lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase text-[#8bb957]">01 / Expérience</p>
          <h2 className="mt-4 max-w-md text-4xl font-black leading-tight md:text-5xl">
            Choisir sa prochaine session devient simple.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article key={feature.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-[#8bb957] text-[#173236]">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase text-[#8bb957]">{feature.eyebrow}</p>
                <h3 className="mt-2 text-xl font-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/[0.68]">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection id="activites" className="bg-[#111a55] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-[#8bb957]">02 / Activités</p>
              <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-5xl">
                Les blocs clés du MVP en premier plan.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/[0.66]">
              Le style reprend le rythme aventure de la référence, mais l&apos;information reste orientée démo RNCP :
              trouver, organiser, contribuer.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {adventures.map((adventure) => {
              const Icon = adventure.icon

              return (
                <article
                  key={adventure.title}
                  className="group relative min-h-[330px] overflow-hidden rounded-lg bg-[#463fc0] p-6 shadow-2xl shadow-black/20"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${adventure.accent}`} />
                  <Image
                    src={
                      adventure.number === '01'
                        ? brandAssets.indoor
                        : adventure.number === '02'
                          ? brandAssets.crag
                          : brandAssets.trad
                    }
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-center opacity-[0.18] mix-blend-luminosity transition-opacity group-hover:opacity-[0.28]"
                  />
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.08]" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <p className="font-mono text-lg font-bold text-white">
                        {adventure.number}
                        <span className="ml-1 text-xs text-[#8bb957]">/ Spity</span>
                      </p>
                      <div className="mt-10 flex h-24 w-24 items-center justify-center rounded-lg bg-[#173236]/[0.35] text-[#8bb957] transition-transform group-hover:scale-105">
                        <Icon size={44} aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{adventure.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/[0.72]">{adventure.description}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="galerie"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:py-24"
      >
        <div>
          <p className="text-sm font-bold uppercase text-[#8bb957]">03 / Topos vivants</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Une galerie utile, pas juste belle.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/[0.68]">
            Photos de secteur, bêta vidéo, niveau, matériel, état des voies et signalements deviennent
            des informations sociales exploitables pour préparer la session.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-lg border border-white/10 bg-[#27494b] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[360px] overflow-hidden" aria-hidden="true">
            <Image
              src={brandAssets.crag}
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(23, 50, 54, 0.08) 0%, rgba(23, 50, 54, 0.58) 100%), linear-gradient(110deg, rgba(23, 50, 54, 0.56), rgba(223, 238, 207, 0.18))',
              }}
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#8bb957]">Falaise</p>
                <h3 className="mt-2 text-3xl font-black">Curis Solitude</h3>
              </div>
              <p className="font-mono text-sm text-white/[0.58]">2026</p>
            </div>

            <div className="space-y-4">
              {feedItems.map((item) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-bold">{item.title}</h4>
                    <span className="rounded-full bg-[#8bb957] px-2 py-1 text-xs font-bold text-[#173236]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{item.meta}</p>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#5f8f50] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#8bb957] hover:text-[#173236]"
            >
              Explorer les topos
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="communaute" className="bg-[#080d38] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-3 md:px-8">
          {[
            {
              title: 'Sécurité visible',
              description: 'Profils, niveau, matériel et alertes équipement rendent les sorties plus lisibles.',
              icon: ShieldCheck,
            },
            {
              title: 'Signal local',
              description: 'Le fil remonte les partenaires, lieux et événements qui comptent autour de vous.',
              icon: Bell,
            },
            {
              title: 'Partage contextualisé',
              description: 'Chaque post peut porter un lieu, une cotation, une discipline et un média utile.',
              icon: Camera,
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <Icon className="text-[#8bb957]" size={26} aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/[0.64]">{item.description}</p>
              </article>
            )
          })}
        </div>
      </AnimatedSection>

      <footer className="border-t border-white/10 bg-[#173236] px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/[0.55] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Spity. Plateforme sociale pour la communauté escalade.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="hover:text-white">
              Inscription
            </Link>
            <Link href="/login" className="hover:text-white">
              Connexion
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

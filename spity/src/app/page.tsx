'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Button from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import {
  Users,
  MapPin,
  Calendar,
  Mountain,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Share2,
  Shield
} from 'lucide-react'
import Link from 'next/link'

// Composant pour animer les sections au scroll
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour animer les enfants avec des délais progressifs
function StaggeredChildren({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggeredItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
      }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Matching Intelligent',
      description: 'Trouvez des partenaires adaptés à votre niveau et discipline en quelques secondes'
    },
    {
      icon: Mountain,
      title: 'Topos Collaboratifs',
      description: 'Accédez à des informations à jour sur les falaises avec cotations réelles et alertes sécurité'
    },
    {
      icon: Calendar,
      title: 'Événements Clubs',
      description: 'Découvrez sorties, contests et initiations organisés par les clubs FFME près de chez vous'
    },
    {
      icon: MapPin,
      title: 'Répertoire Géolocalisé',
      description: 'Explorez salles, falaises et clubs sur une carte interactive avec filtres intelligents'
    },
    {
      icon: Share2,
      title: 'Partage Contextualisé',
      description: 'Partagez vos exploits avec cotation, lieu et matériel pour inspirer la communauté'
    },
    {
      icon: Shield,
      title: 'Communauté Sécurisée',
      description: 'Profils vérifiés, signalements équipement et modération active pour grimper en toute confiance'
    }
  ]

  const stats = [
    { value: '300K+', label: 'Licenciés FFME' },
    { value: '1200+', label: 'Clubs affiliés' },
    { value: '800+', label: 'Salles indoor' },
    { value: '1000+', label: 'Falaises répertoriées' }
  ]

  const benefits = [
    {
      title: 'Pour Grimpeurs',
      items: [
        'Une seule app pour salles, falaises et clubs',
        'Matching 20x plus rapide qu\'avant',
        'Topos vivants avec état temps réel',
        'Événements à portée de main'
      ]
    },
    {
      title: 'Pour Clubs FFME',
      items: [
        'Visibilité maximale auprès des grimpeurs locaux',
        '+35% d\'inscriptions aux événements',
        'Dashboard complet et gratuit',
        'Recrutement facilité de nouveaux membres'
      ]
    },
    {
      title: 'Pour Salles',
      items: [
        'Présence sur l\'annuaire géolocalisé',
        'Recommandations algorithmiques',
        'Planning et tarifs centralisés',
        'Acquisition de nouveaux clients'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-deep via-slate-light to-slate-deep spity-texture">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--spity-coral)_0%,_transparent_50%)] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              <span className="text-sm font-medium text-white">Nouvelle ère de l&apos;escalade sociale</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold --accent-foreground max-w-4xl mx-auto leading-tight drop-shadow-lg"
            >
              Toute la communauté escalade
              <span className="block mt-2 text-coral">
                en une seule app
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              Matching intelligent, topos collaboratifs, événements clubs et partage social.
              Spity réunit tout ce dont vous avez besoin pour grimper.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                variant="primary"
                size="lg"
                className="spity-shadow-coral group"
              >
                Rejoindre Spity
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <Smartphone size={20} />
                Voir la démo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-coral">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">Le problème</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              5 apps différentes pour une seule passion
            </h2>
            <p className="text-xl text-[#4a4a4a]">
              Facebook pour trouver des partenaires, Camptocamp pour les topos, Instagram pour partager,
              des sites web disparates pour les salles... et des groupes WhatsApp pour tout coordonner.
            </p>
          </div>
        </AnimatedSection>

        <StaggeredChildren className="grid md:grid-cols-3 gap-6">
          <StaggeredItem>
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="text-destructive" size={24} />
                </div>
                <h3 className="font-bold text-[#1a1a1a] mb-2">Matching inefficace</h3>
                <p className="text-sm text-[#4a4a4a]">
                  Groupes Facebook chaotiques sans filtrage par niveau ou discipline
                </p>
              </CardContent>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Mountain className="text-destructive" size={24} />
                </div>
                <h3 className="font-bold text-[#1a1a1a] mb-2">Topos obsolètes</h3>
                <p className="text-sm text-[#4a4a4a]">
                  Guides datés de 2015 sans info temps réel sur l&apos;état des voies
                </p>
              </CardContent>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-destructive" size={24} />
                </div>
                <h3 className="font-bold text-[#1a1a1a] mb-2">Événements éparpillés</h3>
                <p className="text-sm text-[#4a4a4a]">
                  Sites clubs obsolètes, événements perdus entre Facebook et emails
                </p>
              </CardContent>
            </Card>
          </StaggeredItem>
        </StaggeredChildren>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">La solution</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                Tout ce dont vous avez besoin, au même endroit
              </h2>
              <p className="text-xl text-[#4a4a4a]">
                Spity centralise salles, falaises, clubs et communauté dans une expérience fluide et moderne.
              </p>
            </div>
          </AnimatedSection>

          <StaggeredChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <StaggeredItem key={index}>
                  <Card className="group hover:border-primary/50 transition-all h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl spity-gradient-coral flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="text-white" size={24} />
                      </div>
                      <CardTitle className="text-xl text-[#1a1a1a]">{feature.title}</CardTitle>
                      <CardDescription className="text-base text-[#4a4a4a]">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </StaggeredItem>
              )
            })}
          </StaggeredChildren>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">Bénéfices</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                Conçu pour toute la communauté
              </h2>
              <p className="text-xl text-[#4a4a4a]">
                Que vous soyez grimpeur, club FFME ou salle d&apos;escalade, Spity vous apporte de la valeur.
              </p>
            </div>
          </AnimatedSection>

          <StaggeredChildren className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <StaggeredItem key={index}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl mb-4 text-[#1a1a1a]">{benefit.title}</CardTitle>
                    <div className="space-y-3">
                      {benefit.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="text-success flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-sm text-[#4a4a4a]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="primary" className="mb-4">Comment ça marche</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                Simple, rapide, efficace
              </h2>
            </div>
          </AnimatedSection>

          <StaggeredChildren className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Créez votre profil', desc: 'Renseignez vos disciplines, niveaux et matériel' },
              { step: '02', title: 'Explorez', desc: 'Découvrez salles, falaises et clubs près de vous' },
              { step: '03', title: 'Connectez', desc: 'Trouvez des partenaires et rejoignez des événements' },
              { step: '04', title: 'Partagez', desc: 'Postez vos sessions et progressez ensemble' }
            ].map((item, index) => (
              <StaggeredItem key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full spity-gradient-coral text-white font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1a1a1a]">{item.title}</h3>
                <p className="text-sm text-[#4a4a4a]">{item.desc}</p>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 spity-gradient-coral opacity-5" />
              <CardContent className="relative py-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                  Prêt à rejoindre la communauté ?
                </h2>
                <p className="text-xl text-[#4a4a4a] mb-8 max-w-2xl mx-auto">
                  Rejoignez les milliers de grimpeurs qui utilisent déjà Spity pour améliorer leur pratique.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="spity-shadow-coral group"
                  >
                    Créer mon compte gratuitement
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                  >
                    En savoir plus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#1a1a1a]">Spity</h3>
              <p className="text-sm text-[#4a4a4a]">
                La plateforme sociale complète pour la communauté d&apos;escalade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#1a1a1a]">Produit</h4>
              <ul className="space-y-2 text-sm text-[#4a4a4a]">
                <li><Link href="#" className="hover:text-primary transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#1a1a1a]">Communauté</h4>
              <ul className="space-y-2 text-sm text-[#4a4a4a]">
                <li><Link href="#" className="hover:text-primary transition-colors">Clubs</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Salles</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#1a1a1a]">Légal</h4>
              <ul className="space-y-2 text-sm text-[#4a4a4a]">
                <li><Link href="#" className="hover:text-primary transition-colors">CGU</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#4a4a4a]">
              © 2026 Spity. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">FFME</Badge>
              <Badge variant="secondary">RGPD Compliant</Badge>
              <Badge variant="secondary">Made in France</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

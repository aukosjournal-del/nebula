import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const achievements = [
  {
    slug: 'first-review',
    title: 'Premier Pas',
    description: 'Complète ta première révision',
    iconName: 'Star',
    rarity: 'common',
    condition: { type: 'first-review' },
  },
  {
    slug: 'streak-3',
    title: 'En Rythme',
    description: "3 jours consécutifs d'apprentissage",
    iconName: 'Flame',
    rarity: 'common',
    condition: { type: 'streak', threshold: 3 },
  },
  {
    slug: 'streak-7',
    title: 'Semaine de Feu',
    description: "7 jours consécutifs d'apprentissage",
    iconName: 'Flame',
    rarity: 'rare',
    condition: { type: 'streak', threshold: 7 },
  },
  {
    slug: 'streak-30',
    title: 'Mois Légendaire',
    description: "30 jours consécutifs d'apprentissage",
    iconName: 'Trophy',
    rarity: 'legendary',
    condition: { type: 'streak', threshold: 30 },
  },
  {
    slug: 'master-5',
    title: 'Maître Débutant',
    description: '5 cartes maîtrisées (interval > 30 jours)',
    iconName: 'Award',
    rarity: 'rare',
    condition: { type: 'master-cards', threshold: 5 },
  },
  {
    slug: 'master-25',
    title: 'Érudit',
    description: '25 cartes maîtrisées',
    iconName: 'BrainCircuit',
    rarity: 'epic',
    condition: { type: 'master-cards', threshold: 25 },
  },
  {
    slug: 'nebula-scholar',
    title: 'Savant Nebula',
    description: 'Toutes les cartes maîtrisées',
    iconName: 'Sparkles',
    rarity: 'legendary',
    condition: { type: 'master-cards', threshold: 27 },
  },
]

async function main() {
  console.log('Seeding achievements...')
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    })
    console.log(`  + ${a.title}`)
  }
  console.log('Achievements seeded!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

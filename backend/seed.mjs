import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const coursesData = [
  {
    slug: 'physique-quantique',
    title: 'Physique Quantique',
    iconName: 'Zap',
    color: '#22d3ee',
    order: 0,
    lessons: [
      {
        title: 'Les Particules',
        order: 0,
        content: 'Exploration des particules subatomiques et de leurs propriétés quantiques.',
        questions: [
          { prompt: 'Quel principe régit l\'incertitude des particules ?', answers: ['Principe d\'Incertitude', 'Effet Tunnel', 'Intrication Quantique'], correct: 0 },
          { prompt: 'Quelle est la nature duale de la lumière ?', answers: ['Onde et Corpuscule', 'Énergie pure', 'Matière noire'], correct: 0 },
          { prompt: 'Qu\'est-ce que la superposition quantique ?', answers: ['États simultanés', 'Vitesse de la lumière', 'Force gravitationnelle'], correct: 0 },
        ],
      },
      {
        title: 'Le Chat de Schrödinger',
        order: 1,
        content: 'La célèbre expérience de pensée qui illustre les paradoxes de la mécanique quantique.',
        questions: [
          { prompt: 'Que démontre l\'expérience du chat de Schrödinger ?', answers: ['Superposition quantique', 'Gravité newtonienne', 'Relativité restreinte'], correct: 0 },
          { prompt: 'Qui a formulé cette expérience de pensée ?', answers: ['Erwin Schrödinger', 'Niels Bohr', 'Werner Heisenberg'], correct: 0 },
          { prompt: 'Quelle interprétation résout ce paradoxe ?', answers: ['Interprétation de Copenhague', 'Théorie des cordes', 'Mécanique classique'], correct: 0 },
        ],
      },
      {
        title: 'L\'Intrication',
        order: 2,
        content: 'Comment deux particules peuvent-elles être instantanément connectées, peu importe leur distance ?',
        questions: [
          { prompt: 'Qu\'est-ce que l\'intrication quantique ?', answers: ['Corrélation non-locale', 'Force magnétique', 'Champ électrique'], correct: 0 },
          { prompt: 'Comment Einstein appelait-il l\'intrication ?', answers: ['Action fantôme à distance', 'Relativité générale', 'Équivalence masse-énergie'], correct: 0 },
          { prompt: 'Quelle application utilise l\'intrication ?', answers: ['Cryptographie quantique', 'Intelligence artificielle', 'Énergie solaire'], correct: 0 },
        ],
      },
    ],
  },
  {
    slug: 'arts-visuels',
    title: 'Arts Visuels',
    iconName: 'Sparkles',
    color: '#f87171',
    order: 1,
    lessons: [
      {
        title: 'Théorie des Couleurs',
        order: 0,
        content: 'Comprendre le cercle chromatique et les harmonies de couleurs.',
        questions: [
          { prompt: 'Quelles sont les couleurs primaires ?', answers: ['Rouge, Jaune, Bleu', 'Vert, Orange, Violet', 'Noir, Blanc, Gris'], correct: 0 },
          { prompt: 'Qu\'est-ce que la complémentarité des couleurs ?', answers: ['Couleurs opposées sur le cercle', 'Nuances du même ton', 'Dégradé linéaire'], correct: 0 },
          { prompt: 'Quel outil représente les relations entre couleurs ?', answers: ['Cercle chromatique', 'Palette de teintes', 'Spectre lumineux'], correct: 0 },
        ],
      },
      {
        title: 'Composition Pixar',
        order: 1,
        content: 'Les secrets de la règle des tiers et des compositions visuelles percutantes.',
        questions: [
          { prompt: 'Qu\'est-ce que la règle des tiers ?', answers: ['Division en 9 zones', 'Symétrie parfaite', 'Point central unique'], correct: 0 },
          { prompt: 'Quel ratio est souvent utilisé pour les compositions ?', answers: ['Nombre d\'or', 'Pi', 'Racine de 2'], correct: 0 },
          { prompt: 'Que sont les lignes directrices ?', answers: ['Lignes guidant le regard', 'Bordures de cadre', 'Textures de fond'], correct: 0 },
        ],
      },
      {
        title: 'Lumière Liquide',
        order: 2,
        content: 'Maîtriser la lumière et les ombres pour donner vie à vos œuvres.',
        questions: [
          { prompt: 'Qu\'est-ce que le clair-obscur ?', answers: ['Contraste lumière/ombre', 'Technique aquarelle', 'Style impressionniste'], correct: 0 },
          { prompt: 'Quelle est la source de lumière principale ?', answers: ['Key light', 'Fill light', 'Rim light'], correct: 0 },
          { prompt: 'Comment simuler la profondeur avec la lumière ?', answers: ['Dégradé atmosphérique', 'Couleur uniforme', 'Texture répétitive'], correct: 0 },
        ],
      },
    ],
  },
  {
    slug: 'philosophie',
    title: 'Philosophie',
    iconName: 'BrainCircuit',
    color: '#a78bfa',
    order: 2,
    lessons: [
      {
        title: 'L\'Allégorie de la Caverne',
        order: 0,
        content: 'Platon et la distinction entre le monde sensible et le monde des idées.',
        questions: [
          { prompt: 'Qui a écrit l\'allégorie de la caverne ?', answers: ['Platon', 'Aristote', 'Socrate'], correct: 0 },
          { prompt: 'Que représentent les ombres dans la caverne ?', answers: ['Les apparences trompeuses', 'La vraie connaissance', 'Le monde idéal'], correct: 0 },
          { prompt: 'Dans quel ouvrage trouve-t-on cette allégorie ?', answers: ['La République', 'L\'Éthique', 'La Métaphysique'], correct: 0 },
        ],
      },
      {
        title: 'Le Stoïcisme',
        order: 1,
        content: 'La sagesse stoïcienne : distinguer ce qui dépend de nous de ce qui n\'en dépend pas.',
        questions: [
          { prompt: 'Quel est le principe central du stoïcisme ?', answers: ['Distinguer ce qui dépend de nous', 'Rechercher le plaisir', 'Fuir la réalité'], correct: 0 },
          { prompt: 'Qui était Épictète ?', answers: ['Philosophe stoïcien', 'Épicurien', 'Sophiste'], correct: 0 },
          { prompt: 'Qu\'appelle-t-on la dichotomie du contrôle ?', answers: ['Ce qui dépend/ne dépend pas de nous', 'Bien et mal', 'Corps et esprit'], correct: 0 },
        ],
      },
      {
        title: 'L\'Éveil',
        order: 2,
        content: 'Concepts de conscience et d\'éveil dans les traditions philosophiques orientales et occidentales.',
        questions: [
          { prompt: 'Qu\'est-ce que le satori dans le Zen ?', answers: ['Éveil soudain', 'Méditation profonde', 'Pratique rituelle'], correct: 0 },
          { prompt: 'Comment Descartes définit-il la conscience ?', answers: ['Cogito ergo sum', 'Tabula rasa', 'Être ou ne pas être'], correct: 0 },
          { prompt: 'Que signifie l\'éveil dans le bouddhisme ?', answers: ['Libération du cycle souffrance', 'Renoncement aux biens', 'Pratique ascétique'], correct: 0 },
        ],
      },
    ],
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()

  for (const courseData of coursesData) {
    const { lessons, ...courseInfo } = courseData
    const course = await prisma.course.create({ data: courseInfo })

    for (const lessonData of lessons) {
      const { questions, ...lessonInfo } = lessonData
      const lesson = await prisma.lesson.create({
        data: { ...lessonInfo, courseId: course.id },
      })

      for (let qi = 0; qi < questions.length; qi++) {
        const questionData = questions[qi]
        const question = await prisma.question.create({
          data: { lessonId: lesson.id, prompt: questionData.prompt, order: qi },
        })

        for (let ai = 0; ai < questionData.answers.length; ai++) {
          await prisma.answer.create({
            data: {
              questionId: question.id,
              text: questionData.answers[ai],
              isCorrect: ai === questionData.correct,
            },
          })
        }
      }
    }

    console.log(`  ✓ ${courseInfo.title} (${lessons.length} leçons)`)
  }

  console.log('✅ Seed terminé !')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

export interface CardState {
  easeFactor: number
  interval: number
  repetitions: number
}

export interface SM2Result extends CardState {
  dueDate: Date
}

export function sm2(card: CardState, quality: number): SM2Result {
  let { easeFactor, interval, repetitions } = card

  if (quality >= 3) {
    interval = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    interval = 1
    repetitions = 0
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return { easeFactor, interval, repetitions, dueDate }
}

export const QUALITY_LABELS: Record<number, { emoji: string; label: string; color: string }> = {
  0: { emoji: '😵', label: 'Oublié', color: 'text-red-400' },
  2: { emoji: '😕', label: 'Difficile', color: 'text-orange-400' },
  3: { emoji: '🤔', label: 'Correct', color: 'text-yellow-400' },
  4: { emoji: '😊', label: 'Bien', color: 'text-green-400' },
  5: { emoji: '🔥', label: 'Parfait', color: 'text-cyan-400' },
}

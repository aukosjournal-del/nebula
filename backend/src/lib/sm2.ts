export interface CardState {
  easeFactor: number
  interval: number
  repetitions: number
}

export interface SM2Result extends CardState {
  dueDate: Date
}

/**
 * SM-2 Algorithm implementation
 * quality: 0=blackout, 1=incorrect, 2=incorrect-easy, 3=correct-hard, 4=correct, 5=perfect
 */
export function calculateSM2(card: CardState, quality: number): SM2Result {
  let { easeFactor, interval, repetitions } = card

  if (quality >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    interval = 1
    repetitions = 0
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return { easeFactor, interval, repetitions, dueDate }
}

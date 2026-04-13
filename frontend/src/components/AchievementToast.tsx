import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface Achievement {
  title: string
  description: string
  iconName: string
  rarity: string
}

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

const rarityColors: Record<string, string> = {
  common: 'border-slate-400/40 bg-slate-400/5',
  rare: 'border-blue-400/40 bg-blue-400/5',
  epic: 'border-purple-400/40 bg-purple-400/10',
  legendary: 'border-yellow-400/40 bg-yellow-400/5',
}

const rarityGlow: Record<string, string> = {
  common: '',
  rare: 'shadow-[0_0_20px_rgba(96,165,250,0.15)]',
  epic: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]',
  legendary: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]',
}

export default function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [achievement, onDismiss])

  const rarity = achievement?.rarity || 'common'

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          onClick={onDismiss}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md ${rarityColors[rarity] ?? rarityColors.common} ${rarityGlow[rarity] ?? ''} max-w-[320px] w-[90vw]`}
        >
          <div className="text-3xl leading-none">🏆</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground/50 uppercase tracking-widest mb-0.5">Badge débloqué !</p>
            <p className="font-display font-bold text-sm text-foreground truncate">{achievement.title}</p>
            <p className="text-xs text-foreground/60 truncate">{achievement.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

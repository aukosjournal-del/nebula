import { motion } from 'framer-motion'
import { QUALITY_LABELS } from '../lib/sm2'

interface QualityRatingProps {
  onRate: (quality: number) => void
  isLoading?: boolean
}

export default function QualityRating({ onRate, isLoading = false }: QualityRatingProps) {
  const qualities = [0, 2, 3, 4, 5] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4"
    >
      <p className="text-xs text-foreground/50 uppercase tracking-widest font-display">
        Comment tu t'en souviens ?
      </p>
      <div className="flex gap-2">
        {qualities.map((quality) => {
          const { emoji, label, color } = QUALITY_LABELS[quality]
          return (
            <motion.button
              key={quality}
              onClick={() => !isLoading && onRate(quality)}
              disabled={isLoading}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', damping: 12, stiffness: 250 }}
              className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl bg-muted/15 border border-border/30 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[56px]"
            >
              <span className="text-2xl leading-none">{emoji}</span>
              <span className={`text-[10px] font-medium ${color} leading-none`}>{label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

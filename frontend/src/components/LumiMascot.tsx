import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

// Lumi — comète avec yeux uniquement, JAMAIS de bouche
export default function LumiMascot({
  happy = false,
  size = 56,
  showSparkles = true,
}: {
  happy?: boolean
  size?: number
  showSparkles?: boolean
}) {
  return (
    <div className="relative" style={{ width: size * 1.8, height: size }}>
      {/* Glow ring */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute rounded-full"
        style={{
          width: size * 1.6,
          height: size * 1.6,
          top: -(size * 0.3),
          right: -(size * 0.1),
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Comet tail */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [0.9, 1, 0.9] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute"
        style={{
          width: size * 0.9,
          height: size * 0.5,
          top: size * 0.25,
          left: 0,
          background: `linear-gradient(to left, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.15), transparent)`,
          borderRadius: '50% 0 0 50%',
          filter: `blur(${size * 0.08}px)`,
        }}
      />

      {/* Secondary tail streak */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.85, 1.05, 0.85] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
        className="absolute"
        style={{
          width: size * 0.6,
          height: size * 0.25,
          top: size * 0.2,
          left: size * 0.1,
          background: `linear-gradient(to left, hsl(var(--secondary) / 0.4), transparent)`,
          borderRadius: '50% 0 0 50%',
          filter: `blur(${size * 0.06}px)`,
        }}
      />

      {/* Body — tête de la comète */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: happy ? [0, -10, 10, -5, 0] : [0, 2, -2, 0],
        }}
        transition={{
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          rotate: {
            repeat: happy ? 3 : Infinity,
            duration: happy ? 0.5 : 6,
            ease: 'easeInOut',
          },
        }}
        className="absolute right-0 bg-foreground rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 ${size * 0.7}px rgba(255,255,255,0.9), 0 0 ${size * 1.2}px hsl(var(--primary) / 0.3)`,
        }}
      >
        {/* Yeux uniquement — JAMAIS de bouche */}
        <div className="flex gap-1.5" style={{ marginTop: size * -0.05 }}>
          <motion.div
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 1] }}
            className="bg-background rounded-full"
            style={{ width: size * 0.1, height: size * 0.16 }}
          />
          <motion.div
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 1], delay: 0.05 }}
            className="bg-background rounded-full"
            style={{ width: size * 0.1, height: size * 0.16 }}
          />
        </div>
      </motion.div>

      {/* Sparkle particles */}
      {showSparkles &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [-5, -20, -5],
              x: [-(i * 10), -(i * 15 + 10), -(i * 10)],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.6 }}
            className="absolute text-primary"
            style={{ top: size * 0.3, right: size * 0.8 }}
          >
            <Sparkles size={size * 0.16} />
          </motion.div>
        ))}
    </div>
  )
}

import { motion } from 'framer-motion'

export default function LumiMascot({ size = 80 }: { size?: number }) {
  const s = size
  const cx = s / 2
  const cy = s / 2
  const R = s * 0.42

  // Circle arc gaps at ~1h (upper-right) and ~7h (lower-left)
  const gap = 28 // degrees
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (angle: number, r = R) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  })

  // Arc 1: from -20° to 120°
  const a1s = pt(-20)
  const a1e = pt(120)
  // Arc 2: from 150° to 305°  (150 + gap = 178... roughly)
  const a2s = pt(150)
  const a2e = pt(305)

  const arcPath = (
    sx: number, sy: number,
    ex: number, ey: number,
    r: number,
    largeArc: 0 | 1
  ) =>
    `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`

  // Comet head center — upper-left of circle (~225° direction, 52% radius)
  const headDist = R * 0.52
  const headAngle = 225
  const hx = cx + headDist * Math.cos(toRad(headAngle))
  const hy = cy + headDist * Math.sin(toRad(headAngle))

  // Oval half-axes
  const rx = s * 0.07
  const ry = s * 0.10

  // Eye position (upper-left of tilted oval → upper-left in screen)
  const eyeOffset = ry * 0.55
  const ex = hx + eyeOffset * Math.cos(toRad(225))
  const ey = hy + eyeOffset * Math.sin(toRad(225))
  const eyeR = s * 0.028

  // Tail: 4 lines from oval lower-right toward lower-right
  const travelDir = toRad(45) // lower-right in screen
  const perpDir = toRad(135) // perpendicular spread
  const travelDist = s * 0.42
  const spreads = [-s * 0.09, -s * 0.03, s * 0.03, s * 0.09]
  const tailOriginX = hx + ry * 0.7 * Math.cos(toRad(45))
  const tailOriginY = hy + ry * 0.7 * Math.sin(toRad(45))

  const tailLines = spreads.map((spread) => ({
    x1: tailOriginX,
    y1: tailOriginY,
    x2: tailOriginX + travelDist * Math.cos(travelDir) + spread * Math.cos(perpDir),
    y2: tailOriginY + travelDist * Math.sin(travelDir) + spread * Math.sin(perpDir),
  }))

  const sw = s * 0.032 // stroke width

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      style={{ width: size, height: size }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Cyan glow filter */}
          <filter id="lumi-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lumi-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lumi-tail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#D946EF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lumi-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>

        {/* Broken circle */}
        <motion.path
          d={arcPath(a1s.x, a1s.y, a1e.x, a1e.y, R, 0)}
          stroke="url(#lumi-circle-grad)"
          strokeWidth={sw}
          strokeLinecap="square"
          filter="url(#lumi-glow)"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
        <motion.path
          d={arcPath(a2s.x, a2s.y, a2e.x, a2e.y, R, 0)}
          stroke="url(#lumi-circle-grad)"
          strokeWidth={sw}
          strokeLinecap="square"
          filter="url(#lumi-glow)"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Tail lines */}
        {tailLines.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#lumi-tail-grad)"
            strokeWidth={sw * 0.85}
            strokeLinecap="round"
            filter="url(#lumi-glow)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: 'easeInOut',
              delay: i * 0.1,
            }}
          />
        ))}

        {/* Comet head — oval rotated -45° */}
        <motion.ellipse
          cx={hx}
          cy={hy}
          rx={rx}
          ry={ry}
          fill="#00D9FF"
          transform={`rotate(-45, ${hx}, ${hy})`}
          filter="url(#lumi-glow-strong)"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />

        {/* Eye */}
        <motion.circle
          cx={ex}
          cy={ey}
          r={eyeR}
          fill="#0A0F1E"
          animate={{ r: [eyeR, eyeR * 1.15, eyeR] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        />

        {/* Sparkle particles on tail */}
        {[0, 1, 2].map((i) => {
          const t = 0.3 + i * 0.25
          const px = tailOriginX + travelDist * t * Math.cos(travelDir)
          const py = tailOriginY + travelDist * t * Math.sin(travelDir)
          return (
            <motion.circle
              key={`spark-${i}`}
              cx={px}
              cy={py}
              r={sw * 0.5}
              fill="#00D9FF"
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

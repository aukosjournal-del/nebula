import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

interface CardStats {
  totalCards: number
  dueToday: number
  masteredCards: number
  avgEaseFactor: number
  totalReviewed: number
}

export default function LearningDashboard() {
  const { data, isLoading } = useQuery<CardStats>({
    queryKey: ['card-stats'],
    queryFn: () => api.get<CardStats>('/cards/stats'),
    staleTime: 60_000,
  })

  if (isLoading || !data) return null

  const retention = data.totalCards > 0
    ? Math.round((data.masteredCards / data.totalCards) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-muted/15 border border-border/30 p-4 mb-4"
    >
      <h3 className="font-display text-xs uppercase tracking-widest text-foreground/40 mb-3">
        Tableau de Bord
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          value={data.dueToday}
          label="À réviser"
          color="text-cyan-300"
          highlight={data.dueToday > 0}
        />
        <StatCard
          value={data.masteredCards}
          label="Maîtrisées"
          color="text-green-400"
        />
        <StatCard
          value={`${retention}%`}
          label="Maîtrise"
          color="text-purple-300"
        />
      </div>
    </motion.div>
  )
}

function StatCard({
  value,
  label,
  color,
  highlight,
}: {
  value: number | string
  label: string
  color: string
  highlight?: boolean
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/10 border ${highlight ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-border/20'}`}>
      <span className={`font-display text-xl font-bold ${color}`}>{value}</span>
      <span className="text-[10px] text-foreground/40 mt-0.5 text-center leading-tight">{label}</span>
    </div>
  )
}

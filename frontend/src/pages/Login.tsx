import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, username, password)
      }
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-2xl bg-muted/20 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-muted/30 transition-colors'

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'hsl(var(--background))' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[60%] h-[60%] top-[-10%] left-[-10%] rounded-full opacity-10 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, hsl(var(--glow-cyan)) 0%, hsl(var(--glow-purple)) 50%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-[32px] border border-border bg-card/30 backdrop-blur-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-12 h-12 bg-foreground rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)] mb-4 flex items-center justify-center"
          >
            <Sparkles size={20} className="text-background" />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">Nebula</h1>
          <p className="text-xs text-muted-foreground/60 tracking-widest uppercase font-bold mt-1">
            {mode === 'login' ? 'Retrouve ton univers' : 'Commence ton voyage'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          {mode === 'register' && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              required
              minLength={3}
            />
          )}
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
            minLength={8}
          />

          {error && (
            <p className="text-xs text-red-400 text-center font-medium px-2">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-primary/20 border border-primary/40 text-primary text-sm font-black tracking-widest uppercase hover:bg-primary/30 transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? '...' : mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </motion.button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
          className="w-full mt-4 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-medium tracking-wide"
        >
          {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </motion.div>
    </div>
  )
}

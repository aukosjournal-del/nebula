import { motion } from "framer-motion";
import { Sparkles, Compass, Star, Zap } from "lucide-react";
import ConstellationCanvas from "@/components/ConstellationCanvas";

interface ExplorationPageProps {
  onReturn: () => void;
}

const cards = [
  {
    icon: Sparkles,
    title: "Univers Créatif",
    description: "Explore des mondes générés par l'imagination et la lumière.",
  },
  {
    icon: Compass,
    title: "Navigation Stellaire",
    description: "Trace ta route à travers les constellations inconnues.",
  },
  {
    icon: Star,
    title: "Étoiles Collectées",
    description: "Chaque découverte illumine ta collection céleste.",
  },
  {
    icon: Zap,
    title: "Énergie Cosmique",
    description: "Canalise l'énergie des nébuleuses pour avancer.",
  },
];

const ExplorationPage = ({ onReturn }: ExplorationPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center px-6 overflow-auto"
    >
      <ConstellationCanvas />
      {/* Radial backdrop */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 50% 0%, hsl(270 60% 15% / 0.8), transparent),
            radial-gradient(ellipse 60% 40% at 50% 100%, hsl(200 80% 10% / 0.6), transparent),
            hsl(230 25% 5%)
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-4xl w-full py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-3"
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-wider text-glow-cyan text-primary">
            BIENVENUE, EXPLORATEUR
          </h1>
          <p className="font-body text-sm md:text-base text-muted-foreground tracking-wide max-w-lg mx-auto">
            Tu as traversé le voile. Cet espace est tien — chaque chemin mène à une nouvelle découverte.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="group relative rounded-2xl p-6 cursor-pointer overflow-hidden border border-border"
              style={{
                background: "hsl(230 20% 8% / 0.8)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, hsl(190 100% 50% / 0.08), transparent 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold tracking-wide text-foreground">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Return button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onReturn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="font-body text-sm tracking-widest uppercase px-8 py-3 rounded-full border border-primary/30 text-primary hover:border-primary/60 transition-colors cursor-pointer"
          style={{
            boxShadow: "0 0 20px hsl(190 100% 50% / 0.15)",
          }}
        >
          ← Retourner à l'orbe
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ExplorationPage;

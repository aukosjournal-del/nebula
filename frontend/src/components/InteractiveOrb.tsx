import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface InteractiveOrbProps {
  onDiveComplete: () => void;
}

const InteractiveOrb = ({ onDiveComplete }: InteractiveOrbProps) => {
  const [statusText, setStatusText] = useState("Prêt à briller, explorateur ?");
  const [diving, setDiving] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      rotateY.set(x);
      rotateX.set(-y);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rotateX, rotateY]);

  const handleClick = () => {
    if (diving) return;
    setDiving(true);
    setStatusText("IMMERSION...");
    setTimeout(() => {
      onDiveComplete();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 pointer-events-none">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="font-display text-4xl md:text-6xl font-bold tracking-wider text-glow-cyan text-primary text-center"
      >
        LUMI
      </motion.h1>

      {/* Orb */}
      <motion.div
        className="pointer-events-auto cursor-pointer relative"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          perspective: 800,
        }}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        animate={
          diving
            ? { scale: [0.9, 12, 12, 1], opacity: [1, 0, 0, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={
          diving
            ? { duration: 2.8, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }
            : { duration: 0.3 }
        }
      >
        <div className="relative w-40 h-40 md:w-56 md:h-56">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-8px] rounded-full border-2 border-orb-ring opacity-40"
          />
          {/* Second ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-16px] rounded-full border border-glow-cyan opacity-20"
          />
          {/* Orb glow */}
          <div
            className="absolute inset-[-30px] rounded-full opacity-30 blur-2xl"
            style={{
              background: "radial-gradient(circle, hsl(190 100% 50%), hsl(270 70% 50%), transparent)",
            }}
          />
          {/* Orb body */}
          <div
            className="absolute inset-0 rounded-full box-glow-cyan"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, hsl(190 100% 80% / 0.8), transparent 50%),
                radial-gradient(circle at 70% 70%, hsl(270 80% 60% / 0.5), transparent 50%),
                radial-gradient(circle, hsl(190 100% 40%), hsl(230 30% 10%))
              `,
            }}
          />
          {/* Inner pulse */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-4 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(190 100% 70% / 0.4), transparent)",
            }}
          />
        </div>
      </motion.div>

      {/* Status text */}
      <motion.p
        key={statusText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-body text-sm md:text-base tracking-widest uppercase text-muted-foreground"
      >
        {statusText}
      </motion.p>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
        className="font-body text-xs tracking-wide text-muted-foreground"
      >
        Clique sur l'orbe pour plonger
      </motion.p>
    </div>
  );
};

export default InteractiveOrb;

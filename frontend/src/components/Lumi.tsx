import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const Lumi = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60 - 100;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed z-20 pointer-events-none"
      style={{
        left: "50%",
        top: "35%",
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Lumi body - glowing orb entity */}
        <div className="relative w-16 h-16">
          {/* Outer glow */}
          <div
            className="absolute inset-[-12px] rounded-full opacity-40 blur-xl"
            style={{ background: "radial-gradient(circle, hsl(190 100% 60%), transparent)" }}
          />
          {/* Core */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, hsl(190 100% 80%), hsl(190 100% 50%), hsl(270 70% 50%))",
              boxShadow: "0 0 20px hsl(190 100% 50% / 0.6), 0 0 40px hsl(190 100% 50% / 0.3)",
            }}
          />
          {/* Eyes */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 pt-1">
            <div className="w-2 h-2.5 rounded-full bg-background" />
            <div className="w-2 h-2.5 rounded-full bg-background" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Lumi;

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="al-viewport flex min-h-screen items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center p-12 rounded-2xl bg-muted/15 backdrop-blur-xl border border-border/30 shadow-lg"
      >
        <h1
          className="mb-4 text-6xl font-black tracking-tighter"
          style={{ color: 'var(--al-text-primary)' }}
        >
          404
        </h1>
        <p
          className="mb-6 text-lg font-medium"
          style={{ color: 'var(--al-text-secondary)' }}
        >
          Page introuvable
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 rounded-full font-medium text-white transition-all duration-300 hover:shadow-lg"
          style={{ background: 'var(--al-accent-cyan)' }}
        >
          Retour a l'accueil
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;

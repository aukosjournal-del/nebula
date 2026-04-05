import { useEffect, useRef } from "react";

const Nebula = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      ref.current.style.background = `
        radial-gradient(ellipse 600px 400px at ${x}% ${y}%, hsl(260 60% 20% / 0.6), transparent),
        radial-gradient(ellipse 800px 500px at ${100 - x}% ${100 - y}%, hsl(200 80% 15% / 0.4), transparent)
      `;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none transition-[background] duration-1000"
      style={{
        background: `
          radial-gradient(ellipse 600px 400px at 50% 50%, hsl(260 60% 20% / 0.6), transparent),
          radial-gradient(ellipse 800px 500px at 50% 50%, hsl(200 80% 15% / 0.4), transparent)
        `,
      }}
    />
  );
};

export default Nebula;

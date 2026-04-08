import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Flame, Zap, ChevronLeft, ChevronRight, Sparkles, BookOpen, Target, BrainCircuit, LogOut, Check, Star, Trophy, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import LessonContent from './LessonContent';
import QualityRating from './QualityRating';
import AchievementToast from './AchievementToast';
import LearningDashboard from './LearningDashboard';
import InstallPrompt from './InstallPrompt';

// --- PHYSICS CONFIG ---
const springTuning = { type: "spring" as const, damping: 20, stiffness: 120, mass: 1 };
const microBounce = { type: "spring" as const, damping: 12, stiffness: 250 };

// --- TYPES ---
interface Lesson { id: string; title: string; order: number }
interface CourseProgress {
  percentage: number;
  completedSteps: number;
  currentLessonId: string | null;
  completedAt: string | null;
}
interface Course {
  id: string;
  slug: string;
  title: string;
  iconName: string;
  color: string;
  order: number;
  lessonCount: number;
  lessons: Lesson[];
  progress: CourseProgress;
}

interface Achievement {
  title: string
  description: string
  iconName: string
  rarity: string
}

interface StudyAnswer {
  id: string
  text: string
  isCorrect: boolean
}

interface StudyCard {
  questionId: string
  prompt: string
  answers: StudyAnswer[]
  lessonTitle: string
  courseTitle: string
  courseColor: string
  easeFactor: number
  interval: number
  repetitions: number
  isNew: boolean
}

// --- ICON MAP ---
const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  Zap, Sparkles, BrainCircuit, BookOpen, Target,
};

// --- CONFETTI PARTICLE ---
const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    initial={{ y: 0, x: 0, opacity: 1, scale: 0, rotate: 0 }}
    animate={{
      y: [0, -180, 50],
      x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
      opacity: [0, 1, 0],
      scale: [0, 1, 0.5],
      rotate: [0, Math.random() * 720 - 360],
    }}
    transition={{ delay, duration: 2, ease: "easeOut" }}
    className="absolute"
    style={{
      width: Math.random() * 8 + 4,
      height: Math.random() * 8 + 4,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      backgroundColor: color,
      left: '50%',
      top: '50%',
    }}
  />
);

// --- MAIN APP ---
export default function LuminaApp() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [view, setView] = useState<'hub' | 'focus' | 'celebrate'>('hub');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isLumiHappy, setIsLumiHappy] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ type: 'lesson' | 'course'; title: string } | null>(null);
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [studySession, setStudySession] = useState<StudyCard[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  // --- API ---
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => api.get<Course[]>('/courses'),
  });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;
  const streak = user?.streak ?? 0;

  const { data: sessionData } = useQuery<{ session: StudyCard[] }>({
    queryKey: ['cards-session', selectedCourseId],
    queryFn: () => api.get<{ session: StudyCard[] }>(`/cards/session?courseId=${selectedCourseId}`),
    enabled: !!selectedCourseId,
  });

  useEffect(() => {
    if (sessionData?.session) {
      setStudySession(sessionData.session)
      setSessionIndex(0)
    }
  }, [sessionData]);

  const totalProgress = useMemo(() => {
    if (!courses.length) return 0;
    return Math.round(courses.reduce((sum, c) => sum + c.progress.percentage, 0) / courses.length);
  }, [courses]);

  const completedCourses = useMemo(() => courses.filter(c => c.progress.completedAt).length, [courses]);

  // --- ADVANCE ---
  const advanceMutation = useMutation({
    mutationFn: ({ courseId, answerId }: { courseId: string; answerId?: string }) =>
      api.post<{
        correct: boolean;
        percentage: number;
        lessonComplete: boolean;
        courseComplete: boolean;
        streakUpdated: boolean;
        streak: number;
      }>(`/progress/${courseId}/advance`, answerId ? { answerId } : {}),
    onSuccess: (data) => {
      setLessonProgress(data.percentage);
      if (data.lessonComplete || data.courseComplete) {
        setIsLumiHappy(true);
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        queryClient.invalidateQueries({ queryKey: ['me'] });

        setCelebrationData({
          type: data.courseComplete ? 'course' : 'lesson',
          title: selectedCourse?.title ?? '',
        });
        setView('celebrate');
      }
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ questionId, quality }: { questionId: string; quality: number }) => {
      const result = await api.post<{ newAchievements: Achievement[]; nextReview: string }>(`/cards/${questionId}/review`, { quality })
      return result
    },
    onSuccess: (data) => {
      if (data.newAchievements?.length > 0) {
        setPendingAchievement(data.newAchievements[0])
        setIsLumiHappy(true)
        setTimeout(() => setIsLumiHappy(false), 2000)
      }
      // Advance to next card
      if (sessionIndex < studySession.length - 1) {
        setSessionIndex(prev => prev + 1)
        setShowAnswer(false)
      } else {
        // Session terminée
        setCelebrationData({
          type: 'lesson',
          title: selectedCourse?.title ?? 'Session',
        })
        queryClient.invalidateQueries({ queryKey: ['courses'] })
        queryClient.invalidateQueries({ queryKey: ['me'] })
        setView('celebrate')
      }
      queryClient.invalidateQueries({ queryKey: ['card-stats'] })
      queryClient.invalidateQueries({ queryKey: ['cards-session', selectedCourseId] })
    },
  });

  const completeLessonStep = () => {
    if (!selectedCourse) return;
    advanceMutation.mutate({ courseId: selectedCourse.id });
  };

  const handleQualityRate = (quality: number) => {
    const currentCard = studySession[sessionIndex]
    if (!currentCard) {
      // Fallback: use the existing advance mutation if no study session
      completeLessonStep()
      return
    }
    reviewMutation.mutate({ questionId: currentCard.questionId, quality })
  };

  const handleCelebrationDone = () => {
    setView('hub');
    setIsLumiHappy(false);
    setLessonProgress(0);
    setCelebrationData(null);
  };

  // Greeting
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden text-foreground selection:bg-primary/20"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: 'hsl(var(--background))' }}
    >
      <BioluminescenceEngine smoothX={smoothX} smoothY={smoothY} />

      <div className="relative z-10 w-full max-w-[420px] h-dvh md:h-[860px] md:mt-8 md:rounded-[50px] mx-auto border-0 md:border border-border bg-card/30 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col antialiased">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm text-muted-foreground font-medium tracking-widest uppercase"
            >
              Chargement...
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'hub' ? (
              <HubView
                key="hub"
                greeting={greeting}
                username={user?.username ?? 'Explorateur'}
                streak={streak}
                totalProgress={totalProgress}
                completedCourses={completedCourses}
                totalCourses={courses.length}
                courses={courses}
                smoothX={smoothX}
                smoothY={smoothY}
                onSelectCourse={(course: Course) => {
                  setSelectedCourseId(course.id);
                  setLessonProgress(course.progress.percentage);
                  setView('focus');
                }}
                onLogout={logout}
              />
            ) : view === 'focus' && selectedCourse ? (
              <FocusView
                key={`focus-${sessionIndex}`}
                course={selectedCourse}
                progress={lessonProgress}
                currentCard={studySession[sessionIndex] ?? null}
                sessionIndex={sessionIndex}
                sessionTotal={studySession.length}
                onBack={() => setView('hub')}
                isLumiHappy={isLumiHappy}
                onQualityRate={handleQualityRate}
                isReviewPending={reviewMutation.isPending}
              />
            ) : view === 'celebrate' ? (
              <CelebrationView
                key="celebrate"
                type={celebrationData?.type ?? 'lesson'}
                title={celebrationData?.title ?? 'Session terminée'}
                streak={streak}
                onDone={handleCelebrationDone}
              />
            ) : null}
          </AnimatePresence>
        )}
      </div>

      <AchievementToast
        achievement={pendingAchievement}
        onDismiss={() => setPendingAchievement(null)}
      />
    </div>
  );
}

// ==================== COMPONENTS ====================

// --- BIOLUMINESCENCE ---
const BioluminescenceEngine = ({ smoothX, smoothY }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaX = useTransform(smoothX, [-500, 500], ["60%", "40%"]);
  const nebulaY = useTransform(smoothY, [-500, 500], ["60%", "40%"]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number;
    const particles: any[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 1.5, speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3, a: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />
      <motion.div
        className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] rounded-full opacity-20 blur-[120px]"
        style={{
          x: nebulaX, y: nebulaY,
          background: "radial-gradient(circle, hsl(var(--glow-cyan)) 0%, hsl(var(--glow-purple)) 30%, transparent 70%)"
        }}
      />
    </div>
  );
};

// --- LUMI MASCOT (comet shape with tail, eyes only, no mouth) ---
const LumiMascot = ({ happy, size = 56, showSparkles = true }: { happy?: boolean; size?: number; showSparkles?: boolean }) => (
  <div className="relative" style={{ width: size * 1.8, height: size }}>
    {/* Glow ring */}
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="absolute rounded-full"
      style={{
        width: size * 1.6, height: size * 1.6,
        top: -(size * 0.3), right: -(size * 0.1),
        background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
      }}
    />

    {/* Comet tail */}
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [0.9, 1, 0.9] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="absolute"
      style={{
        width: size * 0.9, height: size * 0.5,
        top: size * 0.25, left: 0,
        background: `linear-gradient(to left, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.15), transparent)`,
        borderRadius: '50% 0 0 50%',
        filter: `blur(${size * 0.08}px)`,
      }}
    />
    {/* Secondary tail streak */}
    <motion.div
      animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.85, 1.05, 0.85] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.3 }}
      className="absolute"
      style={{
        width: size * 0.6, height: size * 0.25,
        top: size * 0.2, left: size * 0.1,
        background: `linear-gradient(to left, hsl(var(--secondary) / 0.4), transparent)`,
        borderRadius: '50% 0 0 50%',
        filter: `blur(${size * 0.06}px)`,
      }}
    />

    {/* Body (head of comet) */}
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: happy ? [0, -10, 10, -5, 0] : [0, 2, -2, 0],
      }}
      transition={{
        y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        rotate: { repeat: happy ? 3 : Infinity, duration: happy ? 0.5 : 6, ease: "easeInOut" }
      }}
      className="absolute right-0 bg-foreground rounded-full flex items-center justify-center"
      style={{
        width: size, height: size,
        boxShadow: `0 0 ${size * 0.7}px rgba(255,255,255,0.9), 0 0 ${size * 1.2}px hsl(var(--primary) / 0.3)`,
      }}
    >
      {/* Eyes only */}
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

    {/* Sparkle particles trailing */}
    {showSparkles && [0, 1, 2].map(i => (
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
);

// --- HEADER (redesigned like example) ---
const DashboardHeader = ({ greeting, username, streak, onLogout }: {
  greeting: string; username: string; streak: number; onLogout: () => void;
}) => (
  <header className="px-6 pt-8 pb-2 relative z-20">
    <div className="flex justify-between items-start">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-black tracking-tight text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {greeting},
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground font-medium mt-0.5"
        >
          {username}
        </motion.p>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center gap-1.5"
        >
          <Flame size={14} className="text-orange-400 fill-orange-400" />
          <span className="text-xs font-bold text-orange-300">{streak}</span>
        </motion.div>

        <InstallPrompt />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="w-9 h-9 rounded-full bg-muted/30 border border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          title="Se deconnecter"
        >
          <LogOut size={14} className="text-muted-foreground" />
        </motion.button>
      </div>
    </div>
  </header>
);

// --- OVERALL PROGRESS CARD ---
const OverallProgressCard = ({ percentage, completed, total }: {
  percentage: number; completed: number; total: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, ...springTuning }}
    className="mx-6 p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-md"
  >
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xs font-black tracking-widest uppercase text-primary/80" style={{ fontFamily: 'var(--font-display)' }}>
        Progression
      </h3>
      <div className="flex gap-1">
        <button className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
          Tout
        </button>
        <button className="px-2.5 py-1 rounded-full text-[10px] font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          Fait
        </button>
      </div>
    </div>

    <div className="flex items-end gap-3 mb-3">
      <span className="text-4xl font-black text-foreground tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
        {percentage}%
      </span>
      <span className="text-xs text-muted-foreground mb-1.5 font-medium">parcours accompli</span>
    </div>

    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden border border-border">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full relative"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
          boxShadow: '0 0 15px hsl(var(--primary) / 0.5)',
        }}
      />
    </div>

    <div className="flex justify-end mt-2">
      <span className="text-xs font-bold text-muted-foreground">
        {completed}/{total}
      </span>
    </div>
  </motion.div>
);

// --- COURSE CARD (enhanced) ---
const CourseCard = ({ course, index, onSelect }: {
  course: Course; index: number; onSelect: () => void;
}) => {
  const IconComponent = iconMap[course.iconName] ?? Sparkles;
  const isComplete = course.progress.completedAt !== null;
  const completedLessons = Math.floor((course.progress.percentage / 100) * course.lessonCount);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 + index * 0.08, ...springTuning }}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="p-4 rounded-3xl bg-muted/15 border border-border hover:border-primary/30 cursor-pointer transition-colors group relative overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ background: `radial-gradient(circle at 30% 50%, ${course.color}10 0%, transparent 70%)` }}
      />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: `${course.color}12`, borderColor: `${course.color}30` }}
        >
          <IconComponent size={22} style={{ color: course.color, filter: `drop-shadow(0 0 4px ${course.color})` }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-extrabold tracking-tight text-foreground/90 truncate">{course.title}</h3>
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0"
              >
                <Check size={10} className="text-green-400" />
              </motion.div>
            )}
          </div>

          {/* Lesson count */}
          <p className="text-[11px] text-muted-foreground/60 font-medium mb-2">
            {completedLessons}/{course.lessonCount} lecons
          </p>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden border border-border/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress.percentage}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: course.color, boxShadow: `0 0 8px ${course.color}60` }}
            />
          </div>
        </div>

        {/* Percentage + Arrow */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-sm font-bold" style={{ color: course.color }}>
            {Math.round(course.progress.percentage)}%
          </span>
          <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
};

// --- HUB VIEW (redesigned dashboard) ---
const HubView = ({ greeting, username, streak, totalProgress, completedCourses, totalCourses, courses, smoothX, smoothY, onSelectCourse, onLogout }: {
  greeting: string;
  username: string;
  streak: number;
  totalProgress: number;
  completedCourses: number;
  totalCourses: number;
  courses: Course[];
  smoothX: any;
  smoothY: any;
  onSelectCourse: (c: Course) => void;
  onLogout: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, y: -30 }}
    transition={springTuning}
    className="flex-1 flex flex-col overflow-hidden"
  >
    <DashboardHeader greeting={greeting} username={username} streak={streak} onLogout={onLogout} />

    {/* Mascot greeting area */}
    <div className="flex justify-center py-3">
      <LumiMascot size={48} showSparkles />
    </div>

    {/* Overall progress */}
    <OverallProgressCard percentage={totalProgress} completed={completedCourses} total={totalCourses} />

    {/* Learning dashboard */}
    <div className="px-6 pt-4">
      <LearningDashboard />
    </div>

    {/* Course list header */}
    <div className="px-6 pt-1 pb-2 flex justify-between items-center">
      <h2 className="text-xs font-black tracking-widest uppercase text-muted-foreground/60" style={{ fontFamily: 'var(--font-display)' }}>
        Parcours
      </h2>
      <span className="text-[10px] text-primary/60 font-bold">{courses.length} disponibles</span>
    </div>

    {/* Scrollable course cards */}
    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 scrollbar-thin">
      {courses.map((course, i) => (
        <CourseCard key={course.id} course={course} index={i} onSelect={() => onSelectCourse(course)} />
      ))}
    </div>

    {/* Footer */}
    <footer className="p-4 text-center border-t border-border/30">
      <p className="text-[9px] text-muted-foreground/30 tracking-[0.3em] uppercase font-black">Nebula</p>
    </footer>
  </motion.div>
);


// --- FOCUS VIEW (real SM-2 QCM) ---
const FocusView = ({
  course,
  progress,
  currentCard,
  sessionIndex,
  sessionTotal,
  onBack,
  isLumiHappy,
  onQualityRate,
  isReviewPending,
}: {
  course: Course;
  progress: number;
  currentCard: StudyCard | null;
  sessionIndex: number;
  sessionTotal: number;
  onBack: () => void;
  isLumiHappy: boolean;
  onQualityRate?: (quality: number) => void;
  isReviewPending?: boolean;
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAnswer = useCallback((answer: StudyAnswer) => {
    if (selectedId || isReviewPending) return;
    setSelectedId(answer.id);
    const quality = answer.isCorrect ? 4 : 2;
    setTimeout(() => {
      onQualityRate?.(quality);
    }, 900);
  }, [selectedId, isReviewPending, onQualityRate]);

  const getAnswerStyle = (answer: StudyAnswer) => {
    if (!selectedId) return 'border-border bg-muted/10 hover:border-primary/40 hover:bg-muted/20';
    if (answer.id === selectedId) {
      return answer.isCorrect
        ? 'border-green-500/70 bg-green-500/15 text-green-300'
        : 'border-red-500/70 bg-red-500/15 text-red-300';
    }
    if (answer.isCorrect) return 'border-green-500/50 bg-green-500/10 text-green-400';
    return 'border-border/30 bg-muted/5 opacity-40';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={springTuning}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Top bar */}
      <div className="px-6 pt-8 pb-3 flex items-center gap-3">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-muted/30 border border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors shrink-0"
        >
          <ChevronLeft size={18} className="text-foreground" />
        </motion.button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: course.color, boxShadow: `0 0 6px ${course.color}` }} />
            <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground truncate">{course.title}</span>
          </div>
        </div>
        <LumiMascot happy={isLumiHappy} size={32} showSparkles={false} />
      </div>

      {/* Session progress bar */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Question</span>
          <span className="text-[10px] font-bold text-muted-foreground/50">{sessionIndex + 1} / {sessionTotal || '—'}</span>
        </div>
        <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: sessionTotal ? `${(sessionIndex / sessionTotal) * 100}%` : '0%' }}
            transition={{ type: 'tween', ease: 'circOut', duration: 0.4 }}
            className="h-full rounded-full"
            style={{ backgroundColor: course.color, boxShadow: `0 0 8px ${course.color}60` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {!currentCard ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm text-muted-foreground font-medium tracking-widest uppercase"
            >
              Chargement...
            </motion.div>
          </div>
        ) : (
          <>
            {/* Lesson label */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                {currentCard.isNew ? '✦ Nouvelle carte' : '↻ Révision'}
              </span>
              <p className="text-xs text-muted-foreground/40 mt-0.5">{currentCard.lessonTitle}</p>
            </div>

            {/* Question */}
            <motion.div
              key={currentCard.questionId}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-7 p-5 rounded-3xl bg-gradient-to-br from-primary/8 to-secondary/5 border border-primary/15"
            >
              <p className="text-lg font-extrabold leading-snug tracking-tight text-foreground/95" style={{ fontFamily: 'var(--font-display)' }}>
                {currentCard.prompt}
              </p>
            </motion.div>

            {/* Answers */}
            <div className="space-y-3">
              {currentCard.answers.map((answer, i) => (
                <motion.button
                  key={answer.id}
                  initial={{ x: -15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  whileTap={{ scale: selectedId ? 1 : 0.98 }}
                  onClick={() => handleAnswer(answer)}
                  disabled={!!selectedId || isReviewPending}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold flex items-center gap-3 transition-all duration-300 cursor-pointer disabled:cursor-default ${getAnswerStyle(answer)}`}
                >
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                    selectedId && answer.isCorrect
                      ? 'border-green-500/60 bg-green-500/20 text-green-400'
                      : selectedId && answer.id === selectedId && !answer.isCorrect
                      ? 'border-red-500/60 bg-red-500/20 text-red-400'
                      : 'border-current bg-current/5'
                  }`}>
                    {selectedId && answer.isCorrect ? <Check size={12} /> :
                     selectedId && answer.id === selectedId ? '✕' :
                     String.fromCharCode(65 + i)}
                  </div>
                  <span className="leading-snug">{answer.text}</span>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {selectedId && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-5 p-3 rounded-2xl text-center text-sm font-bold ${
                    currentCard.answers.find(a => a.id === selectedId)?.isCorrect
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {currentCard.answers.find(a => a.id === selectedId)?.isCorrect
                    ? '✓ Exactement !'
                    : `✗ Bonne réponse : "${currentCard.answers.find(a => a.isCorrect)?.text}"`}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};


// --- CELEBRATION VIEW ---
const CelebrationView = ({ type, title, streak, onDone }: {
  type: 'lesson' | 'course';
  title: string;
  streak: number;
  onDone: () => void;
}) => {
  const confettiColors = ['#22d3ee', '#a78bfa', '#f87171', '#fbbf24', '#34d399', '#f472b6', '#60a5fa'];

  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Confetti burst */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            delay={i * 0.03}
            color={confettiColors[i % confettiColors.length]}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 40%, hsl(var(--primary) / 0.15) 0%, transparent 60%)',
      }} />

      {/* Animated Lumi comet - hero element */}
      <motion.div
        initial={{ scale: 0, y: 40 }}
        animate={{ scale: [0, 1.15, 1], y: 0 }}
        transition={{ delay: 0.2, type: "spring", damping: 10 }}
        className="relative mb-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute inset-[-60%] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.15), transparent, hsl(var(--secondary) / 0.15), transparent)',
          }}
        />
        <div className="relative">
          <LumiMascot happy size={80} showSparkles />
        </div>
      </motion.div>

      {/* Badge icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 12 }}
        className="mb-6"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/30 flex items-center justify-center backdrop-blur-md">
          {type === 'course' ? (
            <Trophy size={28} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
          ) : (
            <Star size={28} className="text-primary fill-primary/30 drop-shadow-[0_0_15px_hsl(var(--primary))]" />
          )}
        </div>
      </motion.div>

      {/* Text */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-3xl font-black tracking-tighter text-foreground mb-2 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {type === 'course' ? 'Bravo !' : 'Bien joue !'}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-muted-foreground text-sm font-medium text-center px-8 mb-8 leading-relaxed"
      >
        {type === 'course'
          ? `Tu as termine le parcours "${title}" avec succes !`
          : 'Tu as complete cette activite avec succes !'}
      </motion.p>

      {/* Stats badges */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3 mb-10"
      >
        <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
          <Flame size={14} className="text-orange-400 fill-orange-400" />
          <span className="text-xs font-bold text-orange-300">{streak} jours</span>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary">+1 eclat</span>
        </div>
      </motion.div>

      {/* Main action button - large like the example */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onDone}
        className="w-[80%] py-4 rounded-2xl text-sm font-black tracking-widest uppercase transition-all"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
          color: 'hsl(var(--primary-foreground))',
          boxShadow: '0 0 30px hsl(var(--primary) / 0.4)',
        }}
      >
        Continuer
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onDone}
        className="mt-3 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-medium underline underline-offset-2"
      >
        Retour au hub
      </motion.button>
    </motion.div>
  );
};

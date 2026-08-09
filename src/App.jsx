import { useState, useEffect, useRef } from "react";

// TODO: Reemplazar con autenticación real de usuario
const MOCK_USER = {
  name: "Carlos García",
  username: "@carlosfit",
  avatar: "https://via.placeholder.com/80x80/FF6B35/ffffff?text=CG",
  followers: 42,
  following: 18,
  workouts: 87,
};

// TODO: Conectar con base de datos real de ejercicios con videos
const EXERCISES_DB = [
  { id: 1, name: "Press de Banca", muscle: "Pecho", category: "Empuje", equipment: "Barra", icon: "🏋️" },
  { id: 2, name: "Sentadilla", muscle: "Piernas", category: "Piernas", equipment: "Barra", icon: "🦵" },
  { id: 3, name: "Peso Muerto", muscle: "Espalda", category: "Jalón", equipment: "Barra", icon: "💪" },
  { id: 4, name: "Dominadas", muscle: "Espalda", category: "Jalón", equipment: "Peso Corporal", icon: "🔝" },
  { id: 5, name: "Press Militar", muscle: "Hombros", category: "Empuje", equipment: "Barra", icon: "🏋️" },
  { id: 6, name: "Curl de Bíceps", muscle: "Bíceps", category: "Jalón", equipment: "Mancuernas", icon: "💪" },
  { id: 7, name: "Tríceps Polea", muscle: "Tríceps", category: "Empuje", equipment: "Polea", icon: "🔱" },
  { id: 8, name: "Remo con Barra", muscle: "Espalda", category: "Jalón", equipment: "Barra", icon: "🚣" },
  { id: 9, name: "Sentadilla Búlgara", muscle: "Piernas", category: "Piernas", equipment: "Mancuernas", icon: "🦵" },
  { id: 10, name: "Aperturas Pecho", muscle: "Pecho", category: "Empuje", equipment: "Mancuernas", icon: "🤸" },
  { id: 11, name: "Fondos en Paralelas", muscle: "Tríceps", category: "Empuje", equipment: "Peso Corporal", icon: "⬇️" },
  { id: 12, name: "Face Pull", muscle: "Hombros", category: "Jalón", equipment: "Polea", icon: "🎯" },
];

const ROUTINES_MOCK = [
  {
    id: 1,
    name: "Push Day - Pecho y Hombros",
    exercises: [
      { exerciseId: 1, sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 85 }, { reps: 6, weight: 90 }] },
      { exerciseId: 5, sets: [{ reps: 10, weight: 60 }, { reps: 8, weight: 65 }, { reps: 6, weight: 70 }] },
      { exerciseId: 7, sets: [{ reps: 12, weight: 30 }, { reps: 10, weight: 35 }, { reps: 10, weight: 35 }] },
    ],
    lastUsed: "Hace 2 días",
    color: "#FF6B35",
  },
  {
    id: 2,
    name: "Pull Day - Espalda y Bíceps",
    exercises: [
      { exerciseId: 3, sets: [{ reps: 5, weight: 120 }, { reps: 5, weight: 125 }, { reps: 3, weight: 130 }] },
      { exerciseId: 4, sets: [{ reps: 8, weight: 0 }, { reps: 7, weight: 0 }, { reps: 6, weight: 0 }] },
      { exerciseId: 6, sets: [{ reps: 12, weight: 20 }, { reps: 10, weight: 22 }, { reps: 10, weight: 22 }] },
    ],
    lastUsed: "Hace 4 días",
    color: "#4ECDC4",
  },
  {
    id: 3,
    name: "Leg Day - Piernas",
    exercises: [
      { exerciseId: 2, sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 105 }, { reps: 6, weight: 110 }] },
      { exerciseId: 9, sets: [{ reps: 10, weight: 40 }, { reps: 10, weight: 40 }, { reps: 8, weight: 45 }] },
    ],
    lastUsed: "Hace 6 días",
    color: "#A855F7",
  },
];

// TODO: Conectar con historial real del usuario
const WORKOUT_HISTORY = [
  { id: 1, date: "Hoy", name: "Push Day - Pecho y Hombros", duration: "52 min", volume: "2.840 kg", sets: 9 },
  { id: 2, date: "Hace 2 días", name: "Pull Day - Espalda y Bíceps", duration: "48 min", volume: "3.120 kg", sets: 9 },
  { id: 3, date: "Hace 4 días", name: "Leg Day - Piernas", duration: "61 min", volume: "4.200 kg", sets: 6 },
  { id: 4, date: "Hace 6 días", name: "Push Day - Pecho y Hombros", duration: "49 min", volume: "2.760 kg", sets: 9 },
  { id: 5, date: "Hace 1 semana", name: "Pull Day - Espalda y Bíceps", duration: "45 min", volume: "3.050 kg", sets: 9 },
];

// TODO: Conectar con datos reales de progreso del usuario
const PROGRESS_DATA = {
  benchPress: [60, 65, 70, 75, 75, 80, 85, 85, 90],
  squat: [80, 85, 90, 95, 100, 100, 105, 110, 110],
  deadlift: [100, 105, 110, 115, 120, 125, 125, 130, 130],
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep"],
};

const COMMUNITY_FEED = [
  {
    id: 1,
    user: "María López",
    username: "@mariafit",
    avatar: "https://via.placeholder.com/40x40/FF6B35/ffffff?text=ML",
    workout: "Push Day",
    time: "hace 30 min",
    sets: 9,
    volume: "2.100 kg",
    duration: "45 min",
    liked: false,
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    user: "Jaume Martí",
    username: "@jaumefit",
    avatar: "https://via.placeholder.com/40x40/4ECDC4/ffffff?text=JM",
    workout: "Leg Day Intenso",
    time: "hace 2 horas",
    sets: 12,
    volume: "5.400 kg",
    duration: "68 min",
    liked: true,
    likes: 24,
    comments: 7,
  },
  {
    id: 3,
    user: "Sam Ilelaboye",
    username: "@samstrength",
    avatar: "https://via.placeholder.com/40x40/A855F7/ffffff?text=SI",
    workout: "Full Body",
    time: "hace 5 horas",
    sets: 15,
    volume: "3.800 kg",
    duration: "72 min",
    liked: false,
    likes: 31,
    comments: 11,
  },
];

// ─── SVG MINI CHART ────────────────────────────────────────────────────────────
function MiniLineChart({ data, color, width = 280, height = 80 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 10;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPoints = `${pad},${pad + h} ${polyline} ${pad + w},${pad + h}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * w;
        const y = pad + h - ((v - min) / range) * h;
        return (
          <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 5 : 3}
            fill={i === data.length - 1 ? color : "#1a1a2e"}
            stroke={color} strokeWidth="2" />
        );
      })}
    </svg>
  );
}

// ─── REST TIMER ────────────────────────────────────────────────────────────────
function RestTimer({ onClose }) {
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(true);
  const [total] = useState(90);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const progress = (seconds / total) * 283;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#1a1a2e", borderRadius: 24, padding: "40px 32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
        width: "min(320px, 90vw)",
      }}>
        <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>Tiempo de descanso</p>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="45" fill="none" stroke="#2a2a3e" strokeWidth="8" />
          <circle cx="70" cy="70" r="45" fill="none" stroke="#FF6B35" strokeWidth="8"
            strokeDasharray="283" strokeDashoffset={283 - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", fontSize: 36, fontWeight: 700, color: "#fff" }}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[30, 60, 90, 120].map(t => (
            <button key={t} onClick={() => setSeconds(t)}
              style={{
                background: seconds === t ? "#FF6B35" : "#2a2a3e",
                color: "#fff", border: "none", borderRadius: 8,
                padding: "6px 10px", fontSize: 12, cursor: "pointer",
              }}>{t}s</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setRunning(r => !r)}
            style={{
              background: running ? "#2a2a3e" : "#FF6B35",
              color: "#fff", border: "none", borderRadius: 12,
              padding: "12px 28px", fontSize: 15, cursor: "pointer", fontWeight: 600,
            }}>
            {running ? "⏸ Pausar" : "▶ Reanudar"}
          </button>
          <button onClick={onClose}
            style={{
              background: "#2a2a3e", color: "#aaa", border: "none",
              borderRadius: 12, padding: "12px 20px", fontSize: 15, cursor: "pointer",
            }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [workoutRunning, setWorkoutRunning] = useState(false);
  const [feed, setFeed] = useState(COMMUNITY_FEED);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progressTab, setProgressTab] = useState("benchPress");
  const [searchExercise, setSearchExercise] = useState("");
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [measurements, setMeasurements] = useState({ peso: 78, cintura: 82, cadera: 96, brazo: 38 });
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const timerRef = useRef(null);

  // Workout timer
  useEffect(() => {
    if (workoutRunning) {
      timerRef.current = setInterval(() => setWorkoutTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [workoutRunning]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const startWorkout = (routine) => {
    const exercises = routine.exercises.map(re => ({
      ...re,
      exercise: EXERCISES_DB.find(e => e.id === re.exerciseId),
      sets: re.sets.map(s => ({ ...s, done: false })),
    }));
    setWorkoutExercises(exercises);
    setActiveWorkout(routine);
    setWorkoutTime(0);
    setWorkoutRunning(true);
    setActiveTab("entreno");
  };

  const finishWorkout = () => {
    setWorkoutRunning(false);
    setActiveWorkout(null);
    setWorkoutExercises([]);
    setWorkoutTime(0);
    setActiveTab("inicio");
    // TODO: Guardar entrenamiento en historial y sincronizar con servidor
    alert("✅ ¡Entrenamiento completado! Guardado en tu historial.");
  };

  const toggleSetDone = (exerciseIndex, setIndex) => {
    setWorkoutExercises(prev => {
      const copy = prev.map((ex, ei) => ei !== exerciseIndex ? ex : {
        ...ex,
        sets: ex.sets.map((s, si) => si !== setIndex ? s : { ...s, done: !s.done }),
      });
      return copy;
    });
    setShowRestTimer(true);
  };

  const toggleLike = (id) => {
    setFeed(prev => prev.map(p => p.id !== id ? p : {
      ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1,
    }));
  };

  const filteredExercises = EXERCISES_DB.filter(e =>
    e.name.toLowerCase().includes(searchExercise.toLowerCase()) ||
    e.muscle.toLowerCase().includes(searchExercise.toLowerCase())
  );

  // ── Styles ──
  const S = {
    app: {
      background: "#0d0d1a",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#fff",
      position: "relative",
      paddingBottom: 80,
    },
    header: {
      background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)",
      padding: "52px 20px 20px",
      borderBottom: "1px solid #2a2a3e",
    },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    logo: {
      fontSize: 22, fontWeight: 800, color: "#FF6B35",
      letterSpacing: "-0.5px",
    },
    logoSub: { fontSize: 11, color: "#666", marginTop: 2 },
    avatar: {
      width: 38, height: 38, borderRadius: "50%",
      border: "2px solid #FF6B35", objectFit: "cover",
    },
    card: {
      background: "#1a1a2e",
      borderRadius: 16,
      padding: "16px 18px",
      marginBottom: 12,
    },
    cardTitle: { fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 },
    badge: {
      background: "#FF6B35",
      color: "#fff", borderRadius: 6,
      padding: "2px 8px", fontSize: 11, fontWeight: 600,
    },
    statBox: {
      background: "#12122a",
      borderRadius: 12, padding: "12px 14px",
      flex: 1, textAlign: "center",
    },
    statNum: { fontSize: 22, fontWeight: 800, color: "#FF6B35" },
    statLabel: { fontSize: 11, color: "#888", marginTop: 2 },
    btn: {
      background: "#FF6B35",
      color: "#fff", border: "none", borderRadius: 12,
      padding: "14px 20px", fontSize: 15, fontWeight: 700,
      cursor: "pointer", width: "100%",
      transition: "opacity 0.15s",
    },
    btnSecondary: {
      background: "#2a2a3e",
      color: "#ccc", border: "none", borderRadius: 12,
      padding: "12px 20px", fontSize: 14, fontWeight: 600,
      cursor: "pointer", width: "100%",
    },
    tabBar: {
      position: "fixed", bottom: 0, left: "50%",
      transform: "translateX(-50%)",
      width: "min(430px, 100vw)",
      background: "#1a1a2e",
      borderTop: "1px solid #2a2a3e",
      display: "flex",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 8px)",
    },
    tab: (active, hovered) => ({
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "10px 0 8px",
      cursor: "pointer",
      color: active ? "#FF6B35" : hovered ? "#aaa" : "#555",
      fontSize: 10, fontWeight: active ? 700 : 500,
      transition: "color 0.15s",
      gap: 4,
      userSelect: "none",
    }),
    tabIcon: (active) => ({
      fontSize: 22,
      filter: active ? "drop-shadow(0 0 6px #FF6B35)" : "none",
      transition: "filter 0.15s",
    }),
    section: { padding: "20px 16px 8px" },
    sectionTitle: { fontSize: 18, fontWeight: 800, marginBottom: 14, color: "#fff" },
    input: {
      background: "#2a2a3e", border: "1px solid #3a3a5e",
      borderRadius: 10, padding: "10px 14px",
      color: "#fff", fontSize: 14, width: "100%",
      outline: "none", boxSizing: "border-box",
    },
    chip: (active) => ({
      background: active ? "#FF6B35" : "#2a2a3e",
      color: active ? "#fff" : "#aaa",
      border: "none", borderRadius: 20, padding: "6px 14px",
      fontSize: 12, cursor: "pointer", fontWeight: 600,
      whiteSpace: "nowrap",
    }),
    exerciseRow: {
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", borderBottom: "1px solid #1e1e32",
      cursor: "pointer",
    },
    exerciseIcon: {
      width: 44, height: 44, borderRadius: 12,
      background: "#2a2a3e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, flexShrink: 0,
    },
    setRow: {
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 0", borderBottom: "1px solid #1e1e32",
    },
    setNum: {
      width: 28, height: 28, borderRadius: 6,
      background: "#2a2a3e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, color: "#888", flexShrink: 0,
    },
    setInput: {
      background: "#2a2a3e", border: "none", borderRadius: 8,
      padding: "6px 8px", color: "#fff", fontSize: 14,
      width: 60, textAlign: "center", outline: "none",
    },
    checkBtn: (done) => ({
      width: 32, height: 32, borderRadius: 8,
      background: done ? "#FF6B35" : "#2a2a3e",
      border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, color: done ? "#fff" : "#444",
      flexShrink: 0, transition: "background 0.2s",
    }),
    proCard: {
      background: "linear-gradient(135deg, #FF6B35 0%, #e85d25 100%)",
      borderRadius: 16, padding: "20px 18px",
      marginBottom: 16,
    },
  };

  // ── TABS CONTENT ──────────────────────────────────────────────────────────────

  // INICIO
  const renderInicio = () => (
    <div>
      <div style={S.header}>
        <div style={S.headerRow}>
          <div>
            <div style={S.logo}>hevy</div>
            <div style={S.logoSub}>Workout Tracker</div>
          </div>
          <img src={MOCK_USER.avatar} alt="avatar" style={S.avatar} />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, color: "#888" }}>Bienvenido de vuelta,</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{MOCK_USER.name} 👋</div>
        </div>
        {/* Stats Row */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[
            { num: MOCK_USER.workouts, label: "Entrenos" },
            { num: "12", label: "Esta semana" },
            { num: "87%", label: "Consistencia" },
          ].map((s, i) => (
            <div key={i} style={S.statBox}>
              <div style={S.statNum}>{s.num}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.section}>
        {/* Quick start */}
        <div style={S.sectionTitle}>Iniciar Entrenamiento</div>
        <button style={S.btn} onClick={() => setActiveTab("rutinas")}>
          + Nuevo Entrenamiento
        </button>
        <div style={{ height: 8 }} />

        {/* Rutinas rápidas */}
        <div style={{ fontSize: 14, color: "#888", marginBottom: 10 }}>Rutinas recientes</div>
        {ROUTINES_MOCK.map(r => (
          <div key={r.id} style={{ ...S.card, borderLeft: `4px solid ${r.color}`, cursor: "pointer" }}
            onClick={() => startWorkout(r)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={S.cardTitle}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  {r.exercises.length} ejercicios · {r.lastUsed}
                </div>
              </div>
              <div style={{
                background: r.color + "22", color: r.color,
                borderRadius: 8, padding: "6px 10px", fontSize: 20,
              }}>▶</div>
            </div>
          </div>
        ))}

        {/* Historial reciente */}
        <div style={{ ...S.sectionTitle, marginTop: 20 }}>Historial Reciente</div>
        {WORKOUT_HISTORY.slice(0, 3).map(w => (
          <div key={w.id} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, color: "#888" }}>{w.date}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{w.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#FF6B35", fontWeight: 600 }}>{w.duration}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{w.volume}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <span style={{ ...S.badge, background: "#2a2a3e", color: "#888" }}>{w.sets} series</span>
              <span style={{ ...S.badge, background: "#2a2a3e", color: "#888" }}>{w.volume}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ENTRENO ACTIVO
  const renderEntreno = () => {
    if (!activeWorkout) return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 60 }}>🏋️</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>Sin entrenamiento activo</div>
        <div style={{ color: "#888", marginTop: 8, fontSize: 14 }}>
          Ve a Rutinas para comenzar un entrenamiento
        </div>
        <button style={{ ...S.btn, marginTop: 24 }} onClick={() => setActiveTab("rutinas")}>
          Ver Rutinas
        </button>
      </div>
    );

    const totalSets = workoutExercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const doneSets = workoutExercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.done).length, 0);
    const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;

    return (
      <div>
        {/* Header del entrenamiento */}
        <div style={{ ...S.header, paddingTop: 52 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "#888" }}>Entrenando ahora</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{activeWorkout.name}</div>
            </div>
            <div style={{
              background: "#FF6B35", borderRadius: 10,
              padding: "8px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{formatTime(workoutTime)}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>TIEMPO</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
              <span>{doneSets}/{totalSets} series completadas</span>
              <span>{pct}%</span>
            </div>
            <div style={{ background: "#2a2a3e", borderRadius: 6, height: 6 }}>
              <div style={{
                background: "#FF6B35", borderRadius: 6, height: 6,
                width: `${pct}%`, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          {/* Botón cronómetro descanso */}
          <button
            onClick={() => setShowRestTimer(true)}
            style={{ ...S.btnSecondary, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            ⏱ Temporizador de Descanso
          </button>

          {workoutExercises.map((ex, ei) => (
            <div key={ei} style={{ ...S.card, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ ...S.exerciseIcon, background: activeWorkout.color + "22" }}>
                  {ex.exercise?.icon || "💪"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.exercise?.name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{ex.exercise?.muscle} · {ex.exercise?.equipment}</div>
                </div>
              </div>

              {/* Set headers */}
              <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#555", paddingBottom: 6, borderBottom: "1px solid #2a2a3e" }}>
                <div style={{ width: 28 }}>SET</div>
                <div style={{ flex: 1, textAlign: "center" }}>KG</div>
                <div style={{ flex: 1, textAlign: "center" }}>REPS</div>
                <div style={{ width: 32 }}></div>
              </div>

              {ex.sets.map((set, si) => (
                <div key={si} style={S.setRow}>
                  <div style={{ ...S.setNum, background: set.done ? "#FF6B35" : "#2a2a3e", color: set.done ? "#fff" : "#888" }}>
                    {si + 1}
                  </div>
                  <input
                    type="number"
                    defaultValue={set.weight}
                    style={S.setInput}
                    // TODO: Actualizar valor en estado al cambiar
                  />
                  <input
                    type="number"
                    defaultValue={set.reps}
                    style={S.setInput}
                    // TODO: Actualizar valor en estado al cambiar
                  />
                  <button
                    style={S.checkBtn(set.done)}
                    onClick={() => toggleSetDone(ei, si)}>
                    {set.done ? "✓" : "○"}
                  </button>
                </div>
              ))}

              <button style={{ ...S.btnSecondary, marginTop: 10, fontSize: 13, padding: "8px 14px" }}
                onClick={() => {
                  // TODO: Implementar añadir serie al ejercicio actual
                  alert("Funcionalidad: añadir serie extra");
                }}>
                + Añadir Serie
              </button>
            </div>
          ))}

          <button style={{ ...S.btnSecondary, marginBottom: 10 }}
            onClick={() => setShowAddExercise(true)}>
            + Añadir Ejercicio
          </button>

          <button style={{ ...S.btn, background: "#22c55e" }} onClick={finishWorkout}>
            🏁 Finalizar Entrenamiento
          </button>
          <button style={{ ...S.btnSecondary, marginTop: 8 }}
            onClick={() => {
              if (window.confirm("¿Cancelar entrenamiento? Se perderán los datos.")) {
                setWorkoutRunning(false);
                setActiveWorkout(null);
                setWorkoutExercises([]);
                setWorkoutTime(0);
                setActiveTab("inicio");
              }
            }}>
            Cancelar Entrenamiento
          </button>
        </div>
      </div>
    );
  };

  // RUTINAS
  const renderRutinas = () => (
    <div>
      <div style={S.header}>
        <div style={S.headerRow}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Mis Rutinas</div>
          <span style={S.badge}>PRO</span>
        </div>
      </div>
      <div style={S.section}>
        <button style={S.btn} onClick={() => {
          // TODO: Implementar creación de rutinas personalizadas
          alert("🔜 Crear nueva rutina — Próximamente con Hevy PRO");
        }}>
          + Crear Nueva Rutina
        </button>

        <div style={{ marginTop: 20 }}>
          {ROUTINES_MOCK.map(r => {
            const totalExercises = r.exercises.length;
            const totalSets = r.exercises.reduce((a, e) => a + e.sets.length, 0);
            return (
              <div key={r.id} style={{ ...S.card, borderLeft: `4px solid ${r.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={S.cardTitle}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {totalExercises} ejercicios · {totalSets} series · {r.lastUsed}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                      {r.exercises.slice(0, 3).map((re, i) => {
                        const ex = EXERCISES_DB.find(e => e.id === re.exerciseId);
                        return (
                          <span key={i} style={{
                            background: "#2a2a3e", borderRadius: 6,
                            padding: "3px 8px", fontSize: 11, color: "#aaa",
                          }}>{ex?.name}</span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button style={{ ...S.btn, flex: 2, padding: "10px" }}
                    onClick={() => startWorkout(r)}>
                    ▶ Iniciar
                  </button>
                  <button style={{ ...S.btnSecondary, flex: 1, padding: "10px" }}
                    onClick={() => {
                      // TODO: Implementar edición de rutina
                      alert("✏️ Editar rutina — Próximamente");
                    }}>
                    ✏️ Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PRO Banner */}
        <div style={S.proCard}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>✨ Hevy PRO</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
            Rutinas ilimitadas, historial de gráficas completo, ejercicios personalizados y más.
          </div>
          <button style={{
            marginTop: 14, background: "#fff", color: "#FF6B35",
            border: "none", borderRadius: 10, padding: "10px 20px",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
            onClick={() => {
              // TODO: Implementar pago/suscripción PRO
              alert("💳 Suscripción PRO — Funcionalidad pendiente");
            }}>
            Probar PRO Gratis
          </button>
        </div>
      </div>
    </div>
  );

  // PROGRESO
  const renderProgreso = () => {
    const charts = {
      benchPress: { label: "Press de Banca", data: PROGRESS_DATA.benchPress, color: "#FF6B35" },
      squat: { label: "Sentadilla", data: PROGRESS_DATA.squat, color: "#4ECDC4" },
      deadlift: { label: "Peso Muerto", data: PROGRESS_DATA.deadlift, color: "#A855F7" },
    };
    const current = charts[progressTab];
    const maxVal = Math.max(...current.data);
    const minVal = Math.min(...current.data);
    const gain = current.data[current.data.length - 1] - current.data[0];

    return (
      <div>
        <div style={S.header}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Mi Progreso</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            Últimos 9 meses
          </div>
        </div>
        <div style={S.section}>
          {/* Selector de ejercicio */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
            {Object.entries(charts).map(([key, val]) => (
              <button key={key} style={S.chip(progressTab === key)}
                onClick={() => setProgressTab(key)}>
                {val.label}
              </button>
            ))}
          </div>

          {/* Chart card */}
          <div style={{ ...S.card, padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: "#888" }}>{current.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: current.color }}>
                  {maxVal} kg
                </div>
                <div style={{ fontSize: 12, color: "#22c55e" }}>+{gain} kg ganados</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#888" }}>Inicio</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{minVal} kg</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Actual</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{current.data[current.data.length - 1]} kg</div>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <MiniLineChart data={current.data} color={current.color} width={340} height={100} />
            </div>
            {/* X axis labels */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 6, fontSize: 10, color: "#555",
            }}>
              {PROGRESS_DATA.labels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>

          {/* Medidas corporales */}
          <div style={{ ...S.sectionTitle, marginTop: 20 }}>Medidas Corporales</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { key: "peso", label: "Peso", unit: "kg", icon: "⚖️" },
              { key: "cintura", label: "Cintura", unit: "cm", icon: "📏" },
              { key: "cadera", label: "Cadera", unit: "cm", icon: "📐" },
              { key: "brazo", label: "Brazo", unit: "cm", icon: "💪" },
            ].map(m => (
              <div key={m.key} style={{ ...S.card, padding: "14px" }}>
                <div style={{ fontSize: 18 }}>{m.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35", marginTop: 4 }}>
                  {measurements[m.key]}
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 400 }}> {m.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{m.label}</div>
              </div>
            ))}
          </div>
          <button style={S.btn} onClick={() => setShowMeasurementModal(true)}>
            + Registrar Medidas
          </button>

          {/* Estadísticas globales */}
          <div style={{ ...S.sectionTitle, marginTop: 20 }}>Estadísticas Totales</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { num: "87", label: "Entrenos totales", icon: "🏋️" },
              { num: "142h", label: "Tiempo total", icon: "⏱" },
              { num: "312k", label: "Kg levantados", icon: "📈" },
              { num: "847", label: "Series totales", icon: "🔄" },
            ].map((s, i) => (
              <div key={i} style={{ ...S.card, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#FF6B35" }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // EJERCICIOS
  const renderEjercicios = () => (
    <div>
      <div style={S.header}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Ejercicios</div>
        <div style={{ marginTop: 12 }}>
          <input
            style={S.input}
            placeholder="🔍 Buscar ejercicio o músculo..."
            value={searchExercise}
            onChange={e => setSearchExercise(e.target.value)}
          />
        </div>
      </div>
      <div>
        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px", borderBottom: "1px solid #1e1e32" }}>
          {["Todos", "Pecho", "Espalda", "Piernas", "Hombros", "Bíceps", "Tríceps"].map(cat => (
            <button key={cat}
              style={S.chip(searchExercise === "" && cat === "Todos" || searchExercise.toLowerCase() === cat.toLowerCase())}
              onClick={() => setSearchExercise(cat === "Todos" ? "" : cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ paddingBottom: 16 }}>
          {filteredExercises.map(ex => (
            <div key={ex.id} style={S.exerciseRow}
              onClick={() => setSelectedExercise(ex)}>
              <div style={{ ...S.exerciseIcon }}>
                {ex.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  {ex.muscle} · {ex.equipment}
                </div>
              </div>
              <div style={{
                background: "#2a2a3e", color: "#888",
                borderRadius: 6, padding: "4px 8px", fontSize: 11,
              }}>{ex.category}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 16px 16px" }}>
          <button style={S.btnSecondary} onClick={() => {
            // TODO: Implementar creación de ejercicio personalizado (PRO)
            alert("✨ Crear ejercicio personalizado — Requiere Hevy PRO");
          }}>
            + Crear Ejercicio Personalizado
          </button>
        </div>
      </div>

      {/* Modal ejercicio */}
      {selectedExercise && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}
          onClick={() => setSelectedExercise(null)}>
          <div style={{
            background: "#1a1a2e", borderRadius: "20px 20px 0 0",
            padding: "24px 20px 40px",
          }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#3a3a5e", borderRadius: 4, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ ...S.exerciseIcon, width: 56, height: 56, fontSize: 28, background: "#FF6B3522" }}>
                {selectedExercise.icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{selectedExercise.name}</div>
                <div style={{ fontSize: 13, color: "#888" }}>
                  {selectedExercise.muscle} · {selectedExercise.equipment}
                </div>
              </div>
            </div>

            {/* TODO: Mostrar video de demostración del ejercicio */}
            <div style={{
              background: "#2a2a3e", borderRadius: 12, height: 160,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, flexDirection: "column", gap: 8,
            }}>
              <div style={{ fontSize: 40 }}>▶️</div>
              <div style={{ fontSize: 13, color: "#888" }}>Video demostrativo</div>
              <div style={{ fontSize: 11, color: "#555" }}>// TODO: Integrar videos de ejercicios</div>
            </div>

            <div style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6, marginBottom: 20 }}>
              {/* TODO: Mostrar descripción real del ejercicio */}
              Ejercicio de <strong style={{ color: "#fff" }}>{selectedExercise.muscle}</strong> usando
              {" "}<strong style={{ color: "#fff" }}>{selectedExercise.equipment}</strong>. Categoría: {selectedExercise.category}.
            </div>

            <button style={S.btn} onClick={() => {
              setSelectedExercise(null);
              if (activeWorkout) setActiveTab("entreno");
            }}>
              {activeWorkout ? "Añadir al Entrenamiento Actual" : "Usar en Nuevo Entrenamiento"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // COMUNIDAD
  const renderComunidad = () => (
    <div>
      <div style={S.header}>
        <div style={S.headerRow}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Comunidad</div>
          <button style={{ background: "none", border: "none", color: "#FF6B35", cursor: "pointer", fontSize: 22 }}>
            👥
          </button>
        </div>
        {/* Profile mini */}
        <div style={{ ...S.card, marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
          <img src={MOCK_USER.avatar} alt="" style={{ ...S.avatar, width: 50, height: 50 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{MOCK_USER.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{MOCK_USER.username}</div>
          </div>
          <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#FF6B35" }}>{MOCK_USER.followers}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Seguidores</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{MOCK_USER.following}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Siguiendo</div>
            </div>
          </div>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Feed de Actividad</div>
        {feed.map(post => (
          <div key={post.id} style={{ ...S.card, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src={post.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{post.user}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{post.username} · {post.time}</div>
              </div>
              <button style={{ background: "#2a2a3e", border: "none", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>
                + Seguir
              </button>
            </div>

            <div style={{ background: "#12122a", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FF6B35" }}>{post.workout}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                {[
                  { icon: "⏱", val: post.duration },
                  { icon: "🔄", val: `${post.sets} series` },
                  { icon: "⚖️", val: post.volume },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, color: "#ccc" }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => toggleLike(post.id)}
                style={{
                  background: post.liked ? "#FF6B3522" : "#2a2a3e",
                  color: post.liked ? "#FF6B35" : "#888",
                  border: "none", borderRadius: 8,
                  padding: "8px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 600,
                  transition: "all 0.2s",
                }}>
                {post.liked ? "❤️" : "🤍"} {post.likes}
              </button>
              <button style={{
                background: "#2a2a3e", color: "#888",
                border: "none", borderRadius: 8,
                padding: "8px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13,
              }}>
                💬 {post.comments}
              </button>
              <button style={{
                background: "#2a2a3e", color: "#888",
                border: "none", borderRadius: 8,
                padding: "8px 14px", cursor: "pointer",
                fontSize: 13, marginLeft: "auto",
              }}
                onClick={() => {
                  // TODO: Implementar copiar entrenamiento de otro usuario
                  alert("📋 ¡Entrenamiento copiado a tus rutinas! (Funcionalidad PRO)");
                }}>
                📋 Copiar
              </button>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", padding: "16px 0", color: "#555", fontSize: 13 }}>
          {/* TODO: Implementar carga infinita del feed */}
          Únete a la comunidad · +10M usuarios activos
        </div>
      </div>
    </div>
  );

  // ── Modal: Medidas
  const MeasurementModal = () => {
    const [vals, setVals] = useState({ ...measurements });
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }} onClick={() => setShowMeasurementModal(false)}>
        <div style={{
          background: "#1a1a2e", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px",
        }} onClick={e => e.stopPropagation()}>
          <div style={{ width: 40, height: 4, background: "#3a3a5e", borderRadius: 4, margin: "0 auto 20px" }} />
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Registrar Medidas</div>
          {[
            { key: "peso", label: "Peso (kg)", icon: "⚖️" },
            { key: "cintura", label: "Cintura (cm)", icon: "📏" },
            { key: "cadera", label: "Cadera (cm)", icon: "📐" },
            { key: "brazo", label: "Brazo (cm)", icon: "💪" },
          ].map(m => (
            <div key={m.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 6 }}>
                {m.icon} {m.label}
              </label>
              <input
                type="number"
                value={vals[m.key]}
                onChange={e => setVals({ ...vals, [m.key]: Number(e.target.value) })}
                style={S.input}
              />
            </div>
          ))}
          <button style={S.btn} onClick={() => {
            setMeasurements(vals);
            setShowMeasurementModal(false);
          }}>Guardar Medidas</button>
        </div>
      </div>
    );
  };

  // ── Modal: Añadir ejercicio al entreno activo
  const AddExerciseModal = () => (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
      zIndex: 300, display: "flex", flexDirection: "column",
    }} onClick={() => setShowAddExercise(false)}>
      <div style={{
        background: "#1a1a2e", flex: 1, marginTop: 60,
        borderRadius: "20px 20px 0 0", padding: "20px 0",
        overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "0 16px 12px", borderBottom: "1px solid #2a2a3e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Añadir Ejercicio</div>
            <button onClick={() => setShowAddExercise(false)}
              style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>
          <input
            style={S.input}
            placeholder="🔍 Buscar ejercicio..."
            value={searchExercise}
            onChange={e => setSearchExercise(e.target.value)}
          />
        </div>
        {EXERCISES_DB.filter(e =>
          e.name.toLowerCase().includes(searchExercise.toLowerCase()) ||
          e.muscle.toLowerCase().includes(searchExercise.toLowerCase())
        ).map(ex => (
          <div key={ex.id} style={S.exerciseRow}
            onClick={() => {
              setWorkoutExercises(prev => [...prev, {
                exerciseId: ex.id,
                exercise: ex,
                sets: [{ reps: 10, weight: 0, done: false }],
              }]);
              setShowAddExercise(false);
            }}>
            <div style={S.exerciseIcon}>{ex.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{ex.muscle} · {ex.equipment}</div>
            </div>
            <div style={{ color: "#FF6B35", fontSize: 20 }}>+</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TAB DEFINITIONS ──
  const tabs = [
    { id: "inicio", label: "Inicio", icon: "🏠" },
    { id: "entreno", label: "Entreno", icon: activeWorkout ? "🔥" : "🏋️" },
    { id: "rutinas", label: "Rutinas", icon: "📋" },
    { id: "progreso", label: "Progreso", icon: "📈" },
    { id: "ejercicios", label: "Ejercicios", icon: "💪" },
    { id: "comunidad", label: "Social", icon: "👥" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "inicio": return renderInicio();
      case "entreno": return renderEntreno();
      case "rutinas": return renderRutinas();
      case "progreso": return renderProgreso();
      case "ejercicios": return renderEjercicios();
      case "comunidad": return renderComunidad();
      default: return renderInicio();
    }
  };

  return (
    <div style={S.app}>
      {/* Content */}
      <div style={{ overflowY: "auto", height: "100vh", paddingBottom: 80 }}>
        {renderContent()}
      </div>

      {/* Workout Active Banner */}
      {activeWorkout && activeTab !== "entreno" && (
        <div
          onClick={() => setActiveTab("entreno")}
          style={{
            position: "fixed", bottom: 70, left: "50%", transform: "translateX(-50%)",
            width: "min(398px, calc(100vw - 32px))",
            background: "linear-gradient(90deg, #FF6B35, #e85d25)",
            borderRadius: 14, padding: "10px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", zIndex: 99,
            boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Entrenamiento activo</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{formatTime(workoutTime)}</div>
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Volver →</span>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav style={S.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={S.tab(activeTab === tab.id, hoveredTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}>
            <span style={S.tabIcon(activeTab === tab.id)}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Rest Timer Overlay */}
      {showRestTimer && <RestTimer onClose={() => setShowRestTimer(false)} />}

      {/* Measurement Modal */}
      {showMeasurementModal && <MeasurementModal />}

      {/* Add Exercise Modal */}
      {showAddExercise && <AddExerciseModal />}
    </div>
  );
}
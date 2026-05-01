'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ===== DATA =====
const SHOP_PLANTS = [
  { id: 'peonia', emoji: '🌺', name: 'Peonía', cost: 40, desc: 'Símbolo de prosperidad y sanación', waterEvery: 24, waterCost: 7 },
  { id: 'lirio', emoji: '💐', name: 'Lirio', cost: 45, desc: 'Pureza y renovación', waterEvery: 20, waterCost: 8 },
  { id: 'granada', emoji: '🌹', name: 'Flor de granada', cost: 55, desc: 'Fertilidad y abundancia', waterEvery: 28, waterCost: 9 },
  { id: 'loto', emoji: '🪷', name: 'Flor de loto', cost: 70, desc: 'Renace cada mañana del agua', waterEvery: 16, waterCost: 10 },
  { id: 'tulipan', emoji: '🌷', name: 'Tulipán', cost: 35, desc: 'Amor perfecto y nuevo comienzo', waterEvery: 18, waterCost: 6 },
  { id: 'cactus', emoji: '🌵', name: 'Cactus', cost: 25, desc: 'Resistente y noble, siempre ahí', waterEvery: 48, waterCost: 4 },
  { id: 'suculenta', emoji: '🪴', name: 'Suculenta', cost: 30, desc: 'Pequeña y tenaz', waterEvery: 36, waterCost: 5 },
  { id: 'girasol', emoji: '🌻', name: 'Girasol', cost: 50, desc: 'Siempre mirando al sol', waterEvery: 22, waterCost: 8 }
];

const CURIOSIDADES = [
  { id: 'c1', cat: 'griegos', catColor: '#534AB7', emoji: '🏛️', title: 'La peonía lleva el nombre de un dios', body: 'Peón era el médico de los dioses olímpicos. Según el mito, usó la flor para sanar a Plutón de una herida. Por envidia, Asclepio intentó matarlo — y Zeus lo convirtió en la flor para protegerlo.' },
  { id: 'c2', cat: 'plantas', catColor: '#0F6E56', emoji: '🪷', title: 'El loto nunca toca el barro que lo nutre', body: 'La flor de loto emerge limpia del fango cada mañana. Los egipcios la usaron como símbolo del sol y la resurrección.' },
  { id: 'c3', cat: 'historia', catColor: '#993C1D', emoji: '🌍', title: 'Los tulipanes casi arruinaron a Holanda', body: 'En 1637, un solo bulbo de tulipán llegó a costar más que una casa en Ámsterdam. La fiebre especulativa se llamó Tulipomania.' },
  { id: 'c4', cat: 'griegos', catColor: '#534AB7', emoji: '⚡', title: 'Perséfone y la granada: el origen de las estaciones', body: 'Cuando Perséfone comió seis semillas de granada en el inframundo, quedó atada a pasar seis meses bajo tierra. Cada primavera que vuelve, el mundo florece.' },
  { id: 'c5', cat: 'plantas', catColor: '#0F6E56', emoji: '🌸', title: 'Las peonías pueden vivir cien años', body: 'Una peonía bien plantada puede florecer durante un siglo sin ser trasplantada. Sus raíces contienen paeoniflorina, usada para calmar la ansiedad.' },
  { id: 'c6', cat: 'historia', catColor: '#993C1D', emoji: '🏺', title: 'Los griegos creían que las flores pensaban', body: 'Teofrasto escribió el primer tratado botánico del mundo. Describió más de 500 plantas y sostuvo que tenían una forma de alma vegetativa.' },
  { id: 'c7', cat: 'griegos', catColor: '#534AB7', emoji: '🌿', title: 'El lirio era la flor favorita de Hera', body: 'Según el mito, los lirios nacieron de la leche que Hera derramó. Las gotas que cayeron al cielo formaron la Vía Láctea.' },
  { id: 'c8', cat: 'plantas', catColor: '#0F6E56', emoji: '🌺', title: 'Las flores se comunican por el suelo', body: 'Las plantas emiten señales químicas a través de redes de hongos subterráneos llamadas micorrizas o "internet del bosque".' },
];

const MOODS = ["Cansada", "Ansiosa", "Triste", "Sin motivación", "Feliz", "Estresada", "Enojada"];
const PLACEHOLDERS = {
  Feliz: "¿Qué encendió tu chispa hoy? Cuéntame ese destello...",
  Ansiosa: "Sácalo todo aquí, vacía tu sistema... No hay juicio.",
  Estresada: "Sácalo todo aquí, vacía tu sistema... No hay juicio.",
  Enojada: "Sácalo todo aquí, vacía tu sistema... No hay juicio.",
  Cansada: "Cuéntame qué te pesa, te escucho... Aquí puedes descansar.",
  Triste: "Cuéntame qué te pesa, te escucho... Aquí puedes descansar.",
  "Sin motivación": "Cuéntame qué te pesa, te escucho... Aquí puedes descansar."
};

// ===== MAIN APP =====
export default function Home() {
  const [activeTab, setActiveTab] = useState('tareas');
  const [xp, setXp] = useState(0);
  const [toast, setToast] = useState(null);
  const [globalMood, setGlobalMood] = useState('Feliz');
  const [mounted, setMounted] = useState(false);

  // Mark as mounted (prevents hydration mismatch)
  useEffect(() => { setMounted(true); }, []);

  // Load XP on mount
  useEffect(() => {
    supabase.from('user_stats').select('xp_total').eq('id', 1).single().then(({ data, error }) => {
      if (data && !error) setXp(data.xp_total);
    }).catch(() => { });
  }, []);

  const addXp = useCallback(async (n) => {
    const newXp = xp + n;
    setXp(newXp);
    try { await supabase.from('user_stats').update({ xp_total: newXp }).eq('id', 1); } catch (e) { }
  }, [xp]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const tabs = [
    { id: 'tareas', icon: '✏️', label: 'Tareas' },
    { id: 'jardin', icon: '🌸', label: 'Jardín' },
    { id: 'saber', icon: '✨', label: 'Saber' },
    { id: 'doctor', icon: '💊', label: 'Doctor' },
    { id: 'logros', icon: '⭐', label: 'Logros' }
  ];

  // Prevent hydration mismatch - show nothing until mounted
  if (!mounted) return <div id="app"><div className="hero"><span className="hero-icon">🌸</span><h1>Hola, Sara 🌸</h1><p>Cargando tu jardín...</p></div></div>;

  return (
    <div id="app">
      {/* Hero */}
      <div className="hero">
        <span className="hero-icon">🌸</span>
        <h1>Hola, Sara 🌸</h1>
        <p>Un pasito a la vez. Sin prisa, sin culpa.</p>
      </div>

      {/* XP Bar */}
      <div className="xp-row">
        <span className="xp-label">💧 XP</span>
        <div className="xp-bar-wrap"><div className="xp-bar-fill" style={{ width: `${xp % 100}%` }} /></div>
        <span className="xp-val">{xp} XP</span>
      </div>

      {/* Tab Content */}
      {activeTab === 'tareas' && <TabTareas xp={xp} addXp={addXp} showToast={showToast} />}
      {activeTab === 'jardin' && <TabJardin xp={xp} addXp={addXp} showToast={showToast} globalMood={globalMood} />}
      {activeTab === 'saber' && <TabSaber xp={xp} addXp={addXp} showToast={showToast} />}
      {activeTab === 'doctor' && <TabDoctor showToast={showToast} globalMood={globalMood} setGlobalMood={setGlobalMood} />}
      {activeTab === 'logros' && <TabLogros xp={xp} addXp={addXp} showToast={showToast} />}

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {/* Toast */}
      {toast && <div className="toast-container"><div className="toast">{toast}</div></div>}
    </div>
  );
}

// ===== TAB: TAREAS =====
function TabTareas({ xp, addXp, showToast }) {
  const [taskInput, setTaskInput] = useState('');
  const [steps, setSteps] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [needsContext, setNeedsContext] = useState(false);
  const [contextQuestion, setContextQuestion] = useState('');
  const [contextAnswer, setContextAnswer] = useState('');
  const [originalTask, setOriginalTask] = useState('');
  const [celebration, setCelebration] = useState(null);
  const [analogMode, setAnalogMode] = useState(false);
  const [manualSteps, setManualSteps] = useState(['', '', '']);

  const breakTask = async (task, context) => {
    setLoading(true);
    setCelebration(null);
    setAnalogMode(false);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, context })
      });
      const data = await res.json();

      if (data.error) {
        setAnalogMode(true);
        setOriginalTask(task || taskInput);
      } else if (data.necesita_contexto && data.pregunta) {
        setNeedsContext(true);
        setContextQuestion(data.pregunta);
        setOriginalTask(task);
      } else if (data.pasos && data.pasos.length > 0) {
        setSteps(data.pasos.slice(0, 10));
        setStepIndex(0);
        setCompletedSteps([]);
        setNeedsContext(false);
        setCelebration('🌱 Lo rompimos en pedacitos, Sara. ¡Empieza por el primero!');
        setTimeout(() => setCelebration(null), 3000);
      } else {
        setAnalogMode(true);
        setOriginalTask(task || taskInput);
      }
    } catch (e) {
      setAnalogMode(true);
      setOriginalTask(taskInput);
    }
    setLoading(false);
  };

  const addManualStep = () => setManualSteps([...manualSteps, '']);
  const updateManualStep = (i, val) => { const n = [...manualSteps]; n[i] = val; setManualSteps(n); };

  const startManualSteps = () => {
    const filtered = manualSteps.filter(s => s.trim());
    if (filtered.length === 0) return;
    setSteps(filtered);
    setStepIndex(0);
    setCompletedSteps([]);
    setAnalogMode(false);
    setCelebration('🌱 ¡Tú lo rompiste solita, Sara! Empieza por el primero.');
    setTimeout(() => setCelebration(null), 3000);
  };

  const toggleStep = (i) => {
    if (i > stepIndex) return;
    if (completedSteps.includes(i)) {
      setCompletedSteps(completedSteps.filter(s => s !== i));
    } else {
      const newCompleted = [...completedSteps, i];
      setCompletedSteps(newCompleted);
      addXp(10);
      if (i === stepIndex && i < steps.length - 1) setStepIndex(stepIndex + 1);
      if (newCompleted.length === steps.length) {
        setCelebration('🎉 ¡Misión cumplida, Sara!');
      } else {
        const msgs = ['✨ Ese es el 1%. Ya empezaste.', '💪 Sigue a tu ritmo, Sara.', '🌟 Cada pasito cuenta.', '🎵 Pequeño logro, grande tú.'];
        setCelebration(msgs[Math.floor(Math.random() * msgs.length)]);
        setTimeout(() => setCelebration(null), 3000);
      }
    }
  };

  const finishTask = async () => {
    await addXp(25);
    showToast('✨ ¡+25 XP! Has completado la tarea.');
    resetAll();
  };

  const resetAll = () => {
    setSteps(null); setNeedsContext(false); setAnalogMode(false);
    setManualSteps(['', '', '']); setCelebration(null); setCompletedSteps([]); setStepIndex(0);
  };

  const allDone = steps && completedSteps.length === steps.length;
  const pct = steps ? Math.round(completedSteps.length / steps.length * 100) : 0;

  return (
    <div className="section active">
      {/* Input */}
      {!steps && !needsContext && !analogMode && (
        <>
          <div className="input-row">
            <input value={taskInput} onChange={e => setTaskInput(e.target.value)} placeholder="¿Qué tarea tienes pendiente?" onKeyDown={e => e.key === 'Enter' && taskInput && breakTask(taskInput)} />
            <button className="btn-blue" onClick={() => taskInput && breakTask(taskInput)} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Romper'}
            </button>
          </div>
          <div className="empty-state"><span className="empty-icon">💭</span>Escribe algo que te pese<br />y lo rompemos en pedacitos.</div>
        </>
      )}

      {/* Clarification */}
      {needsContext && (
        <div className="card">
          <p style={{ fontSize: '13px', marginBottom: '10px' }}>🤔 <strong>{contextQuestion}</strong></p>
          <input className="input-field" value={contextAnswer} onChange={e => setContextAnswer(e.target.value)} placeholder="Ej: El escritorio, la cama..." style={{ marginBottom: '8px' }} />
          <button className="btn-blue" onClick={() => { if (contextAnswer) breakTask(originalTask, contextAnswer); }} disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="spinner" /> : 'Romper en pedacitos'}
          </button>
        </div>
      )}

      {/* ===== MODO SOBERANO — Analog Fallback ===== */}
      {analogMode && (
        <div className="card">
          <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>🧠 Modo Soberano — Rómpelo tú</p>
          <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px', lineHeight: '1.6' }}>
            La IA descansa, pero tú no la necesitas. Usa esta fórmula:
          </p>

          <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>📋 Fórmula de 3 preguntas:</p>
            <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.7' }}>
              <strong>1.</strong> ¿Qué es lo PRIMERO que toco con las manos?<br />
              <strong>2.</strong> ¿Qué hago DESPUÉS con eso?<br />
              <strong>3.</strong> ¿Cómo sé que TERMINÉ?
            </p>
          </div>

          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            Tu tarea: <em style={{ color: 'var(--blue)' }}>{originalTask}</em>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
            {manualSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text3)', minWidth: '18px' }}>{i + 1}.</span>
                <input
                  className="input-field"
                  value={s}
                  onChange={e => updateManualStep(i, e.target.value)}
                  placeholder={i === 0 ? 'Lo primero que toco...' : i === manualSteps.length - 1 ? 'Así sé que terminé...' : 'Después hago...'}
                  style={{ fontSize: '13px', padding: '8px 10px' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn-outline" onClick={addManualStep} style={{ fontSize: '11px', padding: '7px 12px' }}>+ Paso</button>
            <button className="btn-blue" onClick={startManualSteps} style={{ flex: 1 }}>¡Empezar!</button>
          </div>
          <button className="btn-outline" onClick={resetAll} style={{ width: '100%', marginTop: '8px', fontSize: '11px' }}>← Volver</button>
        </div>
      )}

      {/* Celebration */}
      {celebration && <div className="celebrate-msg">{celebration}</div>}

      {/* Steps */}
      {steps && (
        <div className="task-card">
          <div className="task-header">
            <div className="task-name">{taskInput || originalTask}</div>
            <div className="task-pct">{pct}%</div>
          </div>
          <div className="steps-list">
            {steps.map((s, i) => (
              <div key={i} className={`step-item ${completedSteps.includes(i) ? 'done' : ''} ${i > stepIndex ? 'locked' : ''}`} onClick={() => toggleStep(i)}>
                <div className="step-check">{completedSteps.includes(i) ? '✓' : ''}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="task-prog"><div className="task-prog-fill" style={{ width: `${pct}%` }} /></div>

          {allDone && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>🌟 ¡Misión cumplida, Sara!</p>
              <button className="btn-blue" onClick={finishTask} style={{ width: '100%' }}>Terminar tarea y ganar 25 XP</button>
            </div>
          )}

          {!allDone && (
            <button className="btn-outline" onClick={resetAll} style={{ width: '100%', marginTop: '8px', fontSize: '11px' }}>
              Cancelar tarea
            </button>
          )}
        </div>
      )}
    </div>

  );
}

// ===== TAB: JARDÍN =====
function TabJardin({ xp, addXp, showToast, globalMood }) {
  const [garden, setGarden] = useState([]);
  const [herbario, setHerbario] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isFloristOpen, setIsFloristOpen] = useState(false);
  const [floristMsg, setFloristMsg] = useState('¿Buscas algo especial hoy, Sara?');
  const [floristLoading, setFloristLoading] = useState(false);
  const [floristInput, setFloristInput] = useState('');
  const [recommendedPlant, setRecommendedPlant] = useState(null);
  const [hiddenPlants, setHiddenPlants] = useState([]);

  const [customPlants, setCustomPlants] = useState([]);

  useEffect(() => {
    supabase.from('garden').select('*').order('created_at').then(({ data, error }) => {
      if (data && !error) setGarden(data);
    }).catch(() => { });

    supabase.from('herbario').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (data && !error) setHerbario(data);
    }).catch(() => { });

    const storedHidden = JSON.parse(localStorage.getItem('hiddenPlants') || '[]');
    setHiddenPlants(storedHidden);
    
    const storedCustom = JSON.parse(localStorage.getItem('customPlants') || '[]');
    setCustomPlants(storedCustom);
  }, []);

  const ALL_PLANTS = [...SHOP_PLANTS, ...customPlants];

  const hidePlant = (plantId, e) => {
    e.preventDefault();
    if (confirm('¿Quieres ocultar esta flor para que no vuelva a aparecer en el catálogo?')) {
      const newHidden = [...hiddenPlants, plantId];
      setHiddenPlants(newHidden);
      localStorage.setItem('hiddenPlants', JSON.stringify(newHidden));
      showToast("Flor oculta. Ya no aparecerá.");
    }
  };

  const getStatus = (p) => {
    const def = ALL_PLANTS.find(x => x.id === p.plant_type);
    if (!def) return 'ok';
    const h = (Date.now() - new Date(p.last_watered).getTime()) / 3600000;
    if (p.health < 30) return 'wilted';
    if (h > def.waterEvery) return 'thirsty';
    return 'ok';
  };

  const waterPlant = async (plant) => {
    const def = ALL_PLANTS.find(x => x.id === plant.plant_type);
    if (!def) return;
    if (xp < def.waterCost) { showToast(`Necesitas ${def.waterCost} XP para regar 💧`); return; }
    const newHealth = Math.min(100, plant.health + 35);
    await addXp(-def.waterCost);
    await supabase.from('garden').update({ health: newHealth, last_watered: new Date().toISOString() }).eq('id', plant.id);
    setGarden(g => g.map(p => p.id === plant.id ? { ...p, health: newHealth, last_watered: new Date().toISOString() } : p));
    showToast(`💧 ${plant.name} te lo agradece, Sara.`);
  };

  const buyPlant = async (def) => {
    if (xp < def.cost) { showToast(`Necesitas ${def.cost} XP para esta flor 💧`); return; }
    if (garden.length >= 8) { showToast('Tu jardín está lleno 🌿'); return; }
    await addXp(-def.cost);
    const { data } = await supabase.from('garden').insert({ name: def.name, plant_type: def.id, health: 100, last_watered: new Date().toISOString() }).select().single();
    if (data) setGarden([...garden, data]);
    showToast(`¡${def.emoji} ${def.name} ahora vive en tu jardín!`);
  };

  const askFlorist = async () => {
    if (!floristInput.trim()) return;
    setFloristLoading(true);
    setRecommendedPlant(null);
    try {
      const res = await fetch('/api/florist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: floristInput, existingPlants: ALL_PLANTS })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.msg);

      setFloristMsg(`Sogory dice: "${data.msg}"`);
      
      if (data.isNew && data.newPlant) {
        setRecommendedPlant(data.newPlant);
      } else {
        const found = ALL_PLANTS.find(p => p.id === data.plantId);
        setRecommendedPlant(found || ALL_PLANTS[0]);
      }
      setFloristLoading(false);
    } catch (e) {
      const fallbackPlant = ALL_PLANTS.filter(p => !hiddenPlants.includes(p.id))[0] || ALL_PLANTS[0];
      setFloristMsg(`Sogory salió un momento a buscar agua. Pero yo te recomendaría un ${fallbackPlant?.name || 'Girasol'} para iluminar el día.`);
      setFloristLoading(false);
    }
  };

  const hoursAgo = (d) => Math.round((Date.now() - new Date(d).getTime()) / 3600000);

  return (
    <div className="section active">
      {garden.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">🪴</span>Tu jardín espera, Sara.<br />Gana XP y adopta tu primera flor.</div>
      ) : (
        <>
          <div className="section-label">Tu jardín</div>
          <div className="garden-grid">
            {garden.map(p => {
              const def = ALL_PLANTS.find(x => x.id === p.plant_type);
              const status = getStatus(p);
              const hColor = p.health > 60 ? '#1D9E75' : p.health > 30 ? '#EF9F27' : '#E24B4A';
              return (
                <div key={p.id} className={`garden-plant ${status}`} onClick={() => setSelectedPlant(p)}>
                  <span className="plant-big-emoji">{def?.emoji || '🌱'}</span>
                  <div className="plant-card-name">{p.name}</div>
                  <div className="plant-card-time">regada hace {hoursAgo(p.last_watered)}h</div>
                  <div className="health-bar-wrap"><div className="health-bar-fill" style={{ width: `${p.health}%`, background: hColor }} /></div>
                  <button className="water-btn" onClick={(e) => { e.stopPropagation(); setSelectedPlant(p); }}>
                    Cuidar 🌱
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="section-label" onClick={() => setIsShopOpen(!isShopOpen)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        <span>Catálogo de flores {isShopOpen ? '▼' : '▶'}</span>
        <span style={{ fontSize: '10px', fontWeight: 'normal', textTransform: 'none' }}>{isShopOpen ? 'Toca para cerrar' : 'Toca para abrir'}</span>
      </div>

      {isShopOpen && (
        <div className="shop-grid" style={{ animation: 'fadeIn 0.3s ease' }}>
          {SHOP_PLANTS.filter(p => !hiddenPlants.includes(p.id)).map(p => (
            <div key={p.id} className="shop-plant-card" onClick={() => buyPlant(p)} onContextMenu={(e) => hidePlant(p.id, e)}>
              <span className="shop-emoji">{p.emoji}</span>
              <div className="shop-name">{p.name}</div>
              <div className="shop-cost">{p.cost} XP</div>
              <div className="shop-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      )}

      <div className="section-label" onClick={() => setIsFloristOpen(!isFloristOpen)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        <span>Floreria33 {isFloristOpen ? '▼' : '▶'}</span>
        <span style={{ fontSize: '10px', fontWeight: 'normal', textTransform: 'none' }}>{isFloristOpen ? 'Toca para cerrar' : 'Toca para abrir'}</span>
      </div>

      {isFloristOpen && (
        <div className="card" style={{marginTop:'10px',background:'var(--bg2)',borderColor:'var(--blue)', animation: 'fadeIn 0.3s ease'}}>
          <div style={{fontSize:'12px',fontWeight:700,lineHeight:1.4,color:'var(--blue)'}}>
            👨‍🚀 ¡Hola! Te saluda Sogory
          </div>
          <p style={{ fontSize: '12px', marginTop: '8px', marginBottom: '10px', lineHeight: '1.4' }}>{floristMsg}</p>

          {!recommendedPlant ? (
            <div className="input-row" style={{ marginBottom: 0 }}>
              <input
                value={floristInput}
                onChange={e => setFloristInput(e.target.value)}
                placeholder="Encarga tu flor"
                style={{ fontSize: '12px', padding: '8px' }}
              />
              <button className="btn-blue" onClick={askFlorist} disabled={floristLoading} style={{ padding: '8px 12px' }}>
                {floristLoading ? <span className="spinner" /> : 'Preguntar'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '24px' }}>{recommendedPlant.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{recommendedPlant.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{recommendedPlant.cost} XP</div>
              </div>
              <button className="btn-blue" onClick={() => { 
                if (recommendedPlant && !ALL_PLANTS.find(x => x.id === recommendedPlant.id)) {
                  const newCustom = [...customPlants, recommendedPlant];
                  setCustomPlants(newCustom);
                  localStorage.setItem('customPlants', JSON.stringify(newCustom));
                }
                buyPlant(recommendedPlant); 
                setRecommendedPlant(null); 
                setFloristInput(''); 
              }} style={{ padding: '6px 10px', fontSize: '11px' }}>
                Adoptar
              </button>
              <button className="btn-outline" onClick={() => { setRecommendedPlant(null); setFloristInput(''); }} style={{ padding: '6px 10px', fontSize: '11px' }}>
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {herbario.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            🏺 Herbario de la Memoria
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {herbario.map(h => (
              <div key={h.id} className="log-entry">
                <div className="log-icon" style={{ fontSize: '24px' }}>{h.emoji || '🌱'}</div>
                <div className="log-text">
                  <strong style={{ color: 'var(--text)', fontSize: '14px' }}>{h.name}</strong>
                  <div style={{ marginTop: '4px', lineHeight: 1.4, color: 'var(--text2)' }}>
                    {h.relato_vida}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL TAMAGOTCHI */}
      {selectedPlant && <TamagotchiModal
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        xp={xp} addXp={addXp} showToast={showToast}
        globalMood={globalMood}
        setGarden={setGarden}
        setHerbario={setHerbario}
      />}
    </div>
  );
}

function TamagotchiModal({ plant, onClose, xp, addXp, showToast, globalMood, setGarden, setHerbario }) {
  const def = SHOP_PLANTS.find(x => x.id === plant.plant_type) || {};
  const emoji = def.emoji || '🌱';
  const name = plant.name || 'Planta Misteriosa';
  const hoursPassed = (Date.now() - new Date(plant.last_watered).getTime()) / 3600000;

  let statusMsg = "";
  if (globalMood === "Triste") statusMsg = "Mis espinas hoy son tu escudo, Sara. Respira conmigo.";
  else if (globalMood === "Feliz") statusMsg = "¡Qué rico solecito! Estoy vibrando con tu alegría.";
  else if (globalMood === "Ansiosa") statusMsg = "Siente mi calma, Sara. Yo solo crezco, sin prisas.";
  else if (globalMood === "Estresada") statusMsg = "Una gota a la vez, como mi riego. Todo estará bien.";
  else {
    if (plant.health === 0) statusMsg = "Estoy sequita... Necesito magia (Abono) para revivir.";
    else if (plant.health <= 20) statusMsg = "¡Tengo mucha sed! 🐛 Ayúdame a brillar.";
    else statusMsg = "¡Qué lindo día! Me encanta estar aquí contigo.";
  }

  let heart = "❤️"; let color = "#388e3c";
  if (plant.health === 0) { heart = "💔"; color = "#8b4513"; }
  else if (plant.health <= 40) { heart = "💛"; color = "#fbc02d"; }

  const handleWater = async () => {
    const cost = def.waterCost || 5;
    if (plant.health <= 0) { showToast("El agua no es suficiente. ¡Necesita abono!"); return; }
    if (xp < cost) { showToast(`Necesitas ${cost} XP para regar 💧`); return; }

    if (["Ansiosa", "Estresada", "Enojada", "Triste"].includes(globalMood)) {
      showToast(`🧘 Micro-Ritual: Refresca tu mente como a tu ${name}.`);
    } else {
      showToast("🚿 ¡Regando... plip plop! 💧");
    }

    const newHealth = 100;
    await addXp(-cost);
    await supabase.from('garden').update({ health: newHealth, last_watered: new Date().toISOString() }).eq('id', plant.id);
    setGarden(g => g.map(p => p.id === plant.id ? { ...p, health: newHealth, last_watered: new Date().toISOString() } : p));
    setTimeout(onClose, 1500);
  };

  const handleAbono = async () => {
    if (xp < 15) { showToast("Necesitas 15 XP para el Abono ✨"); return; }

    if (["Ansiosa", "Estresada", "Enojada", "Triste"].includes(globalMood)) {
      showToast(`✨ Micro-Ritual: Paciencia. Todo crece a su ritmo.`);
    } else {
      showToast("✨ ¡Magia aplicada! Tu planta crece con fuerza.");
    }

    await addXp(-15);
    const newHealth = 100;
    await supabase.from('garden').update({ health: newHealth, last_watered: new Date().toISOString() }).eq('id', plant.id);
    setGarden(g => g.map(p => p.id === plant.id ? { ...p, health: newHealth, last_watered: new Date().toISOString() } : p));
    setTimeout(onClose, 1500);
  };

  const handleHerbario = async () => {
    try {
      const { data } = await supabase.from('herbario').insert({
        name, emoji,
        relato_vida: `Cuidada con amor hasta su trasplante el ${new Date().toLocaleDateString()}.`
      }).select().single();

      if (data) {
        setHerbario(h => [data, ...h]);
      }

      await addXp(10);
      await supabase.from('garden').delete().eq('id', plant.id);

      setGarden(g => g.filter(p => p.id !== plant.id));
      showToast("¡Trasplantada con éxito al Herbario! +10 XP");
      onClose();
    } catch (e) {
      showToast("Error al trasplantar. ¿Existe la tabla herbario?");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', lineHeight: 1, marginBottom: '10px' }}>{emoji}</div>
          <h3 style={{ margin: 0, fontSize: '22px' }}>{name}</h3>

          <div className="modal-bubble">💭 "{statusMsg}"</div>

          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '40px' }}>{heart}</span>
            <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '5px' }}>
              Salud: {Math.round(plant.health)}% | Riego: hace {Math.floor(hoursPassed)}h {Math.round((hoursPassed % 1) * 60)}m
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={plant.health > 0 ? "btn-blue" : "btn-outline"} style={{ flex: 1, padding: '12px' }} onClick={handleWater}>
              Regar 🚿<br /><span style={{ fontSize: '10px', fontWeight: 'normal' }}>{def.waterCost || 5} XP</span>
            </button>
            <button className="btn-outline" style={{ flex: 1, padding: '12px', borderColor: '#fbc02d', color: '#fbc02d' }} onClick={handleAbono}>
              Abono ✨<br /><span style={{ fontSize: '10px', fontWeight: 'normal' }}>15 XP</span>
            </button>
            <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={handleHerbario} title="Trasplantar al Herbario">
              🏺<br /><span style={{ fontSize: '10px', fontWeight: 'normal' }}>Herbario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== TAB: SABER =====
function TabSaber({ addXp, showToast }) {
  const [activeCat, setActiveCat] = useState('todos');
  const [readCurios, setReadCurios] = useState([]);
  const [localCurios, setLocalCurios] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sara_read_curios') || '[]');
      setReadCurios(saved);
      // Solo cargar las que no se han leído
      const unreadStatic = CURIOSIDADES.filter(c => !saved.includes(c.id));
      setLocalCurios(unreadStatic);
    } catch (e) { }
  }, []);

  const readCurio = (id) => {
    if (readCurios.includes(id)) return;
    const newRead = [...readCurios, id];
    setReadCurios(newRead);
    localStorage.setItem('sara_read_curios', JSON.stringify(newRead));

    // Quitar de la pantalla
    setLocalCurios(prev => prev.filter(c => c.id !== id));

    addXp(15);
    showToast('✨ +15 XP — el saber también riega el jardín.');
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch('/api/knowledge', { method: 'POST' });
      const data = await res.json();
      if (data.curiosities && data.curiosities.length > 0) {
        // Asignar IDs únicos a los nuevos datos
        const newCurios = data.curiosities.map(c => ({ ...c, id: 'ai_' + Math.random().toString(36).substr(2, 9) }));
        setLocalCurios(prev => [...prev, ...newCurios]);
        showToast('✨ El universo te ha enviado más curiosidades.');
      } else {
        showToast('⏳ El oráculo está descansando. Intenta en un momento.');
      }
    } catch (e) {
      showToast('⏳ Error de conexión.');
    }
    setLoadingMore(false);
  };

  const cats = ['todos', 'griegos', 'plantas', 'historia'];
  const catLabels = { griegos: 'Griegos', plantas: 'Plantas', historia: 'Historia' };
  const filtered = activeCat === 'todos' ? localCurios : localCurios.filter(c => c.cat === activeCat);

  return (
    <div className="section active">
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {cats.map(c => (
          <button key={c} className={`curiosity-xp-btn ${activeCat === c ? '' : 'earned'}`} onClick={() => setActiveCat(c)} style={activeCat === c ? { background: 'var(--blue)', color: 'white', borderColor: 'var(--blue)' } : {}}>
            {c === 'todos' ? 'Todos' : catLabels[c]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ marginTop: '20px' }}>
          <span className="empty-icon">📖</span>
          Has leído todo por ahora.<br />Pide más conocimiento al universo.
        </div>
      )}

      {filtered.map(c => (
        <div key={c.id} className="curiosity-card">
          <div className="curiosity-cat" style={{ color: c.catColor }}>{c.emoji} {catLabels[c.cat] || c.cat}</div>
          <div className="curiosity-title">{c.title}</div>
          <div className="curiosity-body">{c.body}</div>
          <div className="curiosity-xp-btn" onClick={() => readCurio(c.id)}>
            ✨ Leí esto — +15 XP
          </div>
        </div>
      ))}

      <button className="btn-outline" onClick={loadMore} disabled={loadingMore} style={{ width: '100%', marginTop: '15px', padding: '15px' }}>
        {loadingMore ? <span className="spinner" /> : '✨ Pedir más datos al universo'}
      </button>
    </div>
  );
}

// ===== TAB: DOCTOR =====
function TabDoctor({ showToast, globalMood, setGlobalMood }) {
  const [relato, setRelato] = useState('');
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');

  const sendToDoctor = async (msgs) => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, mood: globalMood, contextoSuperacion: '' })
      });
      const data = await res.json();
      if (data.response) {
        const newMsgs = [...msgs, { role: 'assistant', content: data.response }];
        setMessages(newMsgs);
      }
    } catch (e) {
      showToast('Error en el sistema');
    }
    setLoading(false);
  };

  const startConversation = async () => {
    if (!relato.trim()) return;
    // Save to DB
    try {
      await supabase.from('registro_emocional_eje_gi').insert({
        emocion: globalMood, relato_usuario: relato, es_momento_luz: globalMood === 'Feliz'
      });
    } catch (e) { }

    const firstMsg = [{ role: 'user', content: `Me siento ${globalMood}. ${relato}` }];
    setMessages(firstMsg);
    setActive(true);
    await sendToDoctor(firstMsg);
  };

  const sendFollowUp = async () => {
    if (!followUp.trim()) return;
    const newMsgs = [...messages, { role: 'user', content: followUp }];
    setMessages(newMsgs);
    setFollowUp('');
    await sendToDoctor(newMsgs);
  };

  const resetConversation = () => {
    setMessages([]);
    setActive(false);
    setRelato('');
    setFollowUp('');
  };

  return (
    <div className="section active">
      {/* Mood selector */}
      <select className="select-field" value={globalMood} onChange={e => setGlobalMood(e.target.value)} style={{ marginBottom: '10px' }}>
        {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      {/* Initial text area */}
      {!active && (
        <>
          <textarea className="textarea-field" value={relato} onChange={e => setRelato(e.target.value)} placeholder={PLACEHOLDERS[globalMood]} style={{ marginBottom: '10px' }} />
          <button className="btn-blue" onClick={startConversation} disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="spinner" /> : 'Iniciar Conversatorio'}
          </button>
        </>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="chat-container" style={{ marginTop: '12px' }}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <span className="avatar">{m.role === 'user' ? '🌸' : '🌿'}</span>
              {m.content}
            </div>
          ))}
          {loading && <div className="chat-msg assistant"><span className="avatar">🌿</span><span className="spinner" /></div>}
        </div>
      )}

      {/* Follow-up input */}
      {active && !loading && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="input-field" value={followUp} onChange={e => setFollowUp(e.target.value)} placeholder="Escribe tu respuesta..." onKeyDown={e => e.key === 'Enter' && sendFollowUp()} style={{ flex: 1 }} />
          <button className="btn-blue" onClick={sendFollowUp}>Enviar</button>
        </div>
      )}

      {active && (
        <button className="btn-outline" onClick={resetConversation} style={{ width: '100%', marginTop: '8px', fontSize: '11px' }}>
          🔄 Nueva conversación
        </button>
      )}
    </div>
  );
}

// ===== TAB: LOGROS =====
function TabLogros({ addXp, showToast }) {
  const [logroText, setLogroText] = useState('');
  const [logros, setLogros] = useState([]);

  useEffect(() => {
    supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(20).then(({ data, error }) => {
      if (data && !error) setLogros(data);
    }).catch(() => { });
  }, []);

  const celebrate = async () => {
    if (!logroText.trim()) return;
    try {
      const { data } = await supabase.from('achievements').insert({
        description: logroText, xp: 15, created_at: new Date().toISOString()
      }).select().single();
      await addXp(15);
      if (data) setLogros([data, ...logros]);
      setLogroText('');
      showToast('🌟 ¡Bien hecho, Sara! +15 XP');
    } catch (e) {
      showToast('Error al guardar');
    }
  };

  return (
    <div className="section active">
      <div className="card">
        <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>⭐ ¿De qué te sientes orgullosa hoy?</p>
        <textarea className="textarea-field" value={logroText} onChange={e => setLogroText(e.target.value)} placeholder="Escribe aquí tu logro..." style={{ minHeight: '80px', marginBottom: '8px' }} />
        <button className="btn-blue" onClick={celebrate} style={{ width: '100%' }}>¡Me felicito! (+15 XP)</button>
      </div>

      {logros.length > 0 && (
        <>
          <div className="section-label" style={{ marginTop: '12px' }}>Logros recientes</div>
          {logros.map(l => (
            <div key={l.id} className="log-entry">
              <div className="log-icon">🌟</div>
              <div className="log-text">
                <strong>{l.description}</strong>
                <div className="log-time">{l.created_at?.slice(0, 10)} · +{l.xp || 15} XP</div>
              </div>
            </div>
          ))}
        </>
      )}

      {logros.length === 0 && (
        <div className="empty-state"><span className="empty-icon">🌟</span>Aquí guardaremos cada<br />pequeña victoria tuya, Sara.</div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { speak, cancel } from '@/lib/voice';
import { DEMO_ASSETS, DEMO_THREATS, generateTrafficData } from '@/lib/demo/assets';

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       '#07101C',
  panel:    '#0C1826',
  card:     '#101E2E',
  border:   '#1A2E44',
  cyan:     '#00E5FF',
  magenta:  '#FF2D78',
  green:    '#00FF88',
  yellow:   '#FFD600',
  red:      '#FF3131',
  text:     '#B8D0E8',
  dim:      '#3A5470',
  white:    '#E8F4FF',
};

const SEVERITY_COLOR = { critical: C.red, high: C.yellow, medium: C.magenta };
const STATUS_COLOR   = { operational: C.green, warning: C.yellow, critical: C.red };

const BOOT_LINES = [
  'Initializing secure handshake...',
  'Accessing encrypted sector Industrial_Alpha_01...',
  'PLC_01 status: OPERATIONAL',
  'PLC_02 status: WARNING — Latency detected',
  'Gateway_01 status: CRITICAL — Packet loss 15%',
  '[ALERT] Unauthorized Modbus write attempt detected from 10.0.0.45',
  '[INFO] Varo co-pilot ready for command input...',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function mono(text, color = C.cyan, size = '11px') {
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', color, fontSize: size }}>
      {text}
    </span>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      color: C.dim,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: '6px',
    }}>
      {children}
    </div>
  );
}

// ── Network traffic SVG chart ─────────────────────────────────────────────────
function TrafficChart({ data }) {
  const W = 560, H = 80;
  const max = 1000;
  const pts = (key) =>
    data.map((d, i) => [
      (i / (data.length - 1)) * W,
      H - (d[key] / max) * H,
    ]);

  const path = (points, close = false) => {
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    if (!close) return d;
    return `${d} L${W},${H} L0,${H} Z`;
  };

  const inPts  = pts('inbound');
  const outPts = pts('outbound');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '80px' }}>
      <defs>
        <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan}    stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.cyan}  stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.magenta}   stopOpacity="0.25" />
          <stop offset="100%" stopColor={C.magenta} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={path(inPts,  true)} fill="url(#gIn)"  />
      <path d={path(outPts, true)} fill="url(#gOut)" />
      <path d={path(inPts)}  stroke={C.cyan}    strokeWidth="1.5" fill="none" />
      <path d={path(outPts)} stroke={C.magenta} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ── Asset HUD overlay ─────────────────────────────────────────────────────────
function AssetHUD({ asset, onClose, voiceOn }) {
  useEffect(() => {
    if (voiceOn && asset) {
      speak(`Varo neural insight for ${asset.name}. ${asset.insight}`);
    }
    return () => cancel();
  }, [asset]);

  if (!asset) return null;

  const sc = STATUS_COLOR[asset.status];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(7,16,28,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: '520px', background: C.panel,
        border: `1px solid ${C.border}`, borderRadius: '4px',
        boxShadow: `0 0 40px rgba(0,229,255,0.1)`,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc, boxShadow: `0 0 6px ${sc}` }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: C.cyan, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>
              {asset.name.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>
              {asset.type} | {asset.location}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: '16px' }}>×</button>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* System Properties */}
          <div>
            <Label>System Properties</Label>
            {[['IP ADDRESS', asset.ip], ['MAC ADDRESS', asset.mac], ['FIRMWARE', asset.firmware], ['LAST SEEN', '1s ago']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.dim }}>{k}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.text }}>{v}</span>
              </div>
            ))}
            {asset.cves.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <Label>Detected CVEs</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {asset.cves.map(cve => (
                    <span key={cve} style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                      padding: '2px 6px', border: `1px solid ${C.magenta}`,
                      color: C.magenta, borderRadius: '2px',
                    }}>{cve}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div>
            <Label>Activity Logs</Label>
            {asset.logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50', marginTop: '3px', flexShrink: 0,
                  background: log.level === 'error' ? C.red : log.level === 'warn' ? C.yellow : C.green,
                }} />
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: C.dim }}>{log.time}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.text }}>{log.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Varo Neural Insight */}
        <div style={{ margin: '0 20px 20px', padding: '14px', background: 'rgba(0,229,255,0.04)', border: `1px solid rgba(0,229,255,0.15)`, borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.cyan, boxShadow: `0 0 6px ${C.cyan}` }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: C.cyan, letterSpacing: '0.1em' }}>VARO NEURAL INSIGHT</span>
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: C.text, lineHeight: '1.7', fontStyle: 'italic', margin: 0 }}>
            "{asset.insight}"
          </p>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: '8px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '8px', background: 'none', border: `1px solid ${C.border}`, color: C.dim, fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.1em' }}>
            CLOSE_HUD
          </button>
          <Link href="/incidents/new" style={{ flex: 1 }}>
            <button style={{ width: '100%', padding: '8px', background: 'none', border: `1px solid ${C.cyan}`, color: C.cyan, fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.1em' }}>
              ANALYSE_ALERT
            </button>
          </Link>
          <button style={{ flex: 1, padding: '8px', background: 'none', border: `1px solid ${C.magenta}`, color: C.magenta, fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.1em' }}>
            REMOTE_DIAG
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Terminal view ─────────────────────────────────────────────────────────────
function TerminalView() {
  const [lines, setLines] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const LOG_COLORS = { '[SYSTEM]': C.text, '[ALERT]': C.red, '[INFO]': C.cyan, '[WARN]': C.yellow };
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        const prefix = Object.keys(LOG_COLORS).find(p => line.startsWith(p)) || '[SYSTEM]';
        setLines(prev => [...prev, { text: line, color: LOG_COLORS[prefix] }]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div style={{ padding: '20px', height: '100%' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: C.cyan, letterSpacing: '0.1em', marginBottom: '16px' }}>
        {'>'} VARO_SECURE_SHELL V4.2
      </div>
      <div ref={ref} style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.color, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', lineHeight: '1.8' }}>
            {l.text}
          </div>
        ))}
        <div style={{ color: C.cyan, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
          root@aegis:~$ <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [view, setView]               = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [voiceOn, setVoiceOn]         = useState(true);
  const [booted, setBooted]           = useState(false);
  const [uptime, setUptime]           = useState('142:12:05');
  const trafficData = useMemo(() => generateTrafficData(), []);

  // Boot announcement
  useEffect(() => {
    if (!booted) {
      setBooted(true);
      setTimeout(() => {
        speak('Neural link established. Varo AI online. Threat level elevated. Three active threats require attention.');
      }, 800);
    }
  }, []);

  // Uptime ticker
  useEffect(() => {
    const [h, m, s] = uptime.split(':').map(Number);
    let total = h * 3600 + m * 60 + s;
    const t = setInterval(() => {
      total++;
      const hh = Math.floor(total / 3600);
      const mm = Math.floor((total % 3600) / 60);
      const ss = total % 60;
      setUptime(`${String(hh).padStart(3,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
    { id: 'assets',    icon: '◈', label: 'Assets' },
    { id: 'terminal',  icon: '▶', label: 'Terminal' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, color: C.text, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '40px', background: C.panel,
        borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: C.cyan, fontWeight: 700, letterSpacing: '0.15em', fontSize: '13px' }}>VARO</span>
          <span style={{ color: C.dim, fontSize: '10px', letterSpacing: '0.1em' }}>SECTOR: ENERGY_GRID_ALPHA</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {[
            ['DRONE_MODE',   'TRIGGER_SCENARIO', C.magenta],
            ['CPU LOAD',     '24.5%',            C.text],
            ['THREAT LEVEL', 'ELEVATED',         C.yellow],
            ['UPTIME',       uptime,             C.text],
            ['NEURAL LINK',  'STABLE ●',         C.green],
          ].map(([label, val, color]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: C.dim, letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontSize: '10px', color, letterSpacing: '0.05em' }}>{val}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
            <button
              onClick={() => { setVoiceOn(v => !v); if (voiceOn) cancel(); }}
              style={{ background: 'none', border: `1px solid ${voiceOn ? C.cyan : C.border}`, color: voiceOn ? C.cyan : C.dim, padding: '2px 8px', cursor: 'pointer', fontSize: '9px', letterSpacing: '0.1em' }}
            >
              {voiceOn ? '🔊 VOICE ON' : '🔇 VOICE OFF'}
            </button>
            <Link href="/incidents/new" style={{ border: `1px solid ${C.cyan}`, color: C.cyan, padding: '2px 10px', fontSize: '9px', letterSpacing: '0.1em', textDecoration: 'none' }}>
              + ANALYSE
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left nav */}
        <div style={{ width: '48px', background: C.panel, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px', gap: '4px', flexShrink: 0 }}>
          {navItems.map(n => (
            <button
              key={n.id}
              title={n.label}
              onClick={() => setView(n.id)}
              style={{
                width: '36px', height: '36px', background: view === n.id ? 'rgba(0,229,255,0.1)' : 'none',
                border: view === n.id ? `1px solid ${C.cyan}` : '1px solid transparent',
                color: view === n.id ? C.cyan : C.dim,
                cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {n.icon}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <Link href="/" style={{ marginBottom: '12px' }}>
            <button title="Back to Varo AI" style={{ width: '36px', height: '36px', background: 'none', border: '1px solid transparent', color: C.dim, cursor: 'pointer', fontSize: '14px' }}>⇐</button>
          </Link>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* ── DASHBOARD VIEW ───────────────────────────────────────────── */}
          {view === 'dashboard' && (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Intelligence summary */}
              <Panel title="VARO NEURAL INTELLIGENCE SUMMARY" icon="⬡">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: '11px', color: C.dim, fontStyle: 'italic', margin: 0 }}>
                    Intelligence core active. Monitoring {DEMO_ASSETS.length} assets across 2 sectors.
                  </p>
                  <div style={{ flexShrink: 0, marginLeft: '24px' }}>
                    <div style={{ fontSize: '9px', color: C.magenta, letterSpacing: '0.1em', marginBottom: '4px' }}>◆ PREDICTIVE ANALYSIS</div>
                    {['[1] Lateral movement detection', '[2] DNP3 master spoofing', '[3] Relay logic manipulation'].map(t => (
                      <div key={t} style={{ fontSize: '10px', color: C.text, lineHeight: '1.8' }}>{t}</div>
                    ))}
                  </div>
                </div>
              </Panel>

              {/* Traffic + threats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '12px' }}>
                <Panel title="NETWORK TRAFFIC (MB/S)" icon="⚡">
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', color: C.cyan }}>● INBOUND</span>
                    <span style={{ fontSize: '10px', color: C.magenta }}>● OUTBOUND</span>
                  </div>
                  <TrafficChart data={trafficData} />
                </Panel>

                <Panel title="RECENT THREATS" icon="⚠">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {DEMO_THREATS.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          if (voiceOn) speak(`${t.severity} severity. ${t.title}. Source: ${t.src}. Target: ${t.tgt}.`);
                        }}
                        style={{ padding: '8px', background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer' }}
                      >
                        <div style={{ fontSize: '9px', color: SEVERITY_COLOR[t.severity], letterSpacing: '0.1em', marginBottom: '2px' }}>
                          {t.severity.toUpperCase()} SEVERITY
                        </div>
                        <div style={{ fontSize: '11px', color: C.white, lineHeight: 1.3 }}>{t.title}</div>
                        <div style={{ fontSize: '9px', color: C.dim, marginTop: '3px' }}>
                          SRC: {t.src} · TGT: {t.tgt}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* Asset cards */}
              <Panel title="CRITICAL OT ASSETS" icon="◈">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {DEMO_ASSETS.map(asset => {
                    const sc = STATUS_COLOR[asset.status];
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        style={{
                          padding: '12px', background: C.bg,
                          border: `1px solid ${C.border}`, cursor: 'pointer',
                          transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.cyan}
                        onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '9px', color: C.dim, letterSpacing: '0.1em' }}>{asset.type}</span>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc, boxShadow: `0 0 5px ${sc}` }} />
                        </div>
                        <div style={{ fontSize: '12px', color: C.white, fontWeight: 600, marginBottom: '4px' }}>{asset.name}</div>
                        <div style={{ fontSize: '9px', color: C.dim }}>{asset.ip}</div>
                        <div style={{ fontSize: '9px', color: C.dim }}>{asset.location}</div>
                        <div style={{ fontSize: '9px', color: C.dim, marginTop: '6px' }}>{asset.logs[0]?.time} ago</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {/* ── ASSETS VIEW ──────────────────────────────────────────────── */}
          {view === 'assets' && (
            <div style={{ padding: '16px' }}>
              <Panel title="ALL OT ASSETS" icon="◈">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                  {DEMO_ASSETS.map(asset => {
                    const sc = STATUS_COLOR[asset.status];
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        style={{ padding: '14px', background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.cyan}
                        onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc, boxShadow: `0 0 6px ${sc}` }} />
                            <span style={{ fontSize: '12px', color: C.white, fontWeight: 600 }}>{asset.name}</span>
                          </div>
                          <span style={{ fontSize: '9px', color: C.dim, letterSpacing: '0.1em' }}>{asset.type}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: C.dim, marginTop: '6px' }}>{asset.ip}</div>
                        <div style={{ fontSize: '10px', color: C.dim }}>{asset.location}</div>
                        {asset.cves.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {asset.cves.map(c => (
                              <span key={c} style={{ fontSize: '9px', padding: '1px 5px', border: `1px solid ${C.magenta}`, color: C.magenta }}>{c}</span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: '9px', color: C.dim, marginTop: '8px' }}>Last seen: {asset.logs[0]?.time}</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {/* ── TERMINAL VIEW ────────────────────────────────────────────── */}
          {view === 'terminal' && (
            <div style={{ height: '100%', padding: '0' }}>
              <TerminalView />
            </div>
          )}
        </div>

        {/* Right copilot panel */}
        <div style={{ width: '280px', background: C.panel, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: C.cyan, fontWeight: 700, letterSpacing: '0.1em' }}>VARO CO-PILOT</div>
              <div style={{ fontSize: '9px', color: C.green, marginTop: '2px' }}>● NEURAL LINK ACTIVE</div>
            </div>
            <span style={{ fontSize: '9px', color: C.magenta, letterSpacing: '0.1em' }}>JARVIS_MODE</span>
          </div>
          <CopilotChat voiceOn={voiceOn} />
        </div>
      </div>

      {/* Asset HUD overlay */}
      {selectedAsset && (
        <AssetHUD asset={selectedAsset} onClose={() => setSelectedAsset(null)} voiceOn={voiceOn} />
      )}

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; }
      `}</style>
    </div>
  );
}

// ── Panel wrapper ─────────────────────────────────────────────────────────────
function Panel({ title, icon, children }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ color: C.cyan, fontSize: '12px' }}>{icon}</span>
        <span style={{ fontSize: '10px', color: C.cyan, letterSpacing: '0.12em' }}>{title}</span>
      </div>
      <div style={{ padding: '12px 14px' }}>{children}</div>
    </div>
  );
}

// ── Copilot chat (right panel) ────────────────────────────────────────────────
function CopilotChat({ voiceOn }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Neural link established. How can I assist with your OT security operations today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/varo/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, report: null }),
      });
      const data = await res.json();
      const reply = data.reply || 'No response received.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      if (voiceOn) speak(reply);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Check neural link.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '8px 10px',
              background: m.role === 'user' ? 'rgba(0,229,255,0.1)' : C.card,
              border: `1px solid ${m.role === 'user' ? 'rgba(0,229,255,0.3)' : C.border}`,
              fontSize: '11px', color: C.text, lineHeight: '1.6',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ fontSize: '10px', color: C.dim }}>Processing...</div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: '10px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '6px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Query system status..."
          style={{
            flex: 1, background: C.bg, border: `1px solid ${C.border}`,
            color: C.text, padding: '6px 8px', fontSize: '11px', outline: 'none',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        />
        <button onClick={send} style={{ background: 'none', border: `1px solid ${C.cyan}`, color: C.cyan, padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
          →
        </button>
      </div>
    </>
  );
}

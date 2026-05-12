AdminWorkflow = function AdminWorkflow({ addToast }) {
  const [states] = useStateB(window.GMS.WF_STATES);
  const [transitions] = useStateB(window.GMS.WF_TRANSITIONS);
  const [actionsByState] = useStateB(window.GMS.WF_ACTIONS_BY_STATE);
  const [selected, setSelected] = useStateB('IN_PROGRESS');

  const stateMap = Object.fromEntries(states.map(s => [s.id, s]));

  return (
    <div>
      <PageHeader title="Workflow Configuration" sub="Visual state machine · 9 states · 11 transitions · drag to reposition" actions={<><Btn><Icon name="download" size={13} /> Export YAML</Btn><Btn kind="primary"><Icon name="plus" size={13} /> Add State</Btn></>} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <Card padding={0}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Grievance Lifecycle State Machine</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <Btn size="sm">−</Btn><Btn size="sm">+</Btn><Btn size="sm">Fit</Btn>
            </div>
          </div>
          <div style={{ position: 'relative', height: 380, background: 'radial-gradient(circle at 1px 1px, #E5E7EB 1px, transparent 0) 0 0 / 20px 20px', overflow: 'auto' }}>
            <svg width="1000" height="360" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#94A3B8" />
                </marker>
              </defs>
              {transitions.map((t, i) => {
                const a = stateMap[t.from], b = stateMap[t.to];
                if (!a || !b) return null;
                const x1 = a.x + 60, y1 = a.y + 22;
                const x2 = b.x + (b.x > a.x ? 0 : 120), y2 = b.y + 22;
                const dx = (x2 - x1) / 2;
                const isCurve = Math.abs(b.y - a.y) > 50 || Math.abs(b.x - a.x) < 30;
                return (
                  <g key={i}>
                    <path d={isCurve ? `M ${x1} ${y1} Q ${x1 + dx} ${y1 - 30}, ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`} fill="none" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  </g>
                );
              })}
            </svg>
            {states.map(s => (
              <div key={s.id} onClick={() => setSelected(s.id)} style={{ position: 'absolute', left: s.x, top: s.y, width: 120, padding: '9px 11px', background: '#fff', border: `2px solid ${selected === s.id ? '#FF8C42' : s.color}`, borderRadius: 9, cursor: 'pointer', boxShadow: selected === s.id ? '0 4px 12px rgba(255,140,66,0.25)' : '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center', userSelect: 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.id}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A2E', marginTop: 2 }}>{s.label}</div>
                {s.initial && <div style={{ position: 'absolute', top: -8, left: -6, padding: '1px 5px', background: '#16A34A', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 3 }}>START</div>}
                {s.terminal && <div style={{ position: 'absolute', top: -8, right: -6, padding: '1px 5px', background: '#6B7280', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 3 }}>END</div>}
              </div>
            ))}
          </div>
        </Card>

        <Card padding={16}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 11 }}>State: {stateMap[selected]?.label}</div>
          <div style={{ padding: 9, background: stateMap[selected]?.color + '15', borderRadius: 7, fontSize: 11.5, color: '#0F1A2E', marginBottom: 11 }}>
            ID: <b>{selected}</b>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>Allowed Actions</div>
          {(actionsByState[selected] || []).map(a => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', background: '#F9FAFB', borderRadius: 6, marginBottom: 4, fontSize: 11.5 }}>
              <span style={{ fontSize: 12 }}>•</span>
              <span style={{ flex: 1, fontWeight: 500, color: '#0F1A2E' }}>{a}</span>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B7280' }}>×</button>
            </div>
          ))}
          <button style={{ width: '100%', marginTop: 5, padding: '7px 9px', border: '1px dashed #D1D5DB', background: '#fff', color: '#6B7280', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Add Action</button>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>Transitions From</div>
            {transitions.filter(t => t.from === selected).map((t, i) => (
              <div key={i} style={{ padding: '7px 9px', background: '#EFF6FF', borderRadius: 6, marginBottom: 4, fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#1A3260' }}>→</span>
                <span style={{ fontWeight: 600, color: '#1A3260' }}>{stateMap[t.to]?.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6B7280' }}>{t.action}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════ M8: ESCALATION MATRIX ═══════════════ */
window.
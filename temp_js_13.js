// Phase 3 — Modules B: Categories, SLA Rule Engine (CORE), Workflow, Escalation
const { useState: useStateB, useMemo: useMemoB } = React;

/* ═══════════════ M5: CATEGORIES ═══════════════ */
window.AdminCategories = function AdminCategories({ addToast, showAI }) {
  const [cats, setCats] = useStateB(window.GMS.CATEGORIES);
  const [filter, setFilter] = useStateB({ q: '', dept: 'ALL' });
  const [selected, setSelected] = useStateB(null);

  const filtered = cats.filter(c => (filter.q === '' || c.name.toLowerCase().includes(filter.q.toLowerCase())) && (filter.dept === 'ALL' || c.dept === filter.dept));

  return (
    <div>
      <PageHeader title="Category Management" sub={`${cats.length} categories across ${window.GMS.DEPARTMENTS.length} departments`} actions={<><Btn><Icon name="download" size={13} /> Export</Btn><Btn kind="primary" onClick={() => setSelected({ isNew: true, name: '', dept: 'HFWD', sla: 48, priority: 'MEDIUM', subs: 0, fields: [] })}><Icon name="plus" size={13} /> Add Category</Btn></>} />

      <Card padding={14} style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><Icon name="search" size={14} /></span>
            <input placeholder="Search categories…" value={filter.q} onChange={e => setFilter({...filter, q: e.target.value})} style={{...inputStyle, paddingLeft: 32}} />
          </div>
          <select value={filter.dept} onChange={e => setFilter({...filter, dept: e.target.value})} style={inputStyle}>
            <option value="ALL">All departments</option>
            {window.GMS.DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map(c => {
          const dept = window.GMS.DEPARTMENTS.find(d => d.code === c.dept);
          return (
            <Card key={c.code} padding={14} style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,26,46,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }} onClick={() => setSelected(c)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={dept.iconName || 'folder'} size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1A2E' }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: '#6B7280' }}>{c.code}</div>
                </div>
                <PriorityBadge p={c.priority} />
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8 }}>{dept.name}</div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#374151', borderTop: '1px solid #F3F4F6', paddingTop: 9 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="clock" size={12} color="#6B7280" /> <b>{c.sla}h</b> SLA</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="folder" size={12} color="#6B7280" /> {c.subs} sub</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="document" size={12} color="#6B7280" /> {c.fields.length} fields</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.isNew ? 'Add Category' : selected?.name} width={560} footer={<><Btn onClick={() => setSelected(null)}>Cancel</Btn><Btn kind="primary" onClick={() => { addToast(selected?.isNew ? 'Category created' : 'Category updated'); setSelected(null); }}>Save</Btn></>}>
        {selected && (
          <div style={{ display: 'grid', gap: 11 }}>
            <FormRow label="Category Name *"><input style={inputStyle} defaultValue={selected.name} /></FormRow>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormRow label="Department"><select style={inputStyle} defaultValue={selected.dept}>{window.GMS.DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}</select></FormRow>
              <FormRow label="Default Priority"><select style={inputStyle} defaultValue={selected.priority}><option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select></FormRow>
            </div>
            <FormRow label="Default SLA (hours)"><input type="number" style={inputStyle} defaultValue={selected.sla} /></FormRow>
            <FormRow label="Required Fields">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['photo', 'location', 'aadhaar', 'patient_id', 'gps', 'pole_id', 'survey_no', 'lab_report', 'hospital', 'land_record', 'fir_no'].map(f => {
                  const has = (selected.fields || []).includes(f);
                  return <button key={f} style={{ padding: '5px 11px', fontSize: 11, fontWeight: 600, borderRadius: 14, border: has ? '1px solid #FF8C42' : '1px solid #E5E7EB', background: has ? '#FFF7ED' : '#fff', color: has ? '#FF8C42' : '#6B7280', cursor: 'pointer' }}>{has ? '✓ ' : '+ '}{f.replace(/_/g, ' ')}</button>;
                })}
              </div>
            </FormRow>
            {showAI && <div style={{ padding: 11, background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 8, fontSize: 11.5 }}><AIBadge>AI Suggest</AIBadge><div style={{ marginTop: 5, lineHeight: 1.5 }}>Based on similar categories in {window.GMS.DEPARTMENTS.find(d => d.code === selected.dept)?.name}, recommended SLA: <b>48 hrs</b>. Suggest making "photo" and "location" mandatory fields.</div></div>}
          </div>
        )}
      </Modal>
    </div>
  );
};

/* ═══════════════ M6: SLA RULE ENGINE — CORE ═══════════════ */
function SLAResultChip({ hours, priority }) {
  const colors = { CRITICAL: '#DC2626', HIGH: '#F59E0B', MEDIUM: '#0EA5E9', LOW: '#16A34A' };
  const col = colors[priority] || '#6B7280';
  const isPct = hours <= 0;
  const display = isPct ? `${hours}%` : hours >= 24 && hours % 24 === 0 ? `${hours / 24}d` : `${hours}h`;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', borderRadius: 8, overflow: 'hidden', border: '1px solid ' + col + '40', background: '#fff', boxShadow: '0 1px 0 rgba(15,26,46,0.02)', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px 4px 8px', background: col + '0E' }}>
        <Icon name="clock" size={12} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0F1A2E', letterSpacing: 0.2, fontVariantNumeric: 'tabular-nums' }}>{display}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', background: col, color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6 }}>
        {priority}
      </div>
    </div>
  );
}

window.AdminSLA = function AdminSLA({ addToast, showAI }) {
  const [rules, setRules] = useStateB(window.GMS.SLA_RULES);
  const [view, setView] = useStateB('list'); // list | builder | conflicts
  const [editingRule, setEditingRule] = useStateB(null);
  const [filter, setFilter] = useStateB({ q: '', dept: 'ALL', status: 'ALL' });

  const filtered = rules.filter(r =>
    (filter.q === '' || r.name.toLowerCase().includes(filter.q.toLowerCase())) &&
    (filter.dept === 'ALL' || r.dept === filter.dept || r.dept === 'ALL') &&
    (filter.status === 'ALL' || (filter.status === 'ACTIVE' && r.active) || (filter.status === 'INACTIVE' && !r.active))
  );

  const conflicts = [
    { ids: ['SLA-002', 'SLA-020'], reason: 'Both apply to senior citizen + hospital cleanliness urban — priority overlap (SLA-020 is override)', severity: 'MEDIUM' },
    { ids: ['SLA-008', 'SLA-009'], reason: 'Potholes — Urban (168h) and Highway (96h) overlap if URL is both urban + highway. Specify roadType precedence.', severity: 'HIGH' },
  ];

  return (
    <div>
      <PageHeader
        title="SLA Rule Engine"
        sub={`${rules.length} rules · ${rules.filter(r => r.active).length} active · ${conflicts.length} conflicts detected`}
        actions={<>
          <Btn onClick={() => setView('conflicts')} style={{ position: 'relative' }}><Icon name="alert" size={13} color="#DC2626" /> Conflicts <span style={{ marginLeft: 6, padding: '1px 6px', fontSize: 10, background: '#DC2626', color: '#fff', borderRadius: 9, fontWeight: 700 }}>{conflicts.length}</span></Btn>
          <Btn><Icon name="download" size={13} /> Export Rules</Btn>
          <Btn kind="primary" onClick={() => { setEditingRule({ isNew: true, id: 'SLA-' + (rules.length + 1).toString().padStart(3,'0'), name: '', priority: rules.length + 1, active: true, conditions: [['category', 'equals', '']], slaHours: 48, escalations: [], priorityOut: 'MEDIUM', dept: 'HFWD' }); setView('builder'); }}><Icon name="plus" size={13} /> New Rule</Btn>
        </>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid #E5E7EB' }}>
        {[['list', 'list', 'Rule Library'], ['builder', 'workflow', 'Visual Builder'], ['conflicts', 'alert', 'Conflicts']].map(([id, ic, lbl]) => (
          <button key={id} onClick={() => setView(id)} style={{ padding: '10px 16px', border: 'none', background: 'transparent', fontSize: 12.5, fontWeight: 600, color: view === id ? '#FF8C42' : '#6B7280', borderBottom: view === id ? '2px solid #FF8C42' : '2px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={ic} size={13} /> {lbl}</button>
        ))}
      </div>

      {view === 'list' && (
        <>
          <Card padding={12} style={{ marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><Icon name="search" size={14} /></span>
                <input placeholder="Search rules by name…" value={filter.q} onChange={e => setFilter({...filter, q: e.target.value})} style={{...inputStyle, paddingLeft: 32}} />
              </div>
              <select value={filter.dept} onChange={e => setFilter({...filter, dept: e.target.value})} style={inputStyle}>
                <option value="ALL">All depts</option>{window.GMS.DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
              <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})} style={inputStyle}>
                <option value="ALL">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </Card>

          {showAI && (
            <div style={{ padding: 12, background: 'linear-gradient(90deg, #FAF5FF, #fff)', border: '1px solid #E9D5FF', borderRadius: 9, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg, #7C3AED, #DB2777)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkles" size={15} color="#fff" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>AI Rule Suggester</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Based on past 3 months of grievances: <b>RBD-LIGHT (Street Light)</b> resolves 22% faster on weekends. Suggest creating a weekend-priority rule.</div>
              </div>
              <Btn size="sm" kind="primary">+ Generate Rule</Btn>
            </div>
          )}

          <Card padding={0}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Pri', 'Rule', 'Conditions', 'Result', 'Escalations', 'Status', ''].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10.5, fontWeight: 600, color: '#6B7280', letterSpacing: 0.4, textTransform: 'uppercase' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onClick={() => { setEditingRule(r); setView('builder'); }} onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, padding: '3px 6px', borderRadius: 4, background: r.priority === 0 ? '#FEE2E2' : r.priority < 5 ? '#FEF3C7' : '#F3F4F6', color: r.priority === 0 ? '#DC2626' : '#0F1A2E', fontSize: 10.5, fontWeight: 700, textAlign: 'center' }}>{r.priority === 0 ? <Icon name="star" size={11} color="#DC2626" /> : r.priority}</span>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#0F1A2E' }}>{r.name}</div>
                      <div style={{ fontSize: 10.5, color: '#6B7280' }}>{r.id}{r.isOverride && ' · OVERRIDE'}</div>
                    </td>
                    <td style={{ padding: '11px 12px', fontSize: 11 }}>
                      {r.conditions.slice(0, 2).map((c, i) => <div key={i} style={{ display: 'inline-block', padding: '2px 6px', background: '#EFF6FF', color: '#1A3260', borderRadius: 3, marginRight: 4, marginBottom: 2, fontFamily: 'ui-monospace, monospace', fontSize: 10 }}>{c[0]} {c[1]} {c[2]}</div>)}
                      {r.conditions.length > 2 && <span style={{ fontSize: 10, color: '#6B7280' }}>+{r.conditions.length - 2}</span>}
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <SLAResultChip hours={r.slaHours} priority={r.priorityOut} />
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {r.escalations.map((e, i) => <span key={i} title={`L${e.lvl} → ${e.role} after ${e.after}h`} style={{ width: 22, height: 22, borderRadius: '50%', background: ['#16A34A','#F59E0B','#DC2626'][i] || '#6B7280', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{e.lvl}</span>)}
                        {r.escalations.length === 0 && <span style={{ fontSize: 10.5, color: '#6B7280' }}>—</span>}
                      </div>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <Toggle on={r.active} size="sm" onChange={(e) => { e.stopPropagation && e.stopPropagation(); setRules(rules.map(x => x.id === r.id ? {...x, active: !x.active} : x)); addToast(`${r.id} ${!r.active ? 'enabled' : 'disabled'}`); }} />
                    </td>
                    <td style={{ padding: '11px 12px' }}><button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'inline-flex', alignItems: 'center' }}><Icon name="more" size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {view === 'builder' && editingRule && <SLABuilder rule={editingRule} setRule={setEditingRule} onSave={() => { addToast('Rule saved'); setView('list'); }} onCancel={() => setView('list')} showAI={showAI} />}

      {view === 'conflicts' && <RuleConflicts conflicts={conflicts} rules={rules} addToast={addToast} />}
    </div>
  );
};

/* SLA Visual Builder */
function SLABuilder({ rule, setRule, onSave, onCancel, showAI }) {
  const addCondition = () => setRule({ ...rule, conditions: [...rule.conditions, ['category', 'equals', '']] });
  const removeCondition = (i) => setRule({ ...rule, conditions: rule.conditions.filter((_, idx) => idx !== i) });
  const updateCond = (i, j, v) => { const c = [...rule.conditions]; c[i] = [...c[i]]; c[i][j] = v; setRule({ ...rule, conditions: c }); };
  const addEscalation = () => setRule({ ...rule, escalations: [...rule.escalations, { lvl: rule.escalations.length + 1, after: 24, role: '' }] });
  const removeEsc = (i) => setRule({ ...rule, escalations: rule.escalations.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
      <Card padding={20}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FF8C42', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{rule.priority === 0 ? <Icon name="star" size={16} color="#fff" /> : rule.priority}</div>
          <input value={rule.name} onChange={e => setRule({...rule, name: e.target.value})} placeholder="Rule name (e.g. Hospital Cleanliness — Urban)" style={{ ...inputStyle, fontSize: 14, fontWeight: 600 }} />
          <Toggle on={rule.active} onChange={() => setRule({...rule, active: !rule.active})} />
        </div>

        {/* IF Block */}
        <div style={{ padding: 14, border: '1px solid #BFDBFE', borderRadius: 9, background: '#EFF6FF', marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <span style={{ padding: '3px 10px', background: '#1A3260', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>IF</span>
            <span style={{ fontSize: 11, color: '#1A3260', fontWeight: 600 }}>All conditions match</span>
          </div>
          {rule.conditions.map((cond, i) => {
            const field = window.GMS.RULE_FIELDS.find(f => f.code === cond[0]);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                {i > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: '#1A3260', letterSpacing: 1, padding: '2px 7px', background: '#fff', borderRadius: 3, border: '1px solid #BFDBFE', minWidth: 32, textAlign: 'center' }}>AND</span>}
                {i === 0 && <span style={{ minWidth: 32 }}></span>}
                <select value={cond[0]} onChange={e => updateCond(i, 0, e.target.value)} style={{ ...inputStyle, width: 160 }}>
                  {window.GMS.RULE_FIELDS.map(f => <option key={f.code} value={f.code}>{f.label}</option>)}
                </select>
                <select value={cond[1]} onChange={e => updateCond(i, 1, e.target.value)} style={{ ...inputStyle, width: 110 }}>
                  {window.GMS.RULE_OPERATORS.map(op => <option key={op.code} value={op.code}>{op.symbol} {op.label}</option>)}
                </select>
                {field && field.options ? (
                  <select value={cond[2]} onChange={e => updateCond(i, 2, e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                    <option value="">— select —</option>
                    {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input value={cond[2]} onChange={e => updateCond(i, 2, e.target.value)} placeholder="value" style={{ ...inputStyle, flex: 1 }} />
                )}
                <button onClick={() => removeCondition(i)} disabled={rule.conditions.length === 1} style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid #FCA5A5', background: '#fff', color: '#DC2626', cursor: rule.conditions.length === 1 ? 'not-allowed' : 'pointer', opacity: rule.conditions.length === 1 ? 0.4 : 1, fontSize: 13 }}>×</button>
              </div>
            );
          })}
          <button onClick={addCondition} style={{ marginTop: 4, padding: '6px 11px', border: '1px dashed #1A3260', background: '#fff', color: '#1A3260', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Add Condition (AND)</button>
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', fontSize: 24, color: '#9CA3AF', margin: '4px 0' }}>↓</div>

        {/* THEN Block */}
        <div style={{ padding: 14, border: '1px solid #BBF7D0', borderRadius: 9, background: '#F0FDF4', marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <span style={{ padding: '3px 10px', background: '#16A34A', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>THEN</span>
            <span style={{ fontSize: 11, color: '#15803D', fontWeight: 600 }}>Apply these settings</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
            <FormRow label="SLA (hours)"><input type="number" value={rule.slaHours} onChange={e => setRule({...rule, slaHours: +e.target.value})} style={inputStyle} /></FormRow>
            <FormRow label="Set Priority"><select value={rule.priorityOut} onChange={e => setRule({...rule, priorityOut: e.target.value})} style={inputStyle}><option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select></FormRow>
            <FormRow label="Rule Priority"><input type="number" value={rule.priority} onChange={e => setRule({...rule, priority: +e.target.value})} style={inputStyle} /></FormRow>
          </div>
        </div>

        {/* ESCALATE Block */}
        <div style={{ padding: 14, border: '1px solid #FED7AA', borderRadius: 9, background: '#FFF7ED' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <span style={{ padding: '3px 10px', background: '#FF8C42', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>ESCALATE</span>
            <span style={{ fontSize: 11, color: '#9A3412', fontWeight: 600 }}>Auto-escalation chain</span>
          </div>
          {rule.escalations.length === 0 && <div style={{ fontSize: 11.5, color: '#6B7280', padding: '6px 0' }}>No escalations defined.</div>}
          {rule.escalations.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: ['#16A34A','#F59E0B','#DC2626'][i] || '#6B7280', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>L{e.lvl}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9A3412' }}>after</span>
              <input type="number" defaultValue={e.after} style={{ ...inputStyle, width: 70 }} />
              <span style={{ fontSize: 11, color: '#9A3412' }}>hours →</span>
              <input defaultValue={e.role} placeholder="Role/Officer" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => removeEsc(i)} style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid #FCA5A5', background: '#fff', color: '#DC2626', cursor: 'pointer', fontSize: 13 }}>×</button>
            </div>
          ))}
          <button onClick={addEscalation} style={{ marginTop: 4, padding: '6px 11px', border: '1px dashed #FF8C42', background: '#fff', color: '#FF8C42', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Add Escalation Level</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: 14 }}>
          <Btn onClick={onCancel}>Cancel</Btn>
          <Btn><Icon name="play" size={12} /> Test Rule</Btn>
          <Btn kind="primary" onClick={onSave}><Icon name="check" size={13} /> Save Rule</Btn>
        </div>
      </Card>

      <div>
        {/* JSON preview */}
        <Card padding={14} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Rule JSON</div>
          <pre style={{ fontSize: 10.5, fontFamily: 'ui-monospace, monospace', background: '#0F1A2E', color: '#A5F3FC', padding: 11, borderRadius: 6, overflow: 'auto', margin: 0, lineHeight: 1.5 }}>{JSON.stringify({ ruleId: rule.id, conditions: Object.fromEntries(rule.conditions.map(c => [c[0], c[2]])), slaHours: rule.slaHours, escalation: rule.escalations }, null, 2)}</pre>
        </Card>

        {showAI && (
          <Card padding={14} style={{ background: 'linear-gradient(135deg, #FAF5FF, #fff)', border: '1px solid #E9D5FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <Icon name="sparkles" size={14} color="#7C3AED" />
              <span style={{ fontSize: 12, fontWeight: 700 }}>AI Rule Validator</span>
            </div>
            <div style={{ fontSize: 11.5, color: '#0F1A2E', marginBottom: 8, lineHeight: 1.5 }}>This rule looks reasonable. <b>3 similar past grievances</b> would have matched, with avg resolution of {rule.slaHours - 4}h.</div>
            <div style={{ padding: 9, background: '#fff', borderRadius: 6, fontSize: 11, color: '#374151' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Suggestions:</div>
              <div style={{ lineHeight: 1.6 }}>• Consider adding "season" condition for monsoon edge cases<br/>• L1 escalation at {rule.slaHours / 2}h is recommended</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function RuleConflicts({ conflicts, rules, addToast }) {
  return (
    <div>
      <div style={{ padding: 12, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 9, marginBottom: 14, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="alert" size={14} color="#9A3412" /><span><b>{conflicts.length} potential conflicts detected.</b> AI Conflict Resolver has analyzed all {rules.length} rules. Review and resolve to ensure deterministic routing.</span></div>
      {conflicts.map((c, i) => (
        <Card key={i} padding={16} style={{ marginBottom: 11, borderLeft: `3px solid ${c.severity === 'HIGH' ? '#DC2626' : '#F59E0B'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <PriorityBadge p={c.severity} />
            <div style={{ fontSize: 13, fontWeight: 700 }}>Conflict between {c.ids.join(' & ')}</div>
            <Btn size="sm" style={{ marginLeft: 'auto' }} onClick={() => addToast('Conflict acknowledged')}>Acknowledge</Btn>
            <Btn size="sm" kind="primary" onClick={() => addToast('Conflict auto-resolved')}><Icon name="sparkles" size={12} /> Auto-Resolve</Btn>
          </div>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 11 }}>{c.reason}</div>
          <div style={{ display: 'flex', gap: 9 }}>
            {c.ids.map(id => {
              const r = rules.find(x => x.id === id);
              if (!r) return null;
              return (
                <div key={id} style={{ flex: 1, padding: 11, background: '#F9FAFB', borderRadius: 7, border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{r.id} · Pri {r.priority}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: '#374151', marginTop: 5 }}>SLA: {r.slaHours}h · Esc: {r.escalations.length} levels</div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════ M7: WORKFLOW CONFIGURATION ═══════════════ */
window.AdminWorkflow = function AdminWorkflow({ addToast }) {
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
window.AdminEscalation = function AdminEscalation({ addToast }) {
  const matrix = [
    { dept: 'HFWD', l1: 'BHO (Block Health Officer)', l1h: 24, l2: 'CDHO (District)', l2h: 48, l3: 'Director Health', l3h: 72 },
    { dept: 'WSSD', l1: 'AE Water Supply', l1h: 18, l2: 'EE Water Supply', l2h: 36, l3: 'Chief Engineer', l3h: 60 },
    { dept: 'RBD', l1: 'Asst. Engineer', l1h: 48, l2: 'Executive Engineer', l2h: 96, l3: 'Chief Engineer R&B', l3h: 120 },
    { dept: 'UDD', l1: 'Ward Officer', l1h: 12, l2: 'Municipal Commissioner', l2h: 36, l3: 'Director UDD', l3h: 72 },
    { dept: 'AGRI', l1: 'Mamlatdar', l1h: 96, l2: 'Tehsildar', l2h: 144, l3: 'Collector', l3h: 192 },
    { dept: 'EDU', l1: 'BEO', l1h: 96, l2: 'DEO', l2h: 168, l3: 'Director Education', l3h: 240 },
    { dept: 'POLICE', l1: 'PI', l1h: 24, l2: 'DSP', l2h: 48, l3: 'SP / Commissioner', l3h: 72 },
    { dept: 'REV', l1: 'Talati', l1h: 96, l2: 'Mamlatdar', l2h: 168, l3: 'Collector', l3h: 240 },
  ];

  return (
    <div>
      <PageHeader title="Escalation Matrix" sub="Time-based escalation chain per department · auto-triggered by SLA engine" actions={<><Btn><Icon name="download" size={13} /> Export Matrix</Btn><Btn kind="primary"><Icon name="plus" size={13} /> Custom Rule</Btn></>} />

      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase' }}>Department</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#16A34A', letterSpacing: 0.5, textTransform: 'uppercase' }}>L1 — First Escalation</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#F59E0B', letterSpacing: 0.5, textTransform: 'uppercase' }}>L2 — Mid</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#DC2626', letterSpacing: 0.5, textTransform: 'uppercase' }}>L3 — Final</th>
              <th style={{ padding: '10px 14px' }}></th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(row => {
              const dept = window.GMS.DEPARTMENTS.find(d => d.code === row.dept);
              return (
                <tr key={row.dept} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={dept.iconName || 'folder'} size={16} /></div>
                      <div><div style={{ fontWeight: 700 }}>{dept.name}</div><div style={{ fontSize: 10.5, color: '#6B7280' }}>{row.dept}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: '#0F1A2E' }}>{row.l1}</div>
                    <div style={{ fontSize: 10.5, color: '#16A34A', marginTop: 2 }}>after {row.l1h}h</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: '#0F1A2E' }}>{row.l2}</div>
                    <div style={{ fontSize: 10.5, color: '#F59E0B', marginTop: 2 }}>after {row.l2h}h</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: '#0F1A2E' }}>{row.l3}</div>
                    <div style={{ fontSize: 10.5, color: '#DC2626', marginTop: 2 }}>after {row.l3h}h</div>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <Btn size="sm"><Icon name="edit" size={12} /> Edit</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

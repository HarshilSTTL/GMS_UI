// Phase 3 — Modules C: Notifications, AI Config, Master Data, Audit Logs
const { useState: useStateC } = React;

/* ═══════════════ M9: NOTIFICATION TEMPLATES ═══════════════ */
window.AdminNotif = function AdminNotif({ addToast, showAI }) {
  const [templates, setTemplates] = useStateC(window.GMS.NOTIF_TEMPLATES);
  const [selected, setSelected] = useStateC(null);
  const [showDrafter, setShowDrafter] = useStateC(false);

  const triggerMap = Object.fromEntries(window.GMS.NOTIF_TRIGGERS.map(t => [t.code, t]));

  return (
    <div>
      <PageHeader title="Notification Configuration" sub={`${templates.length} templates · ${window.GMS.NOTIF_TRIGGERS.length} trigger events · SMS / WhatsApp / Email`} actions={<>{showAI && <Btn onClick={() => setShowDrafter(true)}><Icon name="sparkles" size={13} color="#7C3AED" /> AI Draft Template</Btn>}<Btn kind="primary"><Icon name="plus" size={13} /> New Template</Btn></>} />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14 }}>
        <Card padding={12}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5, padding: '4px 8px 8px', textTransform: 'uppercase' }}>Triggers</div>
          {window.GMS.NOTIF_TRIGGERS.map(t => {
            const count = templates.filter(x => x.trigger === t.code).length;
            return (
              <div key={t.code} style={{ padding: '9px 10px', borderRadius: 6, marginBottom: 3, background: '#F9FAFB', display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={t.iconName || 'bell'} size={14} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>{count} template{count !== 1 ? 's' : ''}</div>
                </div>
              </div>
            );
          })}
        </Card>

        <div style={{ display: 'grid', gap: 11 }}>
          {templates.map(tpl => {
            const trig = triggerMap[tpl.trigger];
            return (
              <Card key={tpl.id} padding={14} style={{ cursor: 'pointer' }} onClick={() => setSelected(tpl)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={trig.iconName || 'bell'} size={17} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{tpl.id}</div>
                      <span style={{ padding: '1px 6px', fontSize: 10, fontWeight: 700, background: 'transparent', color: '#374151', borderRadius: 3 }}>{trig.label}</span>
                      <span style={{ padding: '1px 6px', fontSize: 10, fontWeight: 600, background: '#F3F4F6', color: '#374151', borderRadius: 3 }}>{tpl.lang.toUpperCase()}</span>
                      {tpl.internal && <span style={{ padding: '1px 6px', fontSize: 10, fontWeight: 700, background: '#FEE2E2', color: '#DC2626', borderRadius: 3 }}>INTERNAL</span>}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                        {tpl.channels.map(ch => <span key={ch} style={{ padding: '2px 7px', fontSize: 9.5, fontWeight: 700, background: ch === 'SMS' ? '#DBEAFE' : ch === 'WHATSAPP' ? '#DCFCE7' : '#FEF3C7', color: '#0F1A2E', borderRadius: 3 }}>{ch === 'WHATSAPP' ? 'WA' : ch}</span>)}
                      </div>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#374151', lineHeight: 1.55, fontFamily: tpl.lang === 'gu' ? '"Noto Sans Gujarati", sans-serif' : 'inherit' }}>{tpl.body}</div>
                  </div>
                  <Toggle on={tpl.enabled} size="sm" onChange={(e) => { e.stopPropagation && e.stopPropagation(); setTemplates(templates.map(t => t.id === tpl.id ? { ...t, enabled: !t.enabled } : t)); addToast(`${tpl.id} ${!tpl.enabled ? 'enabled' : 'disabled'}`); }} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.id || ''} width={600} footer={<><Btn onClick={() => setSelected(null)}>Cancel</Btn><Btn><Icon name="send" size={12} /> Send Test</Btn><Btn kind="primary" onClick={() => { addToast('Template saved'); setSelected(null); }}>Save</Btn></>}>
        {selected && (
          <div style={{ display: 'grid', gap: 11 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormRow label="Trigger Event"><select style={inputStyle} defaultValue={selected.trigger}>{window.GMS.NOTIF_TRIGGERS.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}</select></FormRow>
              <FormRow label="Language"><select style={inputStyle} defaultValue={selected.lang}><option value="en">English</option><option value="gu">ગુજરાતી</option><option value="hi">हिन्दी</option></select></FormRow>
            </div>
            <FormRow label="Channels">
              <div style={{ display: 'flex', gap: 7 }}>
                {['SMS', 'WHATSAPP', 'EMAIL'].map(ch => {
                  const has = selected.channels.includes(ch);
                  return <button key={ch} style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 6, border: has ? '1.5px solid #FF8C42' : '1px solid #E5E7EB', background: has ? '#FFF7ED' : '#fff', color: has ? '#FF8C42' : '#6B7280', cursor: 'pointer' }}>{has ? '✓ ' : '+ '}{ch}</button>;
                })}
              </div>
            </FormRow>
            <FormRow label="Message Body"><textarea defaultValue={selected.body} rows={5} style={{ ...inputStyle, fontFamily: selected.lang === 'gu' ? '"Noto Sans Gujarati", sans-serif' : 'ui-monospace, monospace', resize: 'vertical' }} /></FormRow>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Available variables</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['{citizen_name}', '{ticket_id}', '{officer_name}', '{due_date}', '{sla_days}', '{priority}', '{feedback_link}'].map(v => <code key={v} style={{ fontSize: 10.5, padding: '2px 7px', background: '#F3F4F6', color: '#1A3260', borderRadius: 3 }}>{v}</code>)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showDrafter} onClose={() => setShowDrafter(false)} title="AI Notification Drafter" width={520} footer={<><Btn onClick={() => setShowDrafter(false)}>Cancel</Btn><Btn kind="primary" onClick={() => { addToast('Template generated'); setShowDrafter(false); }}>Use Draft</Btn></>}>
        <div style={{ display: 'grid', gap: 11 }}>
          <FormRow label="Describe the notification intent"><textarea rows={3} placeholder="e.g. SMS to citizen when their grievance is being investigated and may take longer than expected" style={inputStyle} /></FormRow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormRow label="Tone"><select style={inputStyle}><option>Empathetic & Reassuring</option><option>Formal & Direct</option><option>Friendly & Brief</option></select></FormRow>
            <FormRow label="Length"><select style={inputStyle}><option>Short (SMS, ≤160 chars)</option><option>Medium</option><option>Long (Email)</option></select></FormRow>
          </div>
          <div style={{ padding: 12, background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 8, fontSize: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#7C3AED', marginBottom: 6, letterSpacing: 0.4 }}>AI DRAFT</div>
            <div style={{ lineHeight: 1.55 }}>Dear {'{citizen_name}'}, your grievance {'{ticket_id}'} is being thoroughly investigated and may need a few extra days. Rest assured, we are committed to resolving it. Track at swagat.gujarat.gov.in/{'{ticket_id}'}.</div>
            <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 7 }}>148 chars · fits SMS · uses 2 variables</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/* ═══════════════ M10: AI CONFIGURATION ═══════════════ */
window.AdminAI = function AdminAI({ addToast }) {
  const [config, setConfig] = useStateC(window.GMS.AI_CONFIG);
  const updateFeature = (code, key, val) => {
    setConfig({ ...config, features: config.features.map(f => f.code === code ? { ...f, [key]: val } : f) });
  };

  return (
    <div>
      <PageHeader title="AI Configuration" sub={`${config.features.filter(f => f.enabled).length} of ${config.features.length} features active · ${config.callsToday.toLocaleString()} calls today`} actions={<><Btn><Icon name="barChart" size={12} /> Usage Logs</Btn><Btn kind="primary"><Icon name="save" size={12} /> Save Config</Btn></>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { lbl: 'Active Features', val: config.features.filter(f => f.enabled).length + '/' + config.features.length, sub: 'enabled', iconName: 'bot', color: '#7C3AED' },
          { lbl: 'API Calls Today', val: config.callsToday.toLocaleString(), sub: 'rate limit ' + config.rateLimit + '/min', iconName: 'zap', color: '#0EA5E9' },
          { lbl: 'Cost Today', val: '$' + config.costToday.toFixed(2), sub: '~$1.4k/month', iconName: 'badge', color: '#16A34A' },
          { lbl: 'Avg Confidence', val: '83%', sub: 'across all models', iconName: 'trending', color: '#F59E0B' },
        ].map((c, i) => (
          <Card key={i} padding={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{c.iconName ? <Icon name={c.iconName} size={20} /> : null}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{c.lbl}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>{c.val}</div>
            <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 3 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {config.features.map(f => (
          <Card key={f.code} padding={16} style={{ borderLeft: `3px solid ${f.enabled ? '#16A34A' : '#D1D5DB'}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <Toggle on={f.enabled} onChange={() => { updateFeature(f.code, 'enabled', !f.enabled); addToast(`${f.label} ${!f.enabled ? 'enabled' : 'disabled'}`); }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>{f.desc}</div>
                <div style={{ fontSize: 10.5, color: '#7C3AED', marginTop: 5, fontFamily: 'ui-monospace, monospace' }}>Model: {f.model}</div>
              </div>
              <div style={{ width: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#6B7280' }}>Confidence Threshold</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: f.threshold >= 80 ? '#16A34A' : f.threshold >= 70 ? '#F59E0B' : '#DC2626' }}>{f.threshold}%</div>
                </div>
                <input type="range" min="50" max="100" value={f.threshold} onChange={e => updateFeature(f.code, 'threshold', +e.target.value)} disabled={!f.enabled} style={{ width: '100%' }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding={16} style={{ marginTop: 14, background: '#FEF3C7', border: '1px solid #FDE68A' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Fallback Behavior</div>
        <div style={{ fontSize: 11.5, color: '#374151', marginBottom: 10 }}>When AI confidence falls below threshold, system should:</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { code: 'manual', label: 'Defer to manual review' },
            { code: 'lower_confidence', label: 'Use result with warning' },
            { code: 'reject', label: 'Reject & retry' },
          ].map(opt => <button key={opt.code} style={{ padding: '7px 13px', fontSize: 11, fontWeight: 600, borderRadius: 6, border: config.fallback === opt.code ? '1.5px solid #FF8C42' : '1px solid #E5E7EB', background: config.fallback === opt.code ? '#fff' : '#fff', color: config.fallback === opt.code ? '#FF8C42' : '#374151', cursor: 'pointer' }}>{opt.label}</button>)}
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════ M11: MASTER DATA ═══════════════ */
window.AdminMaster = function AdminMaster({ addToast }) {
  const [tab, setTab] = useStateC('locations');

  const tabs = [
    { id: 'locations', iconName: 'pin', label: 'Locations', count: 33 },
    { id: 'depts', iconName: 'building', label: 'Departments', count: 8 },
    { id: 'designations', iconName: 'award', label: 'Designations', count: 15 },
    { id: 'types', iconName: 'tag', label: 'Complaint Types', count: 15 },
  ];

  return (
    <div>
      <PageHeader title="Master Data Management" sub="Reference data — single source of truth for the platform" actions={<><Btn><Icon name="download" size={13} /> Export</Btn><Btn><Icon name="upload" size={13} /> Import</Btn><Btn kind="primary"><Icon name="plus" size={13} /> Add Item</Btn></>} />

      <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid #E5E7EB' }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 16px', border: 'none', background: 'transparent', fontSize: 12.5, fontWeight: 600, color: tab === t.id ? '#FF8C42' : '#6B7280', borderBottom: tab === t.id ? '2px solid #FF8C42' : '2px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={t.iconName} size={13} /> {t.label} <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>{t.count}</span></button>)}
      </div>

      {tab === 'locations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Kheda', 'Mehsana', 'Anand', 'Bharuch', 'Navsari', 'Kutch', 'Patan', 'Banaskantha', 'Sabarkantha', 'Panchmahal', 'Amreli', 'Porbandar', 'Surendranagar', 'Valsad', 'Dahod', 'Aravalli', 'Botad', 'Chhota Udaipur', 'Devbhumi Dwarka', 'Gir Somnath', 'Mahisagar', 'Morbi', 'Narmada', 'Tapi', 'Dang'].map((d, i) => (
            <Card key={d} padding={11}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: '#EFF6FF', color: '#1A3260', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="pin" size={13} color="#1A3260" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{d}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>DIST-{(i+1).toString().padStart(2,'0')}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'depts' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead><tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>{['Dept', 'Code', 'Staff', 'Offices', 'Categories', ''].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.GMS.DEPARTMENTS.map(d => (
                <tr key={d.code} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={d.iconName || 'folder'} size={16} /></div>
                      <div><div style={{ fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 10.5, color: '#6B7280' }}>{d.nameGu}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'ui-monospace', fontSize: 11 }}>{d.code}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{d.staff.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>{d.offices}</td>
                  <td style={{ padding: '12px 14px' }}>{window.GMS.CATEGORIES.filter(c => c.dept === d.code).length}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}><Btn size="sm"><Icon name="edit" size={12} /></Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'designations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 9 }}>
          {['Junior Clerk', 'Senior Clerk', 'Section Officer', 'Deputy Director', 'Director', 'Joint Secretary', 'Secretary', 'Medical Officer', 'CDHO', 'BHO', 'Sub-Engineer', 'Executive Engineer', 'Tehsildar', 'Mamlatdar', 'Talati'].map((d, i) => (
            <Card key={d} padding={11}><div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600 }}><Icon name="award" size={14} color="#F59E0B" /> {d}</div><div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 3 }}>Grade {((i % 5) + 1)} · {(50 + i*3) % 99} positions</div></Card>
          ))}
        </div>
      )}

      {tab === 'types' && (
        <div style={{ display: 'grid', gap: 8 }}>
          {window.GMS.CATEGORIES.map(c => {
            const dept = window.GMS.DEPARTMENTS.find(d => d.code === c.dept);
            return <Card key={c.code} padding={11}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={dept.iconName || 'folder'} size={14} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 10.5, color: '#6B7280' }}>{c.code} · {dept.name} · SLA {c.sla}h</div></div><PriorityBadge p={c.priority} /></div></Card>;
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════════════ M11.5: SCHEMES & SERVICES ═══════════════ */
window.AdminSchemes = function AdminSchemes({ addToast }) {
  const [schemes, setSchemes] = useStateC(window.GMS.SCHEMES || []);
  const [domainFilter, setDomainFilter] = useStateC('ALL');
  const [selectedScheme, setSelectedScheme] = useStateC(null);
  const [editingScheme, setEditingScheme] = useStateC(null);
  const [editData, setEditData] = useStateC({});
  
  const domains = ['ALL', 'HEALTH', 'WATER', 'ROADS', 'URBAN', 'AGRI'];
  const filtered = domainFilter === 'ALL' ? schemes : schemes.filter(s => s.domain === domainFilter);
  
  const handleEditStart = (scheme) => {
    setEditingScheme(scheme.id);
    setEditData({ ...scheme });
  };
  
  const handleSave = () => {
    const updated = schemes.map(s => s.id === editingScheme ? editData : s);
    setSchemes(updated);
    setSelectedScheme(editData);
    setEditingScheme(null);
    addToast && addToast('Scheme updated successfully');
  };
  
  const handleCancel = () => {
    setEditingScheme(null);
    setEditData({});
  };
  
  const handleAddEligibility = () => {
    if (!editData.eligibility) editData.eligibility = [];
    editData.eligibility.push({ title: '', value: '' });
    setEditData({ ...editData });
  };
  
  const handleUpdateEligibility = (i, key, val) => {
    editData.eligibility[i][key] = val;
    setEditData({ ...editData });
  };
  
  const handleRemoveEligibility = (i) => {
    editData.eligibility.splice(i, 1);
    setEditData({ ...editData });
  };
  
  return (
    <div>
      <PageHeader title="Schemes & Services Master" sub={`${schemes.length} schemes · 5 domains · Data grid editing`} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 14 }}>
        <Card padding={12}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: 0.5, padding: '4px 8px 8px', textTransform: 'uppercase' }}>Filter by Domain</div>
          {domains.map(d => (
            <button key={d} onClick={() => setDomainFilter(d)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: 'none', background: domainFilter === d ? '#0EA5E9' : 'transparent', color: domainFilter === d ? '#fff' : '#6B7280', fontSize: 12, fontWeight: domainFilter === d ? 600 : 500, cursor: 'pointer', marginBottom: 4, textAlign: 'left' }}>
              {d === 'ALL' ? 'All Schemes' : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </Card>
        
        <div>
          {editingScheme ? (
            <Card padding={16} style={{ background: '#FEF3C7', border: '2px solid #FBBF24' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#0F1A2E' }}>Editing: {editData.name}</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Scheme Name</label>
                  <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, marginTop: 4 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Domain</label>
                  <select value={editData.domain} onChange={e => setEditData({ ...editData, domain: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, marginTop: 4 }}>
                    <option value="HEALTH">Health</option>
                    <option value="WATER">Water</option>
                    <option value="ROADS">Roads</option>
                    <option value="URBAN">Urban</option>
                    <option value="AGRI">Agriculture</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Description</label>
                <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 12, marginTop: 4, minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
              
              <div style={{ marginTop: 14, marginBottom: 14, paddingTop: 14, borderTop: '1px solid #FCD34D' }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Eligibility Criteria</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FEFCE8', borderBottom: '2px solid #FCD34D' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280' }}>Criteria Title</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280' }}>Values/Description</th>
                      <th style={{ width: 40, padding: '8px 10px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6B7280' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editData.eligibility && editData.eligibility.map((e, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #FEE8C3' }}>
                        <td style={{ padding: '8px 10px' }}><input value={e.title} onChange={ev => handleUpdateEligibility(i, 'title', ev.target.value)} placeholder="e.g., Age, Income" style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #D1D5DB', fontSize: 11 }} /></td>
                        <td style={{ padding: '8px 10px' }}><input value={e.value} onChange={ev => handleUpdateEligibility(i, 'value', ev.target.value)} placeholder="e.g., 18-65, BPL/EWS" style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #D1D5DB', fontSize: 11 }} /></td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}><button onClick={() => handleRemoveEligibility(i)} style={{ padding: '4px 8px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleAddEligibility} style={{ marginTop: 10, padding: '6px 12px', background: '#0EA5E9', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Add Criteria</button>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><Icon name="check" size={14} /> Save Changes</button>
                <button onClick={handleCancel} style={{ flex: 1, padding: '10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><Icon name="x" size={14} /> Cancel</button>
              </div>
            </Card>
          ) : (
            <Card padding={0}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#374151' }}>Scheme Name</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#374151' }}>Description</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#374151' }}>Domain</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#374151' }}>Budget (₹B)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #E5E7EB', background: selectedScheme?.id === s.id ? '#F0F9FF' : i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0F1A2E' }}>{s.name}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#6B7280', maxWidth: 300 }}>{s.description}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', background: '#F3F4F6', borderRadius: 4, color: '#374151' }}>{s.domain}</span></td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#0F1A2E' }}>₹{(s.budget / 100000000).toFixed(1)}B</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button onClick={() => { setSelectedScheme(s); }} style={{ padding: '6px 10px', background: '#0EA5E9', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>View</button>
                        <button onClick={() => handleEditStart(s)} style={{ padding: '6px 10px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
          
          {selectedScheme && !editingScheme && (
            <Card padding={16} style={{ marginTop: 14, background: '#F0F9FF', border: '2px solid #0EA5E9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1A2E' }}>{selectedScheme.name} — Eligibility Criteria</div>
                <button onClick={() => setSelectedScheme(null)} style={{ padding: '4px 8px', background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}><Icon name="x" size={14} /> Close</button>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#E0F2FE', borderBottom: '2px solid #0EA5E9' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#0369A1' }}>Criteria Title</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#0369A1' }}>Values/Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedScheme.eligibility && selectedScheme.eligibility.map((e, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #BAE6FD', background: i % 2 === 0 ? '#F0F9FF' : '#FFFFFF' }}>
                      <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#0F1A2E' }}>{e.title}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ M12: AUDIT LOGS ═══════════════ */
window.AdminAudit = function AdminAudit({ addToast, showAI }) {
  const [logs] = useStateC(window.GMS.AUDIT_LOGS);
  const [selected, setSelected] = useStateC(null);
  const [filter, setFilter] = useStateC({ q: '', action: 'ALL', actor: 'ALL' });

  const filtered = logs.filter(l =>
    (filter.q === '' || (l.target + l.actor).toLowerCase().includes(filter.q.toLowerCase())) &&
    (filter.action === 'ALL' || l.action === filter.action)
  );

  return (
    <div>
      <PageHeader title="Audit Logs" sub={`${logs.length} events · all admin changes are immutable & timestamped`} actions={<><Btn><Icon name="download" size={13} /> Export CSV</Btn><Btn><Icon name="search" size={13} /> Advanced Search</Btn></>} />

      {showAI && (
        <Card padding={14} style={{ marginBottom: 14, background: 'linear-gradient(135deg, #FAF5FF, #fff)', border: '1px solid #E9D5FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: 'linear-gradient(135deg, #7C3AED, #DB2777)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkles" size={16} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>AI Audit Insights · This Week</div>
              <div style={{ fontSize: 11.5, color: '#374151', marginTop: 4, lineHeight: 1.55 }}>
                <b>{logs.length}</b> admin actions logged. <b>Smt. Sonal Kanani</b> made the most changes (8). Most active module: <b>SLA Rule Engine</b> (12 edits). <span style={{ color: '#DC2626', fontWeight: 700 }}>Anomaly:</span> 3 user deletions in 1 hour at 2 AM — review for suspicious activity.
              </div>
            </div>
            <Btn size="sm">View Report</Btn>
          </div>
        </Card>
      )}

      <Card padding={12} style={{ marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
          <div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><Icon name="search" size={14} /></span><input placeholder="Search target, actor, IP…" value={filter.q} onChange={e => setFilter({...filter, q: e.target.value})} style={{...inputStyle, paddingLeft: 32}} /></div>
          <select value={filter.action} onChange={e => setFilter({...filter, action: e.target.value})} style={inputStyle}>
            <option value="ALL">All actions</option>
            {[...new Set(logs.map(l => l.action))].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filter.actor} onChange={e => setFilter({...filter, actor: e.target.value})} style={inputStyle}>
            <option value="ALL">All actors</option>
            {[...new Set(logs.map(l => l.actor))].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={0}>
        {filtered.map(l => (
          <div key={l.id} onClick={() => setSelected(l)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={l.iconName || 'log'} size={15} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: '#0F1A2E', lineHeight: 1.6 }}>
                <b>{l.actor}</b> <span style={{ color: '#6B7280' }}>({l.actorRole})</span> <span style={{ color: '#374151' }}>{l.actionLabel}</span> <b style={{ color: '#FF8C42' }}>{l.target}</b>
              </div>
              <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 3 }}>{l.tsExact} · {l.ts} · IP {l.ip} · ID {l.id}</div>
            </div>
            {l.diff && <span style={{ fontSize: 10.5, padding: '2px 7px', background: '#FEF3C7', color: '#92400E', borderRadius: 3, fontWeight: 600, alignSelf: 'flex-start' }}>diff</span>}
          </div>
        ))}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.id || ''} width={520} footer={<Btn kind="primary" onClick={() => setSelected(null)}>Close</Btn>}>
        {selected && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14, paddingBottom: 11, borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ width: 44, height: 44, borderRadius: 9, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{selected.iconName ? <Icon name={selected.iconName} size={20} /> : null}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{selected.actionLabel} {selected.target}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{selected.action}</div>
              </div>
            </div>
            {[['Actor', `${selected.actor} (${selected.actorId})`], ['Role', selected.actorRole], ['Timestamp (exact)', selected.tsExact], ['Relative', selected.ts], ['Target', selected.target], ['IP Address', selected.ip], ['Event ID', selected.id]].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', padding: '6px 0', fontSize: 12 }}>
                <div style={{ color: '#6B7280' }}>{k}</div>
                <div style={{ color: '#0F1A2E', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
            {selected.diff && (
              <div style={{ marginTop: 14, padding: 11, background: '#F9FAFB', borderRadius: 7, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>Change Diff</div>
                <pre style={{ margin: 0, fontSize: 11, fontFamily: 'ui-monospace', color: '#0F1A2E', lineHeight: 1.6 }}>
{`- Before: ${JSON.stringify(selected.diff.before)}\n+ After:  ${JSON.stringify(selected.diff.after)}`}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Phase 3 — Schemes & Services Master UI Module
const { useState, useMemo } = React;
const C = window.GMS.COLORS || { navy: '#1A3260', saffron: '#F4811F', white: '#fff', gray800: '#1F2937', gray600: '#4B5563', gray500: '#6B7280', gray300: '#D1D5DB', gray200: '#E5E7EB', green: '#10B981', red: '#EF4444', blue: '#0EA5E9' };

function AdminSchemesServices({ addToast }) {
  const [tab, setTab] = useState('master');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [testCitizenData, setTestCitizenData] = useState({ 'Annual Income': 250000, 'BPL Status': true, documents: ['Aadhaar', 'Income Certificate', 'BPL Certificate'] });
  const [eligibilityResults, setEligibilityResults] = useState([]);

  const schemes = window.GMS.SCHEMES_MASTER || [];

  const handleTestEligibility = () => {
    const results = window.GMS.checkAllSchemeEligibility(testCitizenData);
    setEligibilityResults(results);
    addToast?.(`Checked ${schemes.length} schemes. ${results.length} eligible.`, 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: `1px solid ${C.gray200}` }}>
        {['master', 'eligibility', 'test'].map(t => (
          <button key={t} onClick={() => { setTab(t); setSelectedScheme(null); }} style={{
            padding: '10px 16px', background: tab === t ? C.navy : 'transparent', color: tab === t ? C.white : C.gray600,
            border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, fontFamily: 'inherit', borderRadius: '4px 4px 0 0',
            textTransform: 'capitalize'
          }}>
            {t === 'master' ? '📋 Schemes Master' : t === 'eligibility' ? '✅ Eligibility Rules' : '🔍 Test Eligibility'}
          </button>
        ))}
      </div>

      {/* SCHEMES MASTER TAB */}
      {tab === 'master' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800 }}>5 Schemes Configured</div>
            <button onClick={() => { setEditMode(!editMode); setSelectedScheme(null); }} style={{
              padding: '8px 14px', background: editMode ? C.red : C.green, color: C.white, border: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: 11, fontFamily: 'inherit', borderRadius: 6
            }}>
              {editMode ? '✕ Cancel' : '✎ Edit'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {schemes.map((sch, i) => (
              <div key={sch.id} onClick={() => !editMode && setSelectedScheme(sch)} style={{
                background: selectedScheme?.id === sch.id ? `${C.navy}15` : C.white,
                border: selectedScheme?.id === sch.id ? `2px solid ${C.navy}` : `1px solid ${C.gray200}`,
                borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${C.saffron}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {sch.iconName === 'heart' ? '❤️' : sch.iconName === 'droplet' ? '💧' : sch.iconName === 'road' ? '🛣️' : sch.iconName === 'home' ? '🏠' : '🌾'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.gray800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sch.name}</div>
                    <div style={{ fontSize: 9, color: C.gray500 }}>{sch.domain}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: C.gray600, lineHeight: 1.4, marginBottom: 8 }}>{sch.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: C.gray500 }}>
                  <span><Icon name="clipboard" size={14} /> {sch.eligibility.criteria?.length || 0} criteria</span>
                  <span><Icon name="document" size={14} /> {sch.documents?.length || 0} docs</span>
                </div>
                {editMode && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedScheme(sch); }} style={{ flex: 1, padding: '6px 10px', background: C.blue, color: C.white, border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); addToast?.('Scheme would be deleted', 'info'); }} style={{ flex: 1, padding: '6px 10px', background: C.red, color: C.white, border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DETAIL VIEW */}
          {selectedScheme && (
            <div style={{ marginTop: 20, background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.gray800 }}>{selectedScheme.name}</div>
                <button onClick={() => setSelectedScheme(null)} style={{ background: 'none', border: 'none', color: C.gray400, cursor: 'pointer', fontSize: 18 }}><Icon name="x" size={16} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.gray600, marginBottom: 4 }}>Description</div>
                  <div style={{ fontSize: 12, color: C.gray800 }}>{selectedScheme.description}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.gray600, marginBottom: 4 }}>Coverage</div>
                  <div style={{ fontSize: 12, color: C.gray800 }}>{selectedScheme.coverage}</div>
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: C.gray800, marginBottom: 8 }}>Eligibility Criteria ({selectedScheme.eligibility.criteria?.length || 0})</div>
              <div style={{ background: C.gray50, borderRadius: 8, padding: 12, marginBottom: 14 }}>
                {(selectedScheme.eligibility.criteria || []).map((crit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i < (selectedScheme.eligibility.criteria?.length - 1) ? `1px solid ${C.gray200}` : 'none', fontSize: 11 }}>
                    <span style={{ color: C.gray600 }}><Icon name="check" size={16} /></span>
                    <span style={{ color: C.gray800, fontWeight: 500 }}>{crit.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: C.gray800, marginBottom: 8 }}>Required Documents ({selectedScheme.documents?.length || 0})</div>
              <div style={{ background: C.gray50, borderRadius: 8, padding: 12, marginBottom: 14 }}>
                {(selectedScheme.documents || []).map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i < (selectedScheme.documents?.length - 1) ? `1px solid ${C.gray200}` : 'none', fontSize: 11 }}>
                    <span style={{ color: C.gray600 }}><Icon name="document" size={16} /></span>
                    <span style={{ color: C.gray800, fontWeight: 500 }}>{doc}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setSelectedScheme(null); addToast?.('Scheme updated', 'success'); }} style={{ flex: 1, padding: '10px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Save Changes</button>
                <button onClick={() => setSelectedScheme(null)} style={{ flex: 1, padding: '10px', background: C.gray200, color: C.gray800, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ELIGIBILITY RULES TAB */}
      {tab === 'eligibility' && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800, marginBottom: 12 }}>Verification Rules</div>
          {Object.entries(window.GMS.ELIGIBILITY_RULES || {}).map(([key, rule]) => (
            <div key={key} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray800, marginBottom: 8, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 11 }}>
                <div>
                  <div style={{ fontWeight: 600, color: C.gray600, marginBottom: 4 }}>Method</div>
                  <div style={{ color: C.gray800 }}>{rule.method}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: C.gray600, marginBottom: 4 }}>Timeframe</div>
                  <div style={{ color: C.gray800 }}>{rule.timeframe}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEST ELIGIBILITY TAB */}
      {tab === 'test' && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800, marginBottom: 12 }}>Test Citizen Eligibility</div>
          <div style={{ background: C.gray50, borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.gray600, marginBottom: 10 }}>Sample Citizen Data</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.gray600, marginBottom: 4 }}>Annual Income</div>
                <input type="number" value={testCitizenData['Annual Income']} onChange={e => setTestCitizenData({ ...testCitizenData, 'Annual Income': parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.gray300}`, fontSize: 12, fontFamily: 'inherit' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.gray600, marginBottom: 4 }}>BPL Status</div>
                <select value={testCitizenData['BPL Status'] ? 'yes' : 'no'} onChange={e => setTestCitizenData({ ...testCitizenData, 'BPL Status': e.target.value === 'yes' })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.gray300}`, fontSize: 12, fontFamily: 'inherit' }}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <button onClick={handleTestEligibility} style={{ width: '100%', padding: '10px', background: C.green, color: C.white, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}><Icon name="search" size={14} /> Check Eligibility</button>
          </div>

          {eligibilityResults.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800, marginBottom: 12 }}><Icon name="check" size={14} /> Eligible Schemes ({eligibilityResults.length})</div>
              {eligibilityResults.map(result => (
                <div key={result.schemeId} style={{ background: C.white, border: `2px solid ${C.green}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}><Icon name="check" size={16} /></span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gray800 }}>{result.schemeName}</div>
                      <div style={{ fontSize: 10, color: C.gray600 }}>Coverage: {result.coverage}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.gray700, lineHeight: 1.6, padding: '10px', background: C.gray50, borderRadius: 6 }}>
                    ✓ All eligibility criteria met<br/>
                    📄 All required documents available<br/>
                    ⏱️ Estimated approval: {result.estimatedApprovalTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.AdminSchemesServices = AdminSchemesServices;

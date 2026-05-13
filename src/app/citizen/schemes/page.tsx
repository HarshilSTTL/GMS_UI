'use client';
import { useState, useEffect } from 'react';
import { Building, ExternalLink, Search } from 'lucide-react';

interface Scheme {
  id: string; title: string; description: string; category: string; department: string;
  beneficiary: string; status: string; link: string; icon: string;
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch('/api/citizen/schemes').then(r => r.json()).then(d => { setSchemes(d); setLoading(false); });
  }, []);

  const categories = ['all', ...new Set(schemes.map(s => s.category))];
  const filtered = schemes
    .filter(s => category === 'all' || s.category === category)
    .filter(s => search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[16px] font-bold text-[#0E1C2F]">Schemes & Services</h1>
        <p className="text-[11px] text-[#7A8FA6]">Government schemes and services available for citizens</p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#DDE3EE] flex-1 min-w-[200px] shadow-sm">
          <Search size={13} className="text-[#7A8FA6]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemes..." className="bg-transparent border-none outline-none text-[12px] w-full" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${category === c ? 'bg-[#F4811F] text-white' : 'bg-white text-[#3D5068] border border-[#DDE3EE] hover:bg-[#F0F2F7]'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F2F7] flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[13px] font-bold text-[#0E1C2F]">{s.title}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0 uppercase">{s.status}</span>
                </div>
                <p className="text-[11px] text-[#7A8FA6] mt-1 leading-relaxed">{s.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[9px] font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">{s.category}</span>
                  <span className="text-[9px] font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600">{s.department}</span>
                  <span className="text-[9px] font-semibold px-2 py-1 rounded bg-orange-50 text-orange-700">{s.beneficiary}</span>
                </div>
                <button className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold hover:underline">
                  <ExternalLink size={12} /> View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-[12px] text-[#7A8FA6]">No schemes found</div>
        )}
      </div>
    </div>
  );
}

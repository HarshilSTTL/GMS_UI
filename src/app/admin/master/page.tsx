'use client';
import React, { useState } from 'react';
import { Globe2, Plus, Edit2, Building2, MapPin, Users, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type MasterType = 'districts' | 'wards' | 'departments' | 'officers' | 'channels';

const MASTER_SECTIONS: { id: MasterType; label: string; icon: React.ElementType; count: number }[] = [
  { id: 'districts', label: 'Districts', icon: MapPin, count: 33 },
  { id: 'wards', label: 'Wards / Zones', icon: Building2, count: 168 },
  { id: 'departments', label: 'Departments', icon: Globe2, count: 12 },
  { id: 'officers', label: 'Officers', icon: Users, count: 47 },
  { id: 'channels', label: 'Channels', icon: Tag, count: 5 },
];

const MOCK_DISTRICTS = [
  { id: 'd1', name: 'Ahmedabad', code: 'AH', active: true, complaints: 1245 },
  { id: 'd2', name: 'Surat', code: 'SU', active: true, complaints: 987 },
  { id: 'd3', name: 'Vadodara', code: 'VA', active: true, complaints: 756 },
  { id: 'd4', name: 'Rajkot', code: 'RJ', active: true, complaints: 634 },
  { id: 'd5', name: 'Bhavnagar', code: 'BH', active: true, complaints: 423 },
  { id: 'd6', name: 'Gandhinagar', code: 'GN', active: true, complaints: 567 },
  { id: 'd7', name: 'Junagadh', code: 'JU', active: true, complaints: 234 },
  { id: 'd8', name: 'Jamnagar', code: 'JM', active: false, complaints: 189 },
];

const MOCK_CHANNELS = [
  { id: 'ch1', name: 'Web Portal', code: 'WEB', active: true, percentage: 45 },
  { id: 'ch2', name: 'Mobile App', code: 'APP', active: true, percentage: 25 },
  { id: 'ch3', name: 'WhatsApp', code: 'WAPP', active: true, percentage: 15 },
  { id: 'ch4', name: 'Call Center', code: 'CALL', active: true, percentage: 10 },
  { id: 'ch5', name: 'Letter / Post', code: 'POST', active: false, percentage: 5 },
];

export default function AdminMasterDataPage() {
  const [activeSection, setActiveSection] = useState<MasterType>('districts');

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <Globe2 size={20} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#0E1C2F]">Master Data</h1>
          <p className="text-[12px] text-[#7A8FA6]">Manage districts, wards, departments & reference data</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Section sidebar */}
        <div className="lg:w-[180px] flex-shrink-0">
          <div className="bg-white border border-[#DDE3EE] rounded-[14px] shadow-[0_1px_3px_rgba(14,28,47,0.06)] overflow-hidden lg:sticky lg:top-4">
            <nav className="p-2 space-y-0.5">
              {MASTER_SECTIONS.map(sec => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                    className={cn('flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[12px] transition-all',
                      isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-[#3D5068] hover:bg-[#F8FAFD]')}>
                    <Icon size={15} className={isActive ? 'text-blue-600' : 'text-[#7A8FA6]'} />
                    {sec.label}
                    <span className="ml-auto text-[10px] text-[#7A8FA6] bg-[#F0F2F7] px-1.5 py-0.5 rounded-full">{sec.count}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'districts' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-[#0E1C2F]">Districts</h2>
                <button onClick={() => toast.success('District added')} className="px-3 py-1.5 rounded-[10px] text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700">+ Add District</button>
              </div>
              <div className="bg-white border border-[#DDE3EE] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(14,28,47,0.08)]">
                <table className="w-full border-collapse text-[12px]">
                  <thead className="bg-[#F8FAFD]">
                    <tr>
                      {['District', 'Code', 'Complaints', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#7A8FA6] uppercase tracking-wide border-b border-[#DDE3EE]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DISTRICTS.map((d, i) => (
                      <tr key={d.id} className={cn(i !== MOCK_DISTRICTS.length - 1 && 'border-b border-[#DDE3EE]', !d.active && 'opacity-50')}>
                        <td className="px-4 py-3 font-semibold text-[#0E1C2F]">{d.name}</td>
                        <td className="px-4 py-3 text-[#3D5068] font-mono">{d.code}</td>
                        <td className="px-4 py-3 font-semibold text-[#0E1C2F]">{d.complaints.toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', d.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{d.active ? 'Active' : 'Inactive'}</span></td>
                        <td className="px-4 py-3"><button onClick={() => toast.info('Edit district')} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'channels' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-[#0E1C2F]">Channels</h2>
                <button onClick={() => toast.success('Channel added')} className="px-3 py-1.5 rounded-[10px] text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700">+ Add Channel</button>
              </div>
              <div className="space-y-3">
                {MOCK_CHANNELS.map(ch => (
                  <div key={ch.id} className={cn('bg-white border rounded-[14px] px-5 py-3.5 flex items-center justify-between shadow-[0_1px_3px_rgba(14,28,47,0.06)]', !ch.active && 'opacity-50')}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center"><Tag size={14} className="text-blue-600" /></div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#0E1C2F]">{ch.name}</p>
                        <p className="text-[10px] text-[#7A8FA6]">Code: {ch.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-[#0E1C2F]">{ch.percentage}%</p>
                        <p className="text-[10px] text-[#7A8FA6]">of complaints</p>
                      </div>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', ch.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{ch.active ? 'Active' : 'Inactive'}</span>
                      <button onClick={() => toast.info('Edit channel')} className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection !== 'districts' && activeSection !== 'channels' && (
            <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-10 shadow-[0_1px_3px_rgba(14,28,47,0.06)] text-center">
              <p className="text-[13px] text-[#7A8FA6]">{MASTER_SECTIONS.find(s => s.id === activeSection)?.label} management coming soon</p>
              <p className="text-[11px] text-[#7A8FA6] mt-1">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import {
  Building2, Plus, ChevronRight, ChevronDown, Edit2, Trash2,
  Users, Folder, MapPin, Sparkles, Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useHierarchy, useUpdateHierarchy, type HierarchyNode } from '@/hooks/useHierarchy';

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string; icon: string }> = {
  state: { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED', icon: 'MapPin' },
  department: { bg: '#DBEAFE', text: '#1E40AF', dot: '#2563EB', icon: 'Building2' },
  office: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B', icon: 'Folder' },
};

const TYPE_LABELS: Record<string, string> = {
  state: 'State',
  department: 'Department',
  office: 'Office',
};

function TreeNode({ node, depth = 0, onSelect, selectedId }: { node: HierarchyNode; depth?: number; onSelect: (n: HierarchyNode) => void; selectedId: string }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const colors = TYPE_COLORS[node.type] ?? TYPE_COLORS.office;
  const Icon = node.type === 'state' ? MapPin : node.type === 'department' ? Building2 : Folder;
  const isSel = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all cursor-pointer group',
          isSel ? 'border-blue-400 bg-blue-50' : 'bg-white border-[#DDE3EE] hover:border-blue-300 mb-1',
        )}
        style={{ marginLeft: depth * 24 }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button onClick={e => { e.stopPropagation(); setExpanded(!expanded); }} className="w-5 h-5 flex items-center justify-center text-[#7A8FA6] hover:text-[#0E1C2F]">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <div className="w-5" />
        )}

        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors.bg }}>
          <Icon size={14} style={{ color: colors.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[#0E1C2F] truncate">{node.name}</p>
          <p className="text-[10px] text-[#7A8FA6]">{TYPE_LABELS[node.type] ?? node.type}</p>
        </div>

        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text }}>
          {TYPE_LABELS[node.type] ?? node.type}
        </span>
        {node.headCount !== undefined && (
          <span className="text-[10px] text-[#7A8FA6] flex items-center gap-1">
            <Users size={11} /> {node.headCount}
          </span>
        )}

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); toast.info('Edit node'); }} className="w-6 h-6 rounded border border-[#DDE3EE] flex items-center justify-center text-[#7A8FA6] hover:bg-[#F0F2F7]">
            <Edit2 size={11} />
          </button>
          <button onClick={e => { e.stopPropagation(); toast.info('Delete node'); }} className="w-6 h-6 rounded border border-[#DDE3EE] flex items-center justify-center text-[#7A8FA6] hover:bg-red-50 hover:text-red-500 hover:border-red-200">
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminHierarchyPage() {
  const { data: tree, isLoading } = useHierarchy();
  const updateHierarchy = useUpdateHierarchy();
  const [selected, setSelected] = useState<HierarchyNode | null>(null);

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-[13px] text-[#7A8FA6]">Loading hierarchy…</div>;
  }

  const deptCount = tree?.children?.length ?? 0;
  const officeCount = tree?.children?.reduce((s, d) => s + (d.children?.length ?? 0), 0) ?? 0;
  const totalStaff = tree?.children?.reduce((s, d) => s + (d.headCount ?? 0), 0) ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Building2 size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0E1C2F]">Hierarchy Builder</h1>
            <p className="text-[12px] text-[#7A8FA6]">{deptCount} departments · {officeCount} offices · {totalStaff.toLocaleString()} total staff</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info('Add department coming soon')} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold border border-[#DDE3EE] bg-white text-[#0E1C2F] hover:bg-[#F8FAFD] transition-all">
            <Plus size={12} /> Add Department
          </button>
          <button onClick={() => { if (tree) updateHierarchy.mutate(tree, { onSuccess: () => toast.success('Structure saved') }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
            <Save size={12} /> Save Structure
          </button>
        </div>
      </div>

      {/* AI Insight */}
      <div className="p-3 bg-gradient-to-r from-[#FAF5FF] to-white border border-[#E9D5FF] rounded-lg mb-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#DB2777] text-white flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[#0E1C2F]">AI Hierarchy Optimizer</p>
          <p className="text-[11px] text-[#7A8FA6]">Detected: <b>GWSSB</b> has {deptCount} regional offices with uneven staff distribution. Consider rebalancing workload.</p>
        </div>
        <button onClick={() => toast.info('Opening suggestion')} className="text-[10.5px] text-purple-600 font-bold bg-transparent border-none cursor-pointer hover:underline flex-shrink-0">
          View Suggestion →
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        {Object.entries(TYPE_COLORS).map(([type, c]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.dot }} />
            <span className="text-[11px] capitalize text-[#3D5068] font-medium">{TYPE_LABELS[type] ?? type}</span>
          </div>
        ))}
      </div>

      {/* Tree + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="bg-[#F8FAFD] border border-[#DDE3EE] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          {tree && tree.children && tree.children.map(node => (
            <TreeNode key={node.id} node={node} depth={0} onSelect={setSelected} selectedId={selected?.id ?? ''} />
          ))}
        </div>

        {/* Detail Panel */}
        <div className="bg-white border border-[#DDE3EE] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(14,28,47,0.06)]">
          <div className="text-[13px] font-bold text-[#0E1C2F] mb-3">{selected ? 'Node Details' : 'Select a node'}</div>
          {!selected && (
            <p className="text-[12px] text-[#7A8FA6]">Click any tree node to view details and manage.</p>
          )}
          {selected && (() => {
            const colors = TYPE_COLORS[selected.type] ?? TYPE_COLORS.office;
            const Icon = selected.type === 'state' ? MapPin : selected.type === 'department' ? Building2 : Folder;
            const childCount = selected.children?.length ?? 0;
            return (
              <div>
                <div className="flex gap-3 mb-4 pb-3 border-b border-[#F3F4F6]">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: colors.bg }}>
                    <Icon size={20} style={{ color: colors.dot }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#0E1C2F] truncate">{selected.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize" style={{ background: colors.bg, color: colors.text }}>
                      {TYPE_LABELS[selected.type] ?? selected.type}
                    </span>
                  </div>
                </div>
                {([
                  ['Node ID', selected.id],
                  ['Type', TYPE_LABELS[selected.type] ?? selected.type],
                  ['Head Count', String(selected.headCount ?? '—')],
                  ['Child Nodes', String(childCount)],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[100px_1fr] py-2 border-b border-[#F3F4F6] text-[12px]">
                    <div className="text-[#6B7280] font-medium">{label}</div>
                    <div className="text-[#0E1C2F] font-medium">{value}</div>
                  </div>
                ))}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => toast.info('Add child coming soon')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-[#DDE3EE] text-[#374151] hover:bg-[#F3F4F6]">
                    <Plus size={12} /> Add Child
                  </button>
                  <button onClick={() => toast.info('Edit coming soon')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-[#DDE3EE] text-[#374151] hover:bg-[#F3F4F6]">
                    <Edit2 size={12} /> Rename
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// Phase 3 — Admin Shell: Sidebar + Topbar + Layout primitives
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

const ADMIN_NAV = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'users', icon: 'users', label: 'User Management' },
  { id: 'roles', icon: 'shield', label: 'Roles & Permissions' },
  { id: 'hierarchy', icon: 'tree', label: 'Hierarchy Builder', tag: 'CRITICAL' },
  { id: 'categories', icon: 'tag', label: 'Categories' },
  { id: 'sla', icon: 'clock', label: 'SLA Rule Engine', tag: 'CORE' },
  { id: 'workflow', icon: 'workflow', label: 'Workflow Config' },
  { id: 'escalation', icon: 'arrowUp', label: 'Escalation Matrix' },
  { id: 'notif', icon: 'bell', label: 'Notifications' },
  { id: 'ai', icon: 'bot', label: 'AI Configuration' },
  { id: 'schemes', icon: 'award', label: 'Schemes & Services' },
  { id: 'master', icon: 'folder', label: 'Master Data' },
  { id: 'audit', icon: 'log', label: 'Audit Logs' },
];

window.AdminContext = createContext({});

function AdminSidebar({ active, setActive, role }) {
  const allowed = (code) => {
    const perms = window.GMS.ROLE_PERMS[role.id] || {};
    return role.id === 'SUPER' || (perms[code] && perms[code].length > 0);
  };

  return (
    <aside style={{
      width: 256, background: '#0F1A2E', color: '#fff',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="Emblem.png" alt="Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>IGSMS Admin</div>
            <div style={{ fontSize: 10.5, opacity: 0.6, marginTop: 1 }}>Configuration Console</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 11, background: 'rgba(255,255,255,0.04)', margin: '12px', borderRadius: 8, border: `1px solid ${role.color}40` }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>{role.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{role.personName}</div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>{role.name}</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflow: 'auto', padding: '4px 10px 12px' }}>
        {ADMIN_NAV.map(item => {
          const allowedItem = allowed(item.id);
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => allowedItem && setActive(item.id)}
              disabled={!allowedItem}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                padding: '9px 12px', borderRadius: 8, border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(255,140,66,0.15), transparent)' : 'transparent',
                color: !allowedItem ? 'rgba(255,255,255,0.25)' : isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                fontSize: 12.5, fontWeight: isActive ? 600 : 500,
                cursor: allowedItem ? 'pointer' : 'not-allowed',
                marginBottom: 2,
                borderLeft: isActive ? '3px solid #FF8C42' : '3px solid transparent',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <Icon name={item.icon} size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.tag && <span style={{ fontSize: 8.5, padding: '2px 5px', background: item.tag === 'CRITICAL' ? '#DC2626' : '#7C3AED', borderRadius: 3, fontWeight: 700, letterSpacing: 0.4 }}>{item.tag}</span>}
              {!allowedItem && <Icon name="lock" size={12} />}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 10.5, opacity: 0.55, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }}></span>
        System healthy · v3.2.1
      </div>
    </aside>
  );
}

function AdminTopbar({ role, breadcrumbs, lang, onSearch }) {
  return (
    <header style={{
      height: 58, background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      gap: 18, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#6B7280' }}>
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ opacity: 0.5 }}>›</span>}
            <span style={{ color: i === breadcrumbs.length - 1 ? '#0F1A2E' : '#6B7280', fontWeight: i === breadcrumbs.length - 1 ? 600 : 500 }}>{b}</span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ flex: 1, maxWidth: 420, marginLeft: 24 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', opacity: 0.5 }}><Icon name="search" size={14} /></span>
          <input
            placeholder="Search users, rules, departments… (⌘K)"
            onChange={(e) => onSearch && onSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12.5, fontFamily: 'inherit', background: '#F9FAFB', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button title="Quick add" style={{ ...qaBtn, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="plus" size={13} /> Quick Add</button>
        <button title="System health" style={{ ...iconBtn, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="settings" size={15} /></button>
        <button title="Notifications" style={{ ...iconBtn, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" size={15} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: '#DC2626' }}></span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 12, borderLeft: '1px solid #E5E7EB' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: role.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700 }}>{role.avatar}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A2E' }}>{role.personName.replace(/^(Smt\.|Shri|Dr\.) /, '')}</div>
            <div style={{ fontSize: 10, color: '#6B7280' }}>{role.scopeName}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

const qaBtn = { padding: '7px 13px', background: '#FF8C42', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
const iconBtn = { width: 34, height: 34, borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#6B7280' };

/* ── Common UI primitives ──────────────────────── */
function Card({ children, style, padding = 18, ...rest }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding, ...style }} {...rest}>
      {children}
    </div>
  );
}

function PriorityBadge({ p }) {
  const col = { CRITICAL: '#DC2626', HIGH: '#F59E0B', MEDIUM: '#0EA5E9', LOW: '#6B7280' }[p] || '#6B7280';
  return <span style={{ display: 'inline-block', padding: '2px 8px', fontSize: 10, fontWeight: 700, color: col, background: col + '15', border: '1px solid ' + col + '40', borderRadius: 4, letterSpacing: 0.4 }}>{p}</span>;
}

function StatusBadge({ status }) {
  const map = { ACTIVE: ['#16A34A', 'Active'], INACTIVE: ['#6B7280', 'Inactive'], SUSPENDED: ['#DC2626', 'Suspended'], DRAFT: ['#F59E0B', 'Draft'] };
  const [c, lbl] = map[status] || ['#6B7280', status];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: c }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: c }}></span>{lbl}</span>;
}

function Toggle({ on, onChange, size = 'md' }) {
  const w = size === 'sm' ? 32 : 38, h = size === 'sm' ? 18 : 22;
  return (
    <button onClick={onChange} style={{
      width: w, height: h, borderRadius: h, border: 'none',
      background: on ? '#16A34A' : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? w - h + 2 : 2,
        width: h - 4, height: h - 4, borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}></span>
    </button>
  );
}

function Btn({ kind = 'default', children, onClick, style, disabled, size = 'md' }) {
  const sizeStyle = size === 'sm' ? { padding: '5px 10px', fontSize: 11 } : { padding: '8px 14px', fontSize: 12.5 };
  const kindStyle = {
    primary: { background: '#FF8C42', color: '#fff', border: '1px solid #FF8C42' },
    default: { background: '#fff', color: '#0F1A2E', border: '1px solid #E5E7EB' },
    ghost: { background: 'transparent', color: '#1A3260', border: '1px solid transparent' },
    danger: { background: '#fff', color: '#DC2626', border: '1px solid #FCA5A5' },
    dark: { background: '#0F1A2E', color: '#fff', border: '1px solid #0F1A2E' },
    success: { background: '#16A34A', color: '#fff', border: '1px solid #16A34A' },
  }[kind];
  return <button disabled={disabled} onClick={onClick} style={{ ...sizeStyle, ...kindStyle, borderRadius: 7, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: 'inherit', ...style }}>{children}</button>;
}

function Modal({ open, onClose, title, children, width = 540, footer }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,26,46,0.5)', backdropFilter: 'blur(2px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width, maxWidth: '90vw', maxHeight: '85vh', background: '#fff', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: '#6B7280' }}>×</button>
        </div>
        <div style={{ padding: 20, overflow: 'auto', flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: '12px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#F9FAFB' }}>{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0F1A2E', color: '#fff', padding: '11px 18px', borderRadius: 9, fontSize: 12.5, fontWeight: 500, zIndex: 200, boxShadow: '0 8px 24px rgba(15,26,46,0.4)', display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ color: '#16A34A', display: 'flex' }}><Icon name="check" size={14} /></span>
      {msg}
    </div>
  );
}

function PageHeader({ title, sub, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #E5E7EB' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.3, color: '#0F1A2E' }}>{title}</h1>
        {sub && <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 4 }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

function Empty({ icon = 'folder', label = 'No items', sub }) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280' }}>
      <div style={{ marginBottom: 8, opacity: 0.5 }}><Icon name={icon} size={40} /></div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}

function AIBadge({ children, color = '#7C3AED' }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', fontSize: 10, fontWeight: 700, color, background: color + '15', border: '1px solid ' + color + '30', borderRadius: 4, letterSpacing: 0.3 }}><Icon name="sparkles" size={10} /> {children}</span>;
}

Object.assign(window, { ADMIN_NAV, AdminSidebar, AdminTopbar, Card, PriorityBadge, StatusBadge, Toggle, Btn, Modal, Toast, PageHeader, Empty, AIBadge });

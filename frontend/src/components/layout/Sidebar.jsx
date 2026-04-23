import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, FileText, Folder,
  Fuel, MapPin, UserPlus, ChevronLeft, ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/service-orders', icon: ClipboardList, label: 'Ordens de Serviço' },
  { to: '/contracts', icon: FileText, label: 'Contratos' },
  { to: '/documents', icon: Folder, label: 'Documentos' },
  { to: '/fuel', icon: Fuel, label: 'Combustível' },
  { to: '/routes', icon: MapPin, label: 'Rotas' },
  { to: '/prospects', icon: UserPlus, label: 'Prospects' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="IDEIAS iServices" className={styles.logoImg} />
        {!collapsed && (
          <div>
            <span className={styles.logoText}>IDEIAS</span>
            <span className={styles.logoSub}>iServices</span>
          </div>
        )}
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className={styles.navIcon} />
            {!collapsed && <span className={styles.navLabel}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className={styles.collapseBtn} onClick={onToggle} title={collapsed ? 'Expandir' : 'Recolher'}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

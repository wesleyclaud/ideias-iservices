import { useState } from 'react';
import { Menu, Moon, Sun, Bell, Globe, ChevronDown, LogOut, User } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

const ROLE_LABELS = { admin: 'Administrador', gestor: 'Gestor', coordenador: 'Coordenador', tecnico: 'Técnico', financeiro: 'Financeiro' };

export default function Header({ onMenuToggle, pageTitle, breadcrumbs }) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} title="Menu">
          <Menu size={20} />
        </button>
        <div>
          {breadcrumbs && (
            <nav className={styles.breadcrumbs}>
              {breadcrumbs.map((b, i) => (
                <span key={i}>
                  {i > 0 && <span className={styles.sep}>/</span>}
                  <span className={i === breadcrumbs.length - 1 ? styles.breadActive : styles.breadLink}>{b}</span>
                </span>
              ))}
            </nav>
          )}
          <h2 className={styles.pageTitle}>{pageTitle}</h2>
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} title="Idioma (PT/EN/ES)">
          <Globe size={18} />
          <span className={styles.langLabel}>PT</span>
        </button>

        <button className={styles.iconBtn} onClick={toggleTheme} title="Alternar tema">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className={styles.iconBtn} title="Notificações">
          <Bell size={18} />
          <span className={styles.badge}>3</span>
        </button>

        <div className={styles.avatarArea}>
          <button
            className={styles.avatarBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>{ROLE_LABELS[user?.role]}</span>
            </div>
            <ChevronDown size={14} className={dropdownOpen ? styles.chevronOpen : ''} />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropHeader}>
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <button className={styles.dropItem}>
                <User size={15} /> Minha Conta
              </button>
              <div className={styles.dropDivider} />
              <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={signOut}>
                <LogOut size={15} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

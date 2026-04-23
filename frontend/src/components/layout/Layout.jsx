import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.css';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard', breadcrumbs: ['Home', 'Dashboard'] },
  '/service-orders': { title: 'Ordens de Serviço', breadcrumbs: ['Home', 'Ordens de Serviço'] },
  '/contracts': { title: 'Contratos', breadcrumbs: ['Home', 'Contratos'] },
  '/documents': { title: 'Documentos', breadcrumbs: ['Home', 'Documentos'] },
  '/fuel': { title: 'Combustível', breadcrumbs: ['Home', 'Combustível'] },
  '/routes': { title: 'Rotas', breadcrumbs: ['Home', 'Rotas'] },
  '/prospects': { title: 'Prospects', breadcrumbs: ['Home', 'Prospects'] },
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: 'IDEIAS - iServices', breadcrumbs: ['Home'] };

  return (
    <div className={styles.root}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={styles.main}>
        <Header
          onMenuToggle={() => setCollapsed(!collapsed)}
          pageTitle={meta.title}
          breadcrumbs={meta.breadcrumbs}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          © IDEIAS Brasil Tecnologia — 2026
        </footer>
      </div>
    </div>
  );
}

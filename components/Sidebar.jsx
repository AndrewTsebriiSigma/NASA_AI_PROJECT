import { NavLink } from 'react-router-dom';
import useStore from '../store/useStore';

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();
  
  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      path: '/analyze',
      label: 'Analyze',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      path: '/models',
      label: 'Models',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
        </svg>
      ),
    },
    {
      path: '/about',
      label: 'About',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      ),
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
        </svg>
      ),
    },
  ];
  
  return (
    <aside className={`exo-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <nav>
        <ul className="exo-sidebar__nav">
          {navItems.map((item) => (
            <li key={item.path} className="exo-sidebar__item">
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => 
                  `exo-sidebar__link ${isActive ? 'active' : ''}`
                }
              >
                <span className="exo-sidebar__icon">{item.icon}</span>
                <span className="exo-sidebar__text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <button
        className="exo-btn ghost"
        style={{ margin: '12px', width: 'calc(100% - 24px)' }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points={sidebarCollapsed ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}/>
        </svg>
        {!sidebarCollapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
};

export default Sidebar;


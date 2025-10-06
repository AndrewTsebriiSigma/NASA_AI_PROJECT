import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Header = () => {
  const { logsOpen, setLogsOpen } = useStore();
  
  return (
    <header className="exo-header">
      <div className="exo-header__logo">
        <svg className="exo-header__logo-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-4.28-1.04-7-5.29-7-9.5V8.32l7-3.82 7 3.82V11c0 4.21-2.72 8.46-7 9.5zm-1-7.5h2v2h-2v-2zm0-6h2v5h-2V7z"/>
        </svg>
        <h1 className="exo-header__title">Searching Lucerna</h1>
      </div>
      
      <div className="exo-header__actions">
        <button 
          className="exo-btn ghost icon" 
          onClick={() => setLogsOpen(!logsOpen)}
          aria-label="Toggle logs"
          title="Toggle logs"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </button>
        
        <Link to="/analyze" className="exo-btn accent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          New Analysis
        </Link>
      </div>
    </header>
  );
};

export default Header;


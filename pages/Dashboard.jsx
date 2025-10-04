import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Dashboard = () => {
  const { recentRuns } = useStore();
  
  return (
    <main className="exo-main">
      {/* Welcome Section */}
      <section className="exo-card span-12">
        <h2 className="exo-card__title">Welcome to ExoScope</h2>
        <p className="exo-card__sub">
          AI-powered exoplanet classification using Kepler, K2, and TESS light curve data
        </p>
      </section>
      
      {/* Quick Start Cards */}
      <section className="exo-card span-8">
        <h3 className="exo-card__title">Quick Start</h3>
        <div className="exo-quick-start">
          <Link to="/analyze" className="exo-quick-card">
            <svg className="exo-quick-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <h4 className="exo-quick-card__title">Upload CSV</h4>
            <p className="exo-quick-card__desc">Upload your light curve data</p>
          </Link>
          
          <Link to="/analyze" className="exo-quick-card">
            <svg className="exo-quick-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <h4 className="exo-quick-card__title">Search Target</h4>
            <p className="exo-quick-card__desc">Query MAST by KIC/TIC ID</p>
          </Link>
          
          <Link to="/models" className="exo-quick-card">
            <svg className="exo-quick-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
            </svg>
            <h4 className="exo-quick-card__title">View Models</h4>
            <p className="exo-quick-card__desc">Explore model metrics</p>
          </Link>
        </div>
      </section>
      
      {/* Model Status */}
      <section className="exo-card span-4">
        <h3 className="exo-card__title">Model Status</h3>
        <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px', marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Active Model</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>CNN Classifier</p>
        </div>
        <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>F1 Score</p>
          <p className="tabular-nums" style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-accent-3)' }}>0.92</p>
        </div>
        <Link to="/models" className="exo-btn ghost" style={{ width: '100%', marginTop: '12px' }}>
          View All Models
        </Link>
      </section>
      
      {/* Recent Runs */}
      <section className="exo-card span-12">
        <h3 className="exo-card__title">Recent Runs</h3>
        {recentRuns.length === 0 ? (
          <div className="exo-empty">
            <p>No recent runs yet. Start by analyzing your first target!</p>
          </div>
        ) : (
          <ul className="exo-recent-runs">
            {recentRuns.map((run) => {
              const getBadgeClass = () => {
                if (run.prediction === 'Confirmed') return 'success';
                if (run.prediction === 'Candidate') return 'info';
                return 'error';
              };
              
              return (
                <li key={run.id} className="exo-run-item">
                  <div className="exo-run-item__info">
                    <div className="exo-run-item__target">{run.target}</div>
                    <div className="exo-run-item__time">
                      {new Date(run.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`exo-badge ${getBadgeClass()}`}>
                      {run.prediction}
                    </span>
                    <span className="tabular-nums" style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
                      {(run.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      
      {/* About Section */}
      <section className="exo-card span-12">
        <h3 className="exo-card__title">About This Project</h3>
        <p className="exo-card__sub">
          ExoScope is built for NASA Space Apps 2025 Challenge: "A World Away: Hunting for Exoplanets with AI". 
          This platform uses machine learning to classify exoplanet candidates from light curve data collected by 
          Kepler, K2, and TESS missions. The AI models analyze transit signals, periodograms, and various statistical 
          features to identify potential exoplanets with high accuracy.
        </p>
        <Link to="/about" className="exo-btn ghost" style={{ marginTop: '12px' }}>
          Learn More
        </Link>
      </section>
    </main>
  );
};

export default Dashboard;


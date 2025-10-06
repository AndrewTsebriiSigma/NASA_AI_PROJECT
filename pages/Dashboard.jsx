import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Dashboard = () => {
  const { recentRuns } = useStore();
  
  return (
    <main className="exo-main">
      {/* Welcome Section */}
      <section className="exo-card span-12">
        <h2 className="exo-card__title">Welcome to Searching Lucerna</h2>
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
      
      {/* Classification Statistics */}
      <section className="exo-card span-4">
        <h3 className="exo-card__title">Classification Categories</h3>
        <p className="exo-card__sub" style={{ marginBottom: '16px' }}>
          Our AI classifies targets into three categories
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'rgba(43, 240, 160, 0.1)', border: '1px solid rgba(43, 240, 160, 0.3)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2bf0a0" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-accent-3)' }}>
                Confirmed Exoplanet
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginLeft: '28px' }}>
              Verified planetary system with high confidence
            </p>
          </div>
          
          <div style={{ padding: '12px', background: 'rgba(0, 209, 255, 0.1)', border: '1px solid rgba(0, 209, 255, 0.3)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d1ff" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-accent)' }}>
                Planetary Candidate
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginLeft: '28px' }}>
              Strong transit signal requiring further validation
            </p>
          </div>
          
          <div style={{ padding: '12px', background: 'rgba(255, 77, 109, 0.1)', border: '1px solid rgba(255, 77, 109, 0.3)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-error)' }}>
                False Positive
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginLeft: '28px' }}>
              Not a planet - stellar activity or instrument noise
            </p>
          </div>
        </div>
        
        <Link to="/analyze" className="exo-btn accent" style={{ width: '100%', marginTop: '16px' }}>
          Start Classification
        </Link>
      </section>
      
      {/* Model Status */}
      <section className="exo-card span-4">
        <h3 className="exo-card__title">Model Status</h3>
        <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px', marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Active Model</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>
            {recentRuns.length > 0 ? 'Random Forest (K2)' : '--'}
          </p>
        </div>
        <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>F1 Score</p>
          <p className="tabular-nums" style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-accent-3)' }}>
            {recentRuns.length > 0 ? '--' : '--'}
          </p>
        </div>
        <Link to="/models" className="exo-btn ghost" style={{ width: '100%', marginTop: '12px' }}>
          View All Models
        </Link>
      </section>
      
      {/* Classification Distribution */}
      <section className="exo-card span-4">
        <h3 className="exo-card__title">Classification Distribution</h3>
        <p className="exo-card__sub" style={{ marginBottom: '16px' }}>
          Recent analysis results breakdown
        </p>
        
        {(() => {
          const confirmed = recentRuns.filter(r => r.prediction === 'Confirmed').length;
          const candidate = recentRuns.filter(r => r.prediction === 'Candidate').length;
          const notPlanet = recentRuns.filter(r => r.prediction === 'Not a Planet').length;
          const total = recentRuns.length;
          
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-accent-3)', fontWeight: '500' }}>Confirmed</span>
                  <span className="tabular-nums" style={{ fontSize: '13px', color: 'var(--color-text)' }}>
                    {confirmed} ({total > 0 ? ((confirmed / total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div style={{ background: '#0e1430', borderRadius: '12px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${total > 0 ? (confirmed / total) * 100 : 0}%`, 
                    height: '100%', 
                    background: 'var(--color-accent-3)', 
                    borderRadius: '12px',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 12px var(--glow-green)'
                  }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: '500' }}>Candidate</span>
                  <span className="tabular-nums" style={{ fontSize: '13px', color: 'var(--color-text)' }}>
                    {candidate} ({total > 0 ? ((candidate / total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div style={{ background: '#0e1430', borderRadius: '12px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${total > 0 ? (candidate / total) * 100 : 0}%`, 
                    height: '100%', 
                    background: 'var(--color-accent)', 
                    borderRadius: '12px',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 12px var(--glow-cyan)'
                  }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-error)', fontWeight: '500' }}>False Positive</span>
                  <span className="tabular-nums" style={{ fontSize: '13px', color: 'var(--color-text)' }}>
                    {notPlanet} ({total > 0 ? ((notPlanet / total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div style={{ background: '#0e1430', borderRadius: '12px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${total > 0 ? (notPlanet / total) * 100 : 0}%`, 
                    height: '100%', 
                    background: 'var(--color-error)', 
                    borderRadius: '12px',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 12px var(--glow-red)'
                  }} />
                </div>
              </div>
              
              <div style={{ marginTop: '8px', padding: '12px', background: '#0b1120', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Total Analyzed</p>
                <p className="tabular-nums" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-accent)' }}>
                  {total}
                </p>
              </div>
            </div>
          );
        })()}
      </section>
      
      {/* Recent Runs */}
      <section className="exo-card span-8">
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
        <p className="exo-card__sub" style={{ marginBottom: '16px' }}>
          ExoScope is built for NASA Space Apps 2025 Challenge: "A World Away: Hunting for Exoplanets with AI". 
          This platform uses machine learning to classify exoplanet candidates from light curve data collected by 
          Kepler, K2, and TESS missions.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '16px', background: '#0b1120', borderRadius: '10px', borderLeft: '3px solid var(--color-accent-3)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-accent-3)', marginBottom: '8px' }}>
              ✓ Confirmed Exoplanets
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', lineHeight: '1.5' }}>
              High-confidence detections with validated transit signals, consistent period, and ruled out false positive scenarios.
            </p>
          </div>
          
          <div style={{ padding: '16px', background: '#0b1120', borderRadius: '10px', borderLeft: '3px solid var(--color-accent)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-accent)', marginBottom: '8px' }}>
              ? Planetary Candidates
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', lineHeight: '1.5' }}>
              Strong transit signals requiring additional observations or analysis to rule out stellar activity or binary star systems.
            </p>
          </div>
          
          <div style={{ padding: '16px', background: '#0b1120', borderRadius: '10px', borderLeft: '3px solid var(--color-error)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-error)', marginBottom: '8px' }}>
              ✗ False Positives
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', lineHeight: '1.5' }}>
              Non-planetary phenomena such as eclipsing binaries, stellar variability, or instrument artifacts.
            </p>
          </div>
        </div>
        
        <Link to="/about" className="exo-btn ghost">
          Learn More About Our AI Models
        </Link>
      </section>
    </main>
  );
};

export default Dashboard;


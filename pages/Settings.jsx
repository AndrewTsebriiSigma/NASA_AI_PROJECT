import { useState } from 'react';
import useStore from '../store/useStore';

const Settings = () => {
  const { reducedMotion, setReducedMotion } = useStore();
  const [theme, setTheme] = useState('neon-cyan');
  
  const handleReducedMotionToggle = (e) => {
    const enabled = e.target.checked;
    setReducedMotion(enabled);
    
    if (enabled) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };
  
  return (
    <main className="exo-main">
      <section className="exo-card span-12">
        <h2 className="exo-card__title">Settings</h2>
        <p className="exo-card__sub">Customize your ExoScope experience</p>
      </section>
      
      {/* Theme Settings */}
      <section className="exo-card span-6">
        <h3 className="exo-card__title">Theme</h3>
        
        <div className="exo-input-wrapper">
          <label className="exo-label" htmlFor="theme-select">Accent Color</label>
          <select 
            id="theme-select"
            className="exo-input"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="neon-cyan">Neon Cyan (Default)</option>
            <option value="neon-violet">Neon Violet</option>
            <option value="neon-green">Neon Green</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '6px' }}>
            Choose your preferred accent color for the interface
          </p>
        </div>
        
        <div style={{ marginTop: '20px', padding: '16px', background: '#0b1120', borderRadius: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
            <strong style={{ color: 'var(--color-text)' }}>Theme Preview</strong>
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span className="exo-badge info">Info Badge</span>
            <span className="exo-badge success">Success Badge</span>
            <span className="exo-badge warning">Warning Badge</span>
            <span className="exo-badge error">Error Badge</span>
          </div>
        </div>
      </section>
      
      {/* Accessibility Settings */}
      <section className="exo-card span-6">
        <h3 className="exo-card__title">Accessibility</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={reducedMotion}
              onChange={handleReducedMotionToggle}
              style={{ 
                width: '18px', 
                height: '18px', 
                cursor: 'pointer',
                accentColor: 'var(--color-accent)',
              }}
            />
            <div>
              <div style={{ fontWeight: '500', color: 'var(--color-text)' }}>Reduced Motion</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-dim)' }}>
                Minimize animations for better accessibility
              </div>
            </div>
          </label>
        </div>
        
        <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', lineHeight: '1.6' }}>
            ExoScope follows WCAG AA accessibility guidelines with keyboard navigation support, 
            high contrast ratios, and screen reader compatibility.
          </p>
        </div>
      </section>
      
      {/* API Configuration */}
      <section className="exo-card span-12">
        <h3 className="exo-card__title">API Configuration</h3>
        <p className="exo-card__sub">Configure external data sources and endpoints</p>
        
        <div className="exo-input-wrapper">
          <label className="exo-label" htmlFor="api-url">Backend API URL</label>
          <input 
            id="api-url"
            type="text"
            className="exo-input"
            placeholder="http://localhost:3000/api"
            defaultValue="http://localhost:3000/api"
          />
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '6px' }}>
            Set this to your backend server URL for live model inference
          </p>
        </div>
        
        <div className="exo-input-wrapper">
          <label className="exo-label" htmlFor="mast-key">MAST API Key (Optional)</label>
          <input 
            id="mast-key"
            type="password"
            className="exo-input"
            placeholder="Enter MAST API key if required"
          />
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '6px' }}>
            Optional authentication for MAST archive queries
          </p>
        </div>
        
        <button className="exo-btn primary" style={{ marginTop: '12px' }}>
          Save Configuration
        </button>
      </section>
      
      {/* Keyboard Shortcuts */}
      <section className="exo-card span-12">
        <h3 className="exo-card__title">Keyboard Shortcuts</h3>
        
        <div className="exo-table">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code style={{ padding: '2px 6px', background: '#0b1120', borderRadius: '4px' }}>/</code></td>
                <td>Focus search input</td>
              </tr>
              <tr>
                <td><code style={{ padding: '2px 6px', background: '#0b1120', borderRadius: '4px' }}>u</code></td>
                <td>Open upload dialog</td>
              </tr>
              <tr>
                <td><code style={{ padding: '2px 6px', background: '#0b1120', borderRadius: '4px' }}>r</code></td>
                <td>Run classification</td>
              </tr>
              <tr>
                <td><code style={{ padding: '2px 6px', background: '#0b1120', borderRadius: '4px' }}>?</code></td>
                <td>Show keyboard shortcuts help</td>
              </tr>
              <tr>
                <td><code style={{ padding: '2px 6px', background: '#0b1120', borderRadius: '4px' }}>Esc</code></td>
                <td>Close modals</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Settings;


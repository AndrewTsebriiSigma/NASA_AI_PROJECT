const About = () => {
  return (
    <main className="exo-main">
      <section className="exo-card span-12">
        <h2 className="exo-card__title">About ExoScope</h2>
        <p className="exo-card__sub">
          AI-Powered Exoplanet Classification Platform
        </p>
      </section>
      
      <section className="exo-card span-8">
        <h3 className="exo-card__title">Challenge Overview</h3>
        <div style={{ lineHeight: '1.7', color: 'var(--color-text-dim)' }}>
          <p style={{ marginBottom: '16px' }}>
            ExoScope was developed for the <strong style={{ color: 'var(--color-text)' }}>NASA Space Apps 2025</strong> challenge: 
            <em style={{ color: 'var(--color-accent)' }}> "A World Away: Hunting for Exoplanets with AI"</em>.
          </p>
          
          <p style={{ marginBottom: '16px' }}>
            The platform leverages advanced machine learning techniques to analyze light curves from space telescopes 
            (Kepler, K2, and TESS) to identify potential exoplanets. By examining periodic dips in stellar brightness 
            caused by planetary transits, our AI models can classify targets as confirmed planets, planet candidates, 
            or false positives.
          </p>
          
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: 'var(--color-text)' }}>
            Key Features
          </h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}>CSV upload for custom light curve data</li>
            <li style={{ marginBottom: '8px' }}>Direct MAST archive integration for KIC/TIC target lookup</li>
            <li style={{ marginBottom: '8px' }}>Multiple AI models (CNN, Random Forest, TLS+ML Hybrid)</li>
            <li style={{ marginBottom: '8px' }}>Interactive visualizations (raw, detrended, periodogram, phase-folded)</li>
            <li style={{ marginBottom: '8px' }}>Explainability features showing model reasoning</li>
            <li style={{ marginBottom: '8px' }}>Links to official exoplanet archives</li>
          </ul>
        </div>
      </section>
      
      <section className="exo-card span-4">
        <h3 className="exo-card__title">Technology Stack</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="exo-badge info">React</div>
          <div className="exo-badge info">Plotly.js</div>
          <div className="exo-badge info">Zustand</div>
          <div className="exo-badge info">Python (Backend)</div>
          <div className="exo-badge info">TensorFlow / PyTorch</div>
          <div className="exo-badge info">Scikit-learn</div>
        </div>
      </section>
      
      <section className="exo-card span-12">
        <h3 className="exo-card__title">Data Sources & Attribution</h3>
        <div style={{ lineHeight: '1.7', color: 'var(--color-text-dim)' }}>
          <p style={{ marginBottom: '12px' }}>
            This project utilizes data from the following missions and archives:
          </p>
          
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--color-text)' }}>NASA Kepler Mission</strong>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                The Kepler space telescope discovered thousands of exoplanets by monitoring stellar brightness.
              </p>
            </div>
            
            <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--color-text)' }}>K2 Extended Mission</strong>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                Continuation of Kepler observations focusing on different regions of the sky.
              </p>
            </div>
            
            <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--color-text)' }}>TESS (Transiting Exoplanet Survey Satellite)</strong>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                NASA's newest planet hunter, surveying the entire sky for transiting exoplanets.
              </p>
            </div>
            
            <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--color-text)' }}>MAST (Mikulski Archive for Space Telescopes)</strong>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                STScI archive providing access to Kepler, K2, and TESS data.
              </p>
            </div>
            
            <div style={{ padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--color-text)' }}>NASA Exoplanet Archive</strong>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                Comprehensive database of confirmed exoplanets and candidates (KOIs, TOIs).
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="exo-card span-12">
        <h3 className="exo-card__title">Team & Contact</h3>
        <p className="exo-card__sub">
          Built with passion for the NASA Space Apps 2025 Challenge. For questions or collaboration, 
          reach out through the Space Apps platform.
        </p>
        
        <div className="exo-links" style={{ marginTop: '16px' }}>
          <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noopener noreferrer" className="exo-link-btn">
            NASA Space Apps
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          
          <a href="https://exoplanets.nasa.gov/" target="_blank" rel="noopener noreferrer" className="exo-link-btn">
            NASA Exoplanets
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
};

export default About;


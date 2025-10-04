import useStore from '../store/useStore';

const ClassificationResults = () => {
  const { classificationResult, probabilities } = useStore();
  
  if (!classificationResult || !probabilities) {
    return (
      <div className="exo-card">
        <h3 className="exo-card__title">Classification Results</h3>
        <div className="exo-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3, margin: '0 auto 12px' }}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <p>Run classification to see results</p>
        </div>
      </div>
    );
  }
  
  const getBadgeClass = () => {
    if (classificationResult === 'Confirmed') return 'success';
    if (classificationResult === 'Candidate') return 'info';
    return 'error';
  };
  
  const probabilityData = [
    { 
      name: 'Confirmed Planet', 
      value: probabilities.confirmed, 
      class: 'confirmed',
      color: 'var(--color-accent-3)',
    },
    { 
      name: 'Planet Candidate', 
      value: probabilities.candidate, 
      class: 'candidate',
      color: 'var(--color-accent)',
    },
    { 
      name: 'Not a Planet', 
      value: probabilities.notPlanet, 
      class: 'not-planet',
      color: 'var(--color-error)',
    },
  ];
  
  return (
    <div className="exo-card">
      <h3 className="exo-card__title">Classification Results</h3>
      
      <div className="exo-results">
        <div className="exo-results__class">
          <span className="exo-results__label">Prediction:</span>
          <span className={`exo-badge ${getBadgeClass()}`}>
            {classificationResult}
          </span>
        </div>
        
        <div className="exo-probability-bars">
          {probabilityData.map((item) => (
            <div key={item.class} className="exo-probability-bar">
              <div className="exo-probability-bar__label">
                <span className="exo-probability-bar__name">{item.name}</span>
                <span className="exo-probability-bar__value">
                  {(item.value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="exo-probability-bar__track">
                <div 
                  className={`exo-probability-bar__fill ${item.class}`}
                  style={{ 
                    width: `${item.value * 100}%`,
                    color: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px', padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
            Confidence Score
          </p>
          <p className="tabular-nums" style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-accent)' }}>
            {(Math.max(...probabilityData.map(p => p.value)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResults;


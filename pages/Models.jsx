import { useState, useEffect } from 'react';
import { getModels } from '../lib/api';

const Models = () => {
  const [models, setModels] = useState([]);
  
  useEffect(() => {
    getModels().then(setModels);
  }, []);
  
  return (
    <main className="exo-main">
      <section className="exo-card span-12">
        <h2 className="exo-card__title">Available Models</h2>
        <p className="exo-card__sub">
          Explore our machine learning models trained for exoplanet classification
        </p>
      </section>
      
      {models.map((model) => (
        <section key={model.id} className="exo-card span-4">
          <h3 className="exo-card__title">{model.name}</h3>
          <p className="exo-card__sub">{model.description}</p>
          
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text)' }}>
              Performance Metrics
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px', background: '#0b1120', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>Precision</div>
                <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-accent)' }}>
                  {model.metrics.precision.toFixed(2)}
                </div>
              </div>
              
              <div style={{ padding: '10px', background: '#0b1120', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>Recall</div>
                <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-accent-2)' }}>
                  {model.metrics.recall.toFixed(2)}
                </div>
              </div>
              
              <div style={{ padding: '10px', background: '#0b1120', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>F1 Score</div>
                <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-accent-3)' }}>
                  {model.metrics.f1.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
      
      {/* Confusion Matrix Placeholder */}
      <section className="exo-card span-8">
        <h3 className="exo-card__title">Confusion Matrix</h3>
        <p className="exo-card__sub">Model performance across different classes</p>
        
        <div style={{ marginTop: '20px' }}>
          <div className="exo-table">
            <table>
              <thead>
                <tr>
                  <th>Actual \ Predicted</th>
                  <th>Confirmed</th>
                  <th>Candidate</th>
                  <th>Not a Planet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '600' }}>Confirmed</td>
                  <td className="tabular-nums" style={{ color: 'var(--color-accent-3)' }}>156</td>
                  <td className="tabular-nums">12</td>
                  <td className="tabular-nums">3</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Candidate</td>
                  <td className="tabular-nums">8</td>
                  <td className="tabular-nums" style={{ color: 'var(--color-accent)' }}>241</td>
                  <td className="tabular-nums">15</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Not a Planet</td>
                  <td className="tabular-nums">2</td>
                  <td className="tabular-nums">11</td>
                  <td className="tabular-nums" style={{ color: 'var(--color-error)' }}>892</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* Training Info */}
      <section className="exo-card span-4">
        <h3 className="exo-card__title">Training Info</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
              Training Dataset
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>
              Kepler + K2 + TESS
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
              Total Samples
            </div>
            <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>
              15,340
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
              Last Updated
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>
              Oct 2025
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
              Validation Method
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>
              5-Fold CV
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Models;


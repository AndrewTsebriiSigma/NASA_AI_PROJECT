import useStore from '../store/useStore';
import Plot from 'react-plotly.js';

const Explainability = () => {
  const { explainability } = useStore();
  
  if (!explainability) {
    return (
      <div className="exo-card">
        <h3 className="exo-card__title">Explainability</h3>
        <div className="exo-empty">
          <p>Explainability data will appear after classification</p>
        </div>
      </div>
    );
  }
  
  const { featureImportance, rationale } = explainability;
  
  const chartData = [{
    x: featureImportance.slice(0, 8).map(f => f.importance),
    y: featureImportance.slice(0, 8).map(f => f.feature),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: '#7c4dff',
      line: {
        color: '#4a2a86',
        width: 1,
      },
    },
  }];
  
  const layout = {
    autosize: true,
    height: 300,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#0b1224',
    font: {
      family: 'Inter, sans-serif',
      size: 12,
      color: '#e3ecff',
    },
    xaxis: {
      title: 'Importance',
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    yaxis: {
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    margin: { l: 140, r: 20, t: 20, b: 40 },
  };
  
  const config = {
    responsive: true,
    displayModeBar: false,
  };
  
  return (
    <div className="exo-card">
      <h3 className="exo-card__title">Explainability</h3>
      
      <div className="exo-explain__section">
        <h4 className="exo-explain__subtitle">Feature Importance</h4>
        <Plot
          data={chartData}
          layout={layout}
          config={config}
          style={{ width: '100%' }}
          useResizeHandler={true}
        />
      </div>
      
      <div className="exo-explain__section">
        <h4 className="exo-explain__subtitle">Model Rationale</h4>
        <div className="exo-explain__rationale">
          <ul>
            {rationale.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Explainability;


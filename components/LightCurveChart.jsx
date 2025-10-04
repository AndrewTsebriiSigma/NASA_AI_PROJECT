import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const LightCurveChart = ({ data, title = "Light Curve", detrended = false }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const times = data.map(d => d.time);
    const fluxes = data.map(d => d.flux);
    
    return [{
      x: times,
      y: fluxes,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: 3,
        color: '#00d1ff',
        opacity: 0.6,
      },
      name: 'Flux',
    }];
  }, [data]);
  
  if (!chartData) {
    return (
      <div className="exo-chart">
        <div className="exo-chart__header">
          <h3 className="exo-chart__title">{title}</h3>
        </div>
        <div className="exo-chart__canvas">
          <div className="skeleton" style={{ width: '100%', height: '220px' }}></div>
        </div>
      </div>
    );
  }
  
  const layout = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#0b1224',
    font: {
      family: 'Inter, sans-serif',
      size: 12,
      color: '#e3ecff',
    },
    xaxis: {
      title: 'Time (days)',
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    yaxis: {
      title: detrended ? 'Normalized Flux' : 'Flux',
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    hovermode: 'closest',
  };
  
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  };
  
  return (
    <div className="exo-chart">
      <div className="exo-chart__header">
        <h3 className="exo-chart__title">{title}</h3>
        <div className="exo-chart__toolbar">
          <button className="exo-btn ghost icon" title="Export PNG">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="exo-chart__canvas">
        <Plot
          data={chartData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    </div>
  );
};

export default LightCurveChart;


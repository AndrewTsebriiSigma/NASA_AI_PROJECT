import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const PhaseFoldedChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const phases = data.map(d => d.phase);
    const fluxes = data.map(d => d.flux);
    
    return [{
      x: phases,
      y: fluxes,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: 4,
        color: '#2bf0a0',
        opacity: 0.6,
      },
      name: 'Phase-Folded',
    }];
  }, [data]);
  
  if (!chartData) {
    return (
      <div className="exo-chart">
        <div className="exo-chart__header">
          <h3 className="exo-chart__title">Phase-Folded View</h3>
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
      title: 'Phase',
      gridcolor: '#1e263d',
      color: '#aab6d6',
      range: [0, 1],
    },
    yaxis: {
      title: 'Normalized Flux',
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    shapes: [
      {
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: 0.45,
        x1: 0.55,
        y0: 0,
        y1: 1,
        fillcolor: 'rgba(0, 209, 255, 0.1)',
        line: {
          width: 0,
        },
      },
    ],
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
        <h3 className="exo-chart__title">Phase-Folded View</h3>
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

export default PhaseFoldedChart;


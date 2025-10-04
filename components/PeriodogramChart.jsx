import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const PeriodogramChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const periods = data.map(d => d.period);
    const powers = data.map(d => d.power);
    
    return [{
      x: periods,
      y: powers,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#7c4dff',
        width: 2,
      },
      fill: 'tozeroy',
      fillcolor: 'rgba(124, 77, 255, 0.2)',
      name: 'Power',
    }];
  }, [data]);
  
  if (!chartData) {
    return (
      <div className="exo-chart">
        <div className="exo-chart__header">
          <h3 className="exo-chart__title">Periodogram (TLS/BLS)</h3>
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
      title: 'Period (days)',
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    yaxis: {
      title: 'Power',
      gridcolor: '#1e263d',
      color: '#aab6d6',
    },
    margin: { l: 50, r: 20, t: 20, b: 40 },
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
        <h3 className="exo-chart__title">Periodogram (TLS/BLS)</h3>
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

export default PeriodogramChart;


import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { getModels, runInference } from '../lib/api';

const ModelControls = () => {
  const [models, setModels] = useState([]);
  const { 
    selectedModel, 
    setSelectedModel, 
    threshold, 
    setThreshold,
    isProcessing,
    setIsProcessing,
    parsedData,
    setClassificationResult,
    setProbabilities,
    setExplainability,
    setCharts,
    addLog,
    addRecentRun,
    targetId,
  } = useStore();
  
  useEffect(() => {
    getModels().then(setModels);
  }, []);
  
  const handleRunClassification = async () => {
    if (!parsedData) {
      addLog({ type: 'error', message: 'No data loaded. Please upload or search for data first.' });
      return;
    }
    
    setIsProcessing(true);
    addLog({ type: 'info', message: `Running ${selectedModel} with threshold ${threshold.toFixed(2)}...` });
    
    try {
      const result = await runInference(parsedData.data, selectedModel, threshold);
      
      setClassificationResult(result.prediction);
      setProbabilities(result.probabilities);
      setExplainability(result.explainability);
      setCharts(result.charts);
      
      addLog({ 
        type: 'success', 
        message: `Classification complete: ${result.prediction} (${(result.confidence * 100).toFixed(1)}% confidence)` 
      });
      
      addRecentRun({
        id: `run-${Date.now()}`,
        target: targetId || 'Uploaded CSV',
        prediction: result.prediction,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      addLog({ type: 'error', message: `Classification failed: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="exo-card">
      <h3 className="exo-card__title">Model Controls</h3>
      
      <div className="exo-input-wrapper">
        <label className="exo-label" htmlFor="model-select">Model</label>
        <select 
          id="model-select"
          className="exo-input"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isProcessing}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '6px' }}>
          {models.find(m => m.id === selectedModel)?.description}
        </p>
      </div>
      
      <div className="exo-input-wrapper">
        <label className="exo-label" htmlFor="threshold-slider">
          Classification Threshold: <span className="tabular-nums">{threshold.toFixed(2)}</span>
        </label>
        <input 
          id="threshold-slider"
          type="range"
          className="exo-slider"
          min="0"
          max="1"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          disabled={isProcessing}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-dim)' }}>
          <span>0.00</span>
          <span>0.50</span>
          <span>1.00</span>
        </div>
      </div>
      
      <button 
        className="exo-btn primary"
        style={{ width: '100%', marginTop: '8px' }}
        onClick={handleRunClassification}
        disabled={isProcessing || !parsedData}
      >
        {isProcessing ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8"/>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Run Classification
          </>
        )}
      </button>
      
      {models.length > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#0b1120', borderRadius: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '6px' }}>
            Model Metrics (F1 Score)
          </p>
          <p className="tabular-nums" style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-accent-3)' }}>
            {models.find(m => m.id === selectedModel)?.metrics.f1.toFixed(2)}
          </p>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModelControls;


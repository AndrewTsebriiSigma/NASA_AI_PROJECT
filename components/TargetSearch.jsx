import { useState } from 'react';
import useStore from '../store/useStore';
import { fetchMAST } from '../lib/api';

const TargetSearch = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  
  const { setTargetId, setParsedData, addLog } = useStore();
  
  const handleSearch = async () => {
    if (!input.trim()) {
      addLog({ type: 'error', message: 'Please enter a target ID' });
      return;
    }
    
    setStatus('loading');
    addLog({ type: 'info', message: `Querying MAST for ${input}...` });
    
    try {
      const result = await fetchMAST(input);
      
      if (result.success) {
        setTargetId(input);
        setParsedData({
          headers: ['time', 'flux', 'flux_err'],
          data: result.data,
        });
        setStatus('success');
        addLog({ type: 'success', message: `Retrieved data for ${input}` });
      }
    } catch (error) {
      setStatus('error');
      addLog({ type: 'error', message: error.message });
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="exo-search">
      <input 
        type="text"
        className="exo-input exo-search__input"
        placeholder="Enter KIC/TIC (e.g., KIC 8462852)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        aria-label="Target ID"
      />
      
      <button 
        className="exo-btn accent"
        onClick={handleSearch}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8"/>
            </svg>
            Fetching...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Fetch from MAST
          </>
        )}
      </button>
      
      {status && status !== 'loading' && (
        <div className="exo-search__status">
          <span className={`exo-badge ${status === 'success' ? 'success' : 'error'}`}>
            {status === 'success' ? 'Data retrieved' : 'Not found'}
          </span>
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

export default TargetSearch;


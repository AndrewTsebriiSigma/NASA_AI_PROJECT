import { useState, useRef } from 'react';
import useStore from '../store/useStore';
import { parseCSV, validateData } from '../lib/api';

const Uploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const { setUploadedFile, setParsedData, addLog } = useStore();
  
  const handleFile = async (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      addLog({ type: 'error', message: 'Invalid file type. CSV required.' });
      return;
    }
    
    setError(null);
    addLog({ type: 'info', message: `Parsing ${file.name}...` });
    
    try {
      const parsed = await parseCSV(file);
      const validation = validateData(parsed);
      
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        addLog({ type: 'error', message: `Validation failed: ${validation.errors[0]}` });
        return;
      }
      
      setUploadedFile(file);
      setParsedData(parsed);
      addLog({ type: 'success', message: `Successfully parsed ${parsed.data.length} rows` });
    } catch (err) {
      setError(err.message);
      addLog({ type: 'error', message: err.message });
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  return (
    <div>
      <div 
        className={`exo-uploader ${isDragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="exo-uploader__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        
        <p className="exo-uploader__text">
          Drop your light curve CSV here or click to browse
        </p>
        
        <p className="exo-uploader__hint">
          Required columns: time, flux (optional: flux_err)
        </p>
        
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv"
          onChange={handleFileInput}
          aria-label="Upload CSV file"
        />
      </div>
      
      {error && (
        <div style={{ marginTop: '12px' }}>
          <span className="exo-badge error">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Uploader;


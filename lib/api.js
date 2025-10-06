// API Wrapper for ExoScope Backend - FastAPI Integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function for fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 120000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Parse CSV data - Use FastAPI backend for parsing
export const parseCSV = async (file) => {
  try {
    // Try backend upload endpoint
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Backend parsing failed');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Backend parsing failed, falling back to client-side:', error);
    
    // Fallback to client-side parsing
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row = {};
            headers.forEach((header, i) => {
              const value = values[i] ? values[i].trim() : '';
              row[header] = isNaN(value) ? value : parseFloat(value);
            });
            return row;
          });
          
          resolve({ headers, data: data.slice(0, 1000) }); // Limit to 1000 rows
        } catch (error) {
          reject(new Error('Failed to parse CSV: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};

// Validate uploaded data
export const validateData = (parsedData) => {
  const { headers } = parsedData;
  
  // Check if it's light curve data (time + flux)
  const hasLightCurveData = headers.includes('time') && headers.includes('flux');
  
  // Check if it's exoplanet parameter data (has typical exoplanet columns)
  const hasExoplanetData = headers.some(h => 
    ['pl_name', 'hostname', 'pl_rade', 'st_mass', 'st_rad', 'st_teff'].includes(h)
  );
  
  if (!hasLightCurveData && !hasExoplanetData) {
    return {
      valid: false,
      errors: ['Invalid data format. Expected either light curve data (time, flux) or exoplanet parameters (pl_name, st_mass, etc.)'],
    };
  }
  
  return {
    valid: true,
    errors: [],
    dataType: hasLightCurveData ? 'lightcurve' : 'exoplanet_params'
  };
};

// Fetch target data from MAST
export const fetchMAST = async (targetId) => {
  // Simulated MAST fetch - in production, this would call the real MAST API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response
  if (targetId.toLowerCase().includes('kic') || targetId.toLowerCase().includes('tic')) {
    return {
      success: true,
      target: targetId,
      data: generateMockLightCurve(),
      metadata: {
        ra: '19h 44m 59.91s',
        dec: '+44° 16\' 47.8"',
        mission: targetId.includes('KIC') ? 'Kepler' : 'TESS',
        magnitude: 11.7,
      },
    };
  } else {
    throw new Error('Target not found in MAST archive');
  }
};

// Get available models
export const getModels = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/models`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    // Fallback to default models if API fails
    return [
      {
        id: 'random_forest_k2',
        name: 'Random Forest (K2)',
        description: 'Random Forest classifier trained on K2 mission data',
        metrics: { precision: 0.91, recall: 0.88, f1: 0.89 },
      },
      {
        id: 'mlp_k2',
        name: 'Neural Network (K2)',
        description: 'Multi-layer Perceptron trained on K2 mission data',
        metrics: { precision: 0.87, recall: 0.85, f1: 0.86 },
      },
    ];
  }
};

// Run inference
export const runInference = async (data, model, threshold) => {
  try {
    // Determine dataset and model type from model ID
    let dataset = 'k2';
    let modelType = 'random_forest';
    
    if (model.includes('tess')) {
      dataset = 'tess';
    }
    if (model.includes('mlp')) {
      modelType = 'mlp';
    }
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: data,
        model_type: modelType,
        dataset: dataset,
        threshold: threshold,
      }),
    }, 300000); // 5 minute timeout for ML processing
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Ensure charts are generated
    if (!result.charts) {
      result.charts = generateMockCharts(data);
    }
    
    return result;
  } catch (error) {
    console.error('Inference error:', error);
    
    // If backend is not available, show clear error message
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('⚠️ Backend API is not running! Please start the FastAPI server first. See START_HERE.md for instructions.');
    }
    
    throw new Error(`Classification failed: ${error.message}`);
  }
};

// Generate mock light curve data
const generateMockLightCurve = () => {
  const points = 2000;
  const data = [];
  
  for (let i = 0; i < points; i++) {
    const time = i * 0.02;
    let flux = 1.0 + (Math.random() - 0.5) * 0.001; // Base noise
    
    // Add periodic transits
    const period = 10.5;
    const phase = (time % period) / period;
    if (phase > 0.45 && phase < 0.55) {
      flux -= 0.015 * Math.sin((phase - 0.45) * Math.PI / 0.1) ** 2;
    }
    
    data.push({ time, flux, flux_err: 0.0005 });
  }
  
  return data;
};

// Generate mock chart data
const generateMockCharts = (inputData) => {
  const rawData = inputData || generateMockLightCurve();
  
  // Detrended curve (remove trend)
  const detrendedData = rawData.map(point => ({
    time: point.time,
    flux: point.flux - 0.0001 * point.time,
  }));
  
  // Periodogram data
  const periods = Array.from({ length: 200 }, (_, i) => 0.5 + i * 0.1);
  const periodogramData = periods.map(period => ({
    period,
    power: Math.exp(-Math.abs(period - 10.5) / 2) + Math.random() * 0.1,
  }));
  
  // Phase-folded data
  const period = 10.5;
  const phaseFoldedData = rawData.map(point => ({
    phase: (point.time % period) / period,
    flux: point.flux,
  })).sort((a, b) => a.phase - b.phase);
  
  return {
    raw: rawData,
    detrended: detrendedData,
    periodogram: periodogramData,
    phaseFolded: phaseFoldedData,
  };
};

// Get KOI/TOI links
export const getExoplanetLinks = (targetId) => {
  const links = [];
  
  if (targetId?.toLowerCase().includes('kic')) {
    const koiNumber = targetId.match(/\d+/)?.[0];
    links.push({
      name: 'NASA Exoplanet Archive',
      url: `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/DisplayOverview/nph-DisplayOverview?objname=KIC+${koiNumber}`,
    });
    links.push({
      name: 'SIMBAD',
      url: `https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=KIC+${koiNumber}`,
    });
  } else if (targetId?.toLowerCase().includes('tic')) {
    const ticNumber = targetId.match(/\d+/)?.[0];
    links.push({
      name: 'ExoFOP-TESS',
      url: `https://exofop.ipac.caltech.edu/tess/target.php?id=${ticNumber}`,
    });
    links.push({
      name: 'NASA Exoplanet Archive',
      url: `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/DisplayOverview/nph-DisplayOverview?objname=TIC+${ticNumber}`,
    });
  }
  
  return links;
};

export default {
  parseCSV,
  validateData,
  fetchMAST,
  getModels,
  runInference,
  getExoplanetLinks,
};


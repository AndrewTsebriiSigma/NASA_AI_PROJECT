// API Wrapper for ExoScope Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
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

// Parse CSV data
export const parseCSV = async (file) => {
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
            row[header] = values[i] ? values[i].trim() : '';
          });
          return row;
        });
        
        resolve({ headers, data: data.slice(0, 1000) }); // Limit to 1000 rows for preview
      } catch (error) {
        reject(new Error('Failed to parse CSV: ' + error.message));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Validate uploaded data
export const validateData = (parsedData) => {
  const requiredHeaders = ['time', 'flux'];
  const { headers } = parsedData;
  
  const missing = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required columns: ${missing.join(', ')}`],
    };
  }
  
  return {
    valid: true,
    errors: [],
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
  // In production, fetch from backend
  return [
    {
      id: 'cnn_classifier',
      name: 'CNN Classifier',
      description: '1D-CNN for light curve classification',
      metrics: { precision: 0.94, recall: 0.91, f1: 0.92 },
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      description: 'Classic ML with engineered features',
      metrics: { precision: 0.88, recall: 0.85, f1: 0.86 },
    },
    {
      id: 'tls_classifier',
      name: 'TLS + ML Hybrid',
      description: 'Transit Least Squares + ML',
      metrics: { precision: 0.91, recall: 0.89, f1: 0.90 },
    },
  ];
};

// Run inference
export const runInference = async (data, model, threshold) => {
  // Simulated inference - in production, call backend API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock results
  const rand = Math.random();
  const probabilities = {
    confirmed: model === 'cnn_classifier' ? 0.15 + rand * 0.3 : 0.1 + rand * 0.2,
    candidate: model === 'cnn_classifier' ? 0.45 + rand * 0.2 : 0.3 + rand * 0.3,
    notPlanet: 0,
  };
  probabilities.notPlanet = 1 - probabilities.confirmed - probabilities.candidate;
  
  const maxProb = Math.max(probabilities.confirmed, probabilities.candidate, probabilities.notPlanet);
  let prediction;
  if (maxProb === probabilities.confirmed) {
    prediction = 'Confirmed';
  } else if (maxProb === probabilities.candidate) {
    prediction = 'Candidate';
  } else {
    prediction = 'Not a Planet';
  }
  
  return {
    prediction,
    confidence: maxProb,
    probabilities,
    explainability: {
      featureImportance: [
        { feature: 'Transit Depth', importance: 0.34 },
        { feature: 'Period', importance: 0.28 },
        { feature: 'Transit Duration', importance: 0.21 },
        { feature: 'SNR', importance: 0.17 },
        { feature: 'Odd-Even Metric', importance: 0.15 },
        { feature: 'Secondary Eclipse', importance: 0.09 },
        { feature: 'Phase Coherence', importance: 0.07 },
        { feature: 'Ingress/Egress Symmetry', importance: 0.05 },
      ],
      rationale: [
        'High signal-to-noise ratio detected',
        'Consistent odd-even transit depth',
        'No secondary eclipse signal',
        'Period suggests habitable zone',
      ],
    },
    charts: generateMockCharts(data),
  };
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


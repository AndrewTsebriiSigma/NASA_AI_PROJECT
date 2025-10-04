import { create } from 'zustand';

const useStore = create((set, get) => ({
  // UI State
  sidebarCollapsed: false,
  logsOpen: false,
  reducedMotion: false,
  activeModal: null,
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setLogsOpen: (open) => set({ logsOpen: open }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  
  // Data State
  uploadedFile: null,
  parsedData: null,
  targetId: null,
  searchStatus: null, // 'idle' | 'loading' | 'success' | 'error'
  
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setParsedData: (data) => set({ parsedData: data }),
  setTargetId: (id) => set({ targetId: id }),
  setSearchStatus: (status) => set({ searchStatus: status }),
  
  // Model State
  selectedModel: 'cnn_classifier',
  threshold: 0.5,
  isProcessing: false,
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  setThreshold: (threshold) => set({ threshold: threshold }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  
  // Results State
  classificationResult: null,
  probabilities: null,
  explainability: null,
  charts: {
    raw: null,
    detrended: null,
    periodogram: null,
    phaseFolded: null,
  },
  
  setClassificationResult: (result) => set({ classificationResult: result }),
  setProbabilities: (probs) => set({ probabilities: probs }),
  setExplainability: (explain) => set({ explainability: explain }),
  setCharts: (charts) => set({ charts: charts }),
  
  // Logs
  logs: [],
  
  addLog: (log) => set((state) => ({
    logs: [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        ...log
      },
      ...state.logs
    ].slice(0, 100) // Keep last 100 logs
  })),
  
  clearLogs: () => set({ logs: [] }),
  
  // Recent Runs
  recentRuns: [
    {
      id: 'run-001',
      target: 'KIC 8462852',
      prediction: 'Candidate',
      confidence: 0.87,
      timestamp: '2025-10-04T10:30:00',
    },
    {
      id: 'run-002',
      target: 'TIC 341540904',
      prediction: 'Confirmed',
      confidence: 0.94,
      timestamp: '2025-10-04T09:15:00',
    },
    {
      id: 'run-003',
      target: 'KIC 10666592',
      prediction: 'Not a Planet',
      confidence: 0.71,
      timestamp: '2025-10-03T16:45:00',
    },
  ],
  
  addRecentRun: (run) => set((state) => ({
    recentRuns: [run, ...state.recentRuns].slice(0, 20)
  })),
}));

export default useStore;


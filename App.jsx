import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LogsDrawer from './components/LogsDrawer';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Models from './pages/Models';
import About from './pages/About';
import Settings from './pages/Settings';
import useStore from './store/useStore';

function App() {
  const { addLog } = useStore();
  
  useEffect(() => {
    // Add welcome log
    addLog({ type: 'info', message: 'Welcome to ExoScope' });
    
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      // Skip if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      switch(e.key) {
        case '/':
          e.preventDefault();
          // Focus search if on analyze page
          const searchInput = document.querySelector('input[aria-label="Target ID"]');
          if (searchInput) searchInput.focus();
          break;
        case 'u':
          // Navigate to analyze page
          window.location.hash = '#/analyze';
          break;
        case 'r':
          // Trigger run classification
          const runButton = document.querySelector('button:has(svg):contains("Run Classification")');
          if (runButton) runButton.click();
          break;
        case '?':
          // Show keyboard shortcuts (navigate to settings)
          window.location.hash = '#/settings';
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addLog]);
  
  return (
    <Router>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Header />
      
      <div className="exo-shell">
        <Sidebar />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/models" element={<Models />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </div>
      
      <Footer />
      <LogsDrawer />
    </Router>
  );
}

export default App;

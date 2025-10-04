import { useState } from 'react';
import useStore from '../store/useStore';
import Uploader from '../components/Uploader';
import TargetSearch from '../components/TargetSearch';
import DataTable from '../components/DataTable';
import LightCurveChart from '../components/LightCurveChart';
import PeriodogramChart from '../components/PeriodogramChart';
import PhaseFoldedChart from '../components/PhaseFoldedChart';
import ModelControls from '../components/ModelControls';
import ClassificationResults from '../components/ClassificationResults';
import Explainability from '../components/Explainability';
import ExoplanetLinks from '../components/ExoplanetLinks';

const Analyze = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { charts } = useStore();
  
  return (
    <main className="exo-main">
      {/* Input Panel */}
      <section className="exo-card span-12">
        <h3 className="exo-card__title">Data Input</h3>
        
        <div className="exo-tabs">
          <button 
            className={`exo-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload CSV
          </button>
          <button 
            className={`exo-tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Target
          </button>
        </div>
        
        {activeTab === 'upload' ? <Uploader /> : <TargetSearch />}
        
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Data Preview</h4>
          <DataTable />
        </div>
      </section>
      
      {/* Charts */}
      <section className="span-6">
        <LightCurveChart data={charts?.raw} title="Raw Light Curve" />
      </section>
      
      <section className="span-6">
        <LightCurveChart data={charts?.detrended} title="Detrended Curve" detrended />
      </section>
      
      <section className="span-6">
        <PeriodogramChart data={charts?.periodogram} />
      </section>
      
      <section className="span-6">
        <PhaseFoldedChart data={charts?.phaseFolded} />
      </section>
      
      {/* Model Controls */}
      <section className="span-4">
        <ModelControls />
      </section>
      
      {/* Classification Results */}
      <section className="span-8">
        <ClassificationResults />
      </section>
      
      {/* Explainability */}
      <section className="span-12">
        <Explainability />
      </section>
      
      {/* External Links */}
      <section className="span-12">
        <ExoplanetLinks />
      </section>
    </main>
  );
};

export default Analyze;


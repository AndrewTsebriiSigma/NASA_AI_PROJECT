import useStore from '../store/useStore';

const LogsDrawer = () => {
  const { logsOpen, setLogsOpen, logs, clearLogs } = useStore();
  
  return (
    <div className={`exo-logs ${logsOpen ? 'open' : ''}`}>
      <div className="exo-logs__header">
        <h3 className="exo-logs__title">Activity Logs</h3>
        <div className="flex gap-2">
          <button 
            className="exo-btn ghost icon" 
            onClick={clearLogs}
            aria-label="Clear logs"
            title="Clear logs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <button 
            className="exo-btn ghost icon" 
            onClick={() => setLogsOpen(false)}
            aria-label="Close logs"
            title="Close logs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      
      <ul className="exo-logs__list" role="log" aria-live="polite">
        {logs.length === 0 ? (
          <li className="exo-empty">No activity yet</li>
        ) : (
          logs.map((log) => (
            <li key={log.id} className={`exo-log-item ${log.type}`}>
              <div className="exo-log-item__time">{log.time}</div>
              <div className="exo-log-item__message">{log.message}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LogsDrawer;


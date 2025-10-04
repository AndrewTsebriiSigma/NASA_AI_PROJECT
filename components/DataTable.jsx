import useStore from '../store/useStore';

const DataTable = () => {
  const { parsedData } = useStore();
  
  if (!parsedData) {
    return (
      <div className="exo-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3, margin: '0 auto 12px' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>No data loaded yet</p>
      </div>
    );
  }
  
  const { headers, data } = parsedData;
  const previewRows = data.slice(0, 10);
  
  return (
    <div>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="exo-badge success">Valid Data</span>
          <span style={{ marginLeft: '8px', fontSize: '13px', color: 'var(--color-text-dim)' }}>
            {data.length} rows × {headers.length} columns
          </span>
        </div>
      </div>
      
      <div className="exo-table">
        <table>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr key={i}>
                {headers.map((header, j) => (
                  <td key={j} className="tabular-nums">
                    {typeof row[header] === 'number' 
                      ? row[header].toFixed(6)
                      : row[header]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > 10 && (
        <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-text-dim)', textAlign: 'center' }}>
          Showing first 10 of {data.length} rows
        </p>
      )}
    </div>
  );
};

export default DataTable;


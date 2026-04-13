import { useState } from 'react';
import '../styles/DataConverter.css';

export default function DataConverter({ onDataImport }) {
  const [inputData, setInputData] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState([]);

  const parseData = (data) => {
    try {
      const lines = data.split('\n').map(l => l.trim()).filter(l => l);
      
      if (lines.length < 2) {
        throw new Error('Need at least a header row and one data row');
      }

      // Detect delimiter
      const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
      
      // Parse headers
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
      
      // Map headers to standard names
      const headerMap = {};
      headers.forEach(h => {
        if (h.includes('dimension')) headerMap[h] = 'dimension';
        else if (h.includes('marque')) headerMap[h] = 'marque';
        else if (h.includes('reference') || h.includes('référence')) headerMap[h] = 'reference';
        else if (h.includes('stock') && h.includes('total')) headerMap[h] = 'stock_total';
        else if (h.includes('aouina')) headerMap[h] = 'stock_aouina';
        else if (h.includes('dibou')) headerMap[h] = 'stock_dibou';
        else if (h.includes('ariana')) headerMap[h] = 'stock_ariana';
        else if (h.includes('prix') || h.includes('price')) headerMap[h] = 'prix';
      });

      // Convert data
      const products = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim());
        const product = {};

        headers.forEach((header, index) => {
          const mappedName = headerMap[header];
          const value = values[index];

          if (mappedName && value) {
            if (mappedName.includes('stock') || mappedName === 'stock_total') {
              product[mappedName] = parseInt(value) || 0;
            } else if (mappedName === 'prix') {
              product[mappedName] = parseFloat(value) || 0;
            } else {
              product[mappedName] = value;
            }
          }
        });

        if (product.dimension && product.marque) {
          products.push(product);
        }
      }

      return products;
    } catch (err) {
      throw new Error(`Parse error: ${err.message}`);
    }
  };

  const handlePaste = async (e) => {
    const data = e.clipboardData.getData('text/plain');
    setInputData(data);
    setError('');
    setSuccess('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputData(event.target.result);
      setError('');
      setSuccess('');
    };
    reader.readAsText(file);
  };

  const handleConvert = () => {
    try {
      setError('');
      setSuccess('');
      setPreview([]);

      if (!inputData.trim()) {
        throw new Error('Please paste or upload data first');
      }

      const products = parseData(inputData);
      
      if (products.length === 0) {
        throw new Error('No valid products found in the data');
      }

      setPreview(products.slice(0, 5));
      setSuccess(`✓ Successfully converted ${products.length} products!`);

      // Store for download
      window.convertedData = products;
    } catch (err) {
      setError(`✗ ${err.message}`);
      setPreview([]);
    }
  };

  const handleDownload = () => {
    if (!window.convertedData || window.convertedData.length === 0) {
      setError('No data to download. Convert first!');
      return;
    }

    const dataStr = JSON.stringify(window.convertedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
  };

  const handleImport = () => {
    if (!window.convertedData || window.convertedData.length === 0) {
      setError('No data to import. Convert first!');
      return;
    }

    onDataImport(window.convertedData);
    setSuccess('✓ Data imported to dashboard!');
    setInputData('');
    setPreview([]);
  };

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h2>📊 Import Tire Data</h2>
        <p className="subtitle">Convert your CSV/Excel data to JSON format</p>

        <div className="input-section">
          <label>1. Choose Input Method:</label>
          <div className="input-methods">
            <button className="method-btn">
              <input 
                type="file" 
                accept=".csv,.txt,.xlsx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input">📁 Upload File</label>
            </button>
            
            <textarea
              placeholder="Or paste your data here (CSV format)&#10;Columns: DIMENSION, MARQUE, RÉFÉRENCE, STOCK TOTAL, AOUINA, DIBOU, ARIANA, PRIX (DT)"
              onPaste={handlePaste}
              onChange={(e) => setInputData(e.target.value)}
              value={inputData}
              className="data-textarea"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleConvert} className="btn btn-primary">
            🔄 Convert to JSON
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {preview.length > 0 && (
          <div className="preview-section">
            <h3>Preview (first {preview.length} items):</h3>
            <pre className="preview-json">
              {JSON.stringify(preview, null, 2)}
            </pre>

            <div className="action-buttons">
              <button onClick={handleDownload} className="btn btn-secondary">
                ⬇️ Download JSON
              </button>
              <button onClick={handleImport} className="btn btn-success">
                ✓ Import to Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>ℹ️ Expected Format:</h4>
          <p>Your data should have these columns (in any order):</p>
          <code>DIMENSION | MARQUE | RÉFÉRENCE | STOCK TOTAL | AOUINA | DIBOU | ARIANA | PRIX (DT)</code>
          <p>Supported delimiters: comma (,), semicolon (;), or tab</p>
        </div>
      </div>
    </div>
  );
}

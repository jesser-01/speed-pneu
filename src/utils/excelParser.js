/**
 * Excel Parser Utility for Client-Side Use
 * Dynamically loads XLSX library and parses Excel files in the browser
 */

let XLSX = null;

/**
 * Load XLSX library dynamically
 */
async function loadXLSX() {
  if (XLSX) return XLSX;
  
  try {
    // Load from CDN
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
      script.onload = () => {
        XLSX = window.XLSX;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return XLSX;
  } catch (error) {
    console.error('Failed to load XLSX library:', error);
    throw new Error('Could not load Excel parser library');
  }
}

/**
 * Parse Excel file from ArrayBuffer
 * @param {ArrayBuffer} buffer - Excel file as arraybuffer
 * @param {string} sheetName - Sheet name to parse (optional)
 * @returns {Array} Array of product objects
 */
export async function parseExcelBuffer(buffer, sheetName = null) {
  try {
    XLSX = await loadXLSX();
    
    // Read workbook from buffer
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get sheet name
    const sheet = sheetName || workbook.SheetNames[0];
    
    if (!workbook.SheetNames.includes(sheet)) {
      throw new Error(`Sheet "${sheet}" not found. Available: ${workbook.SheetNames.join(', ')}`);
    }

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
      defval: '',
      blankrows: false
    });

    // Normalize the data
    const products = jsonData.map(row => {
      const product = {};

      Object.keys(row).forEach(key => {
        const lowerKey = key.toLowerCase().trim().replace('local ', '').replace(/_/g, ' ');
        
        if (lowerKey.includes('dimension')) {
          product.dimension = String(row[key]).trim();
        } else if (lowerKey.includes('marque') || lowerKey.includes('brand')) {
          product.marque = String(row[key]).trim();
        } else if (lowerKey.includes('reference') || lowerKey.includes('référence')) {
          product.reference = String(row[key]).trim();
        } else if ((lowerKey.includes('stock') && lowerKey.includes('total')) || lowerKey.includes('total stock')) {
          product.stock_total = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('aouina') || lowerKey.includes('aouiina') || lowerKey.includes('warehouse1') || lowerKey.includes('lieu1')) {
          product.stock_aouina = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('dibou') || lowerKey.includes('warehouse2') || lowerKey.includes('lieu2')) {
          product.stock_dibou = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('ariana') || lowerKey.includes('warehouse3') || lowerKey.includes('lieu3')) {
          product.stock_ariana = parseInt(row[key]) || 0;
        } else if (lowerKey.includes('prix') || lowerKey.includes('price')) {
          product.prix = parseFloat(row[key]) || 0;
        }
      });

      return product;
    });

    // Filter valid products
    const validProducts = products.filter(p => p.dimension && p.marque);

    if (validProducts.length === 0) {
      throw new Error('No valid products found in Excel file');
    }

    return validProducts;
  } catch (error) {
    throw new Error(`Error parsing Excel: ${error.message}`);
  }
}

/**
 * Parse Excel file from File object (from file input)
 * @param {File} file - Excel file from input
 * @param {string} sheetName - Sheet name to parse (optional)
 * @returns {Promise<Array>} Array of product objects
 */
export async function parseExcelFile(file, sheetName = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const products = await parseExcelBuffer(data, sheetName);
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Get sheet names from Excel file
 * @param {File} file - Excel file
 * @returns {Promise<Array>} Array of sheet names
 */
export async function getExcelSheets(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        XLSX = await loadXLSX();
        const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

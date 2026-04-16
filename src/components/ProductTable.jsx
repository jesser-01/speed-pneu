import '../styles/ProductTable.css';

export default function ProductTable({ products }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 5) return 'low-stock';
    if (stock >= 50) return 'high-stock';
    return 'normal-stock';
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return 'Rupture';
    if (stock < 5) return 'Faible';
    return null;
  };

  return (
    <div className="table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Marque</th>
            <th>Référence</th>
            <th>Stock Total</th>
            <th>Aouina</th>
            <th>Dibou</th>
            <th>Ariana</th>
            <th>Prix (DT)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className={`row-${getStockStatus(product.stock_total)}`}>
              <td className="dimension-cell" data-label="Dimension">
                <strong>{product.dimension}</strong>
              </td>
              <td data-label="Marque">{product.marque}</td>
              <td className="reference-cell" data-label="Référence">{product.reference}</td>
              <td className={`stock-total ${getStockStatus(product.stock_total)}`} data-label="Stock Total">
                <span className="stock-value">{product.stock_total}</span>
                {getStockBadge(product.stock_total) && (
                  <span className={`badge ${getStockStatus(product.stock_total)}`}>
                    {getStockBadge(product.stock_total)}
                  </span>
                )}
              </td>
              <td className={`stock-location ${getStockStatus(product.stock_aouina)}`} data-label="Aouina">
                {product.stock_aouina}
              </td>
              <td className={`stock-location ${getStockStatus(product.stock_dibou)}`} data-label="Dibou">
                {product.stock_dibou}
              </td>
              <td className={`stock-location ${getStockStatus(product.stock_ariana)}`} data-label="Ariana">
                {product.stock_ariana}
              </td>
              <td className="price-cell" data-label="Prix (DT)">
                <strong>{product.prix.toFixed(2)} DT</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
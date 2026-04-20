import '../styles/ProductTable.css';

export default function ProductTable({ products }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 5) return 'low-stock';
    if (stock >= 5) return 'high-stock';
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
        <thead className="table-2header">
          <tr className="table-header">
            <th>Dimension</th>
            <th>Marque</th>
            <th>Référence</th>
            <th class='thead-item stock-header' data-short="ST"><span class="desktop-text">Stock Total</span></th>
            <th class='thead-item stock-header' data-short="AO"><span class="desktop-text">Aouina</span></th>
            <th class='thead-item stock-header' data-short="DB"><span class="desktop-text">Dibou</span></th>
            <th class='thead-item stock-header' data-short="AR"><span class="desktop-text">Ariana</span></th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className={`row-${getStockStatus(product.stock_total)}`}>
              <td className="dimension-cell">
                <strong>{product.dimension}</strong>
              </td>
              <td>{product.marque}</td>
              <td className="reference-cell">{product.reference}</td>
              <td className={`stock-total ${getStockStatus(product.stock_total)}`}>
                <span className="stock-value">{product.stock_total}</span>
              </td>
              <td className={`stock-location ${getStockStatus(product.stock_aouina)}`}>
                {product.stock_aouina}
              </td>
              <td className={`stock-location ${getStockStatus(product.stock_dibou)}`}>
                {product.stock_dibou}
              </td>
              <td className={`stock-location ${getStockStatus(product.stock_ariana)}`}>
                {product.stock_ariana}
              </td>
              <td className="price-cell">
                <strong>{product.prix} DT</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
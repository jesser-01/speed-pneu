import '../styles/Filters.css';

export default function Filters({
  brands,
  selectedBrand,
  onBrandChange,
  showOnlyAvailable,
  onShowOnlyAvailableChange,
  showLowStock,
  onShowLowStockChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) {
  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="brand-filter">Marque:</label>
          <select
            id="brand-filter"
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les marques</option>
            {brands.map(brand => (
              brand && <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Trier par:</label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="filter-select"
          >
            <option value="price">Prix</option>
            <option value="dimension">Dimension</option>
            <option value="stock">Total Stock</option>
          </select>
        </div>

        <div className="filter-group">
          <button
            className={`sort-order-btn ${sortOrder}`}
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
          >
            {sortOrder === 'asc' ? '↑ Croissant' : '↓ Décroissant'}
          </button>
        </div>
      </div>

      <div className="filters-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => onShowOnlyAvailableChange(e.target.checked)}
          />
          <span>Afficher uniquement les articles en stock</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => onShowLowStockChange(e.target.checked)}
          />
          <span>Afficher les stocks faibles (&lt; 5)</span>
        </label>
      </div>
    </div>
  );
}
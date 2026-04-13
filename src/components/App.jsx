import { useState, useEffect, useMemo } from 'react';
import SearchBar from './SearchBar';
import Filters from './Filters';
import ProductTable from './ProductTable';
import useDebounce from '../hooks/useDebounce';
import '../styles/App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortBy, setSortBy] = useState('dimension');
  const [sortOrder, setSortOrder] = useState('asc');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load products from JSON
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique brands for filter dropdown
  const brands = useMemo(() => {
    return ['', ...new Set(products.map(p => p.marque))].sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.dimension
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      
      const matchesBrand = !selectedBrand || product.marque === selectedBrand;
      
      const matchesAvailability = !showOnlyAvailable || product.stock_total > 0;
      
      const matchesLowStock = !showLowStock || product.stock_total < 5;

      return matchesSearch && matchesBrand && matchesAvailability && matchesLowStock;
    });

    // Sorting logic
    result.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'price') {
        compareValue = a.prix - b.prix;
      } else if (sortBy === 'stock') {
        compareValue = a.stock_total - b.stock_total;
      } else {
        compareValue = a.dimension.localeCompare(b.dimension);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [products, debouncedSearchTerm, selectedBrand, showOnlyAvailable, showLowStock, sortBy, sortOrder]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Stock Pneus</h1>
        <p className="subtitle">Gestion des stocks de pneus</p>
      </header>

      <main className="app-container">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <Filters
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          showOnlyAvailable={showOnlyAvailable}
          onShowOnlyAvailableChange={setShowOnlyAvailable}
          showLowStock={showLowStock}
          onShowLowStockChange={setShowLowStock}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {loading ? (
          <div className="loading">Chargement des données...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-results">Aucun résultat trouvé</div>
        ) : (
          <ProductTable products={filteredProducts} />
        )}
      </main>
    </div>
  );
}

import '../styles/SearchBar.css';

/**
 * Applies the tire dimension mask to raw digits.
 * Typing:  1 8 5 6 5 1 5
 * Shows:   185/65R15
 *
 * Also supports the short format:
 * Typing:  1 8 5 1 4
 * Shows:   185R14
 *
 * The mask auto-inserts '/' after 3 digits and 'R' after 5 digits.
 */
function applyMask(digits) {
  // digits is already stripped to numbers only, max 7
  const d = digits.slice(0, 7);
  let result = '';

  for (let i = 0; i < d.length; i++) {
    if (i === 3) result += '/';
    if (i === 5) result += 'R';
    result += d[i];
  }

  return result;
}

export default function SearchBar({ searchTerm, onSearchChange }) {
  function handleChange(e) {
    // Strip everything except digits
    const digits = e.target.value.replace(/\D/g, '');
    // Apply the mask and send the formatted value upstream
    onSearchChange(applyMask(digits));
  }

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder="Rechercher par dimension (ex: 175/65R14)..."
          value={searchTerm}
          onChange={handleChange}
          className="search-input"
          maxLength={9}
        />
        {searchTerm && (
          <button
            className="clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

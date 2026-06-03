import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Tìm kiếm mã cổ phiếu...' }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`search-bar ${focused ? 'focused' : ''}`}>
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Badge hiển thị % thay đổi với màu xanh/đỏ tự động
 */
export default function Badge({ value, showIcon = true, size = 'sm' }) {
  if (value === null || value === undefined) {
    return <span className="badge badge-neutral">—</span>;
  }

  const isPositive = value > 0;
  const isNeutral = value === 0;

  const formatted = `${isPositive ? '+' : ''}${value.toFixed(2)}%`;

  const sizeClass = size === 'lg' ? 'badge-lg' : '';

  if (isNeutral) {
    return (
      <span className={`badge badge-neutral ${sizeClass}`}>
        {showIcon && <Minus size={10} />}
        {formatted}
      </span>
    );
  }

  return (
    <span className={`badge ${isPositive ? 'badge-green' : 'badge-red'} ${sizeClass}`}>
      {showIcon && (isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />)}
      {formatted}
    </span>
  );
}

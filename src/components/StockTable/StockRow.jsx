import Badge from '../Common/Badge';
import MiniChart from '../Common/MiniChart';

export default function StockRow({ stock, index }) {
  const { ticker, change_3m, change_6m, rank } = stock;

  const rowClass = [
    change_3m > 0 || change_6m > 0 ? 'row-positive' : '',
    change_3m < 0 || change_6m < 0 ? 'row-negative' : '',
  ].filter(Boolean).join(' ');

  return (
    <tr className={rowClass} style={{ animationDelay: `${index * 0.03}s` }}>
      {/* Rank */}
      <td>
        <span className="rank-badge">
          {rank ?? index + 1}
        </span>
      </td>

      {/* Ticker */}
      <td>
        <div className="ticker-cell">
          <div className="ticker-avatar">
            {ticker.slice(0, 2)}
          </div>
          <div>
            <span className="ticker-code">{ticker}</span>
          </div>
        </div>
      </td>

      {/* 3 Tháng */}
      <td>
        <Badge value={change_3m} />
      </td>

      {/* 6 Tháng */}
      <td>
        <Badge value={change_6m} />
      </td>

      {/* Mini Chart */}
      <td>
        <MiniChart change3m={change_3m} change6m={change_6m} />
      </td>
    </tr>
  );
}

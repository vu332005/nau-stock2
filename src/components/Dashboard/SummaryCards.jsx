import { TrendingUp, TrendingDown, BarChart2, Clock } from 'lucide-react';

const cards = (stocks, session) => [
  {
    id: 'total',
    label: 'Tổng Cổ Phiếu',
    icon: BarChart2,
    value: stocks.length,
    suffix: 'CP',
    color: 'blue',
    sub: session ? `Cập nhật: ${new Date(session.uploaded_at).toLocaleDateString('vi-VN')}` : 'Chưa có dữ liệu',
  },
  {
    id: 'top3m',
    label: 'Tăng Mạnh 3 Tháng',
    icon: TrendingUp,
    value: stocks.filter((s) => s.change_3m > 0).length,
    suffix: 'CP',
    color: 'green',
    sub: (() => {
      const top = [...stocks].filter(s => s.change_3m != null).sort((a, b) => b.change_3m - a.change_3m)[0];
      return top ? `Dẫn đầu: ${top.ticker} +${top.change_3m.toFixed(2)}%` : '';
    })(),
  },
  {
    id: 'top6m',
    label: 'Tăng Mạnh 6 Tháng',
    icon: TrendingUp,
    value: stocks.filter((s) => s.change_6m > 0).length,
    suffix: 'CP',
    color: 'green',
    sub: (() => {
      const top = [...stocks].filter(s => s.change_6m != null).sort((a, b) => b.change_6m - a.change_6m)[0];
      return top ? `Dẫn đầu: ${top.ticker} +${top.change_6m.toFixed(2)}%` : '';
    })(),
  },
  {
    id: 'losers',
    label: 'Giảm Mạnh 3 Tháng',
    icon: TrendingDown,
    value: stocks.filter((s) => s.change_3m < 0).length,
    suffix: 'CP',
    color: 'red',
    sub: (() => {
      const bot = [...stocks].filter(s => s.change_3m != null).sort((a, b) => a.change_3m - b.change_3m)[0];
      return bot ? `Giảm nhất: ${bot.ticker} ${bot.change_3m.toFixed(2)}%` : '';
    })(),
  },
];

export default function SummaryCards({ stocks, session }) {
  const cardData = cards(stocks, session);

  return (
    <div className="summary-cards">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className={`summary-card card-${card.color}`} style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="summary-card-header">
              <span className="summary-card-label">{card.label}</span>
              <div className={`summary-card-icon icon-${card.color}`}>
                <Icon size={16} />
              </div>
            </div>
            <div className="summary-card-value">
              <span className="value-number">{card.value}</span>
              <span className="value-suffix">{card.suffix}</span>
            </div>
            {card.sub && <p className="summary-card-sub">{card.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import Badge from '../Common/Badge';

const TABS = [
  { id: 'gainers3m', label: 'Top 3T', icon: TrendingUp },
  { id: 'gainers6m', label: 'Top 6T', icon: TrendingUp },
  { id: 'losers', label: 'Giảm', icon: TrendingDown },
];

export default function Sidebar({ topGainers3m, topGainers6m, topLosers3m, session }) {
  const [activeTab, setActiveTab] = useState('gainers3m');

  const dataMap = {
    gainers3m: { list: topGainers3m, changeKey: 'change_3m' },
    gainers6m: { list: topGainers6m, changeKey: 'change_6m' },
    losers: { list: topLosers3m, changeKey: 'change_3m' },
  };

  const { list, changeKey } = dataMap[activeTab];

  return (
    <aside className="sidebar">
      {/* Session Info */}
      <div className="sidebar-session card">
        <div className="sidebar-session-header">
          <Award size={16} color="var(--accent-yellow)" />
          <h3>Phiên Dữ Liệu</h3>
        </div>
        {session ? (
          <>
            <p className="session-title">{session.title}</p>
            <p className="session-date">
              {new Date(session.uploaded_at).toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {session.file_name && (
              <p className="session-file">📎 {session.file_name}</p>
            )}
          </>
        ) : (
          <p className="session-empty">Chưa có dữ liệu</p>
        )}
      </div>

      {/* Top Movers */}
      <div className="sidebar-movers card">
        <div className="sidebar-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="sidebar-list">
          {list.length === 0 ? (
            <p className="sidebar-empty">Không có dữ liệu</p>
          ) : (
            list.map((stock, idx) => (
              <div key={stock.id} className="sidebar-stock-item">
                <div className="sidebar-rank">{idx + 1}</div>
                <div className="sidebar-stock-info">
                  <span className="sidebar-ticker">{stock.ticker}</span>
                </div>
                <Badge value={stock[changeKey]} showIcon={false} />
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

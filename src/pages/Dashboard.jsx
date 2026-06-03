import { useState } from 'react';
import Layout from '../components/Layout/Layout';
import MarketTicker from '../components/Dashboard/MarketTicker';
import SummaryCards from '../components/Dashboard/SummaryCards';
import SearchBar from '../components/Dashboard/SearchBar';
import StockTable from '../components/StockTable/StockTable';
import Sidebar from '../components/Layout/Sidebar';
import { useStocks } from '../hooks/useStocks';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/layout.css';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    stocks,
    session,
    loading,
    error,
    refetch,
    topGainers3m,
    topGainers6m,
    topLosers3m,
  } = useStocks();

  return (
    <Layout onDataRefresh={refetch}>
      {/* Market Ticker Bar */}
      <MarketTicker />

      <div className="dashboard" style={{ marginTop: '24px' }}>
        {/* Header */}
        <div className="dashboard-top">
          <div>
            <h1 className="dashboard-title">
              {session ? session.title : 'BIẾN ĐỘNG TOP 100 VỐN HÓA'}
            </h1>
            <p className="dashboard-subtitle">
              {session
                ? `${stocks.length} cổ phiếu • Cập nhật ${new Date(session.uploaded_at).toLocaleString('vi-VN')}`
                : 'Upload file Excel để xem dữ liệu'}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            background: 'var(--accent-red-dim)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-red)',
            fontSize: '14px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
            <button
              onClick={refetch}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '13px' }}
            >
              <RefreshCw size={13} /> Thử lại
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards stocks={stocks} session={session} />

        {/* Main Body: Table + Sidebar */}
        <div className="dashboard-body">
          {/* Left: Table */}
          <div className="dashboard-main">
            <div className="table-panel">
              <div className="table-panel-header">
                <div>
                  <h2 className="table-panel-title">Danh Sách Cổ Phiếu</h2>
                  <p className="table-panel-sub">Biến động theo kỳ</p>
                </div>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <StockTable
                stocks={stocks}
                loading={loading}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {/* Right: Sidebar */}
          <Sidebar
            topGainers3m={topGainers3m}
            topGainers6m={topGainers6m}
            topLosers3m={topLosers3m}
            session={session}
          />
        </div>
      </div>
    </Layout>
  );
}

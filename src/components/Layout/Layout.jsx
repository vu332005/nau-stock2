import Navbar from './Navbar';
import '../../styles/layout.css';

export default function Layout({ children, onDataRefresh }) {
  return (
    <div className="app-layout">
      <Navbar onDataRefresh={onDataRefresh} />
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>© 2025 NAUStock • Dữ liệu chứng khoán Việt Nam</p>
      </footer>
    </div>
  );
}

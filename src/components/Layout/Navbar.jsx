import { useState } from 'react';
import { BarChart2, Upload, RefreshCw, Menu, X } from 'lucide-react';
import UploadModal from '../Upload/UploadModal';

export default function Navbar({ onDataRefresh }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: 'Dashboard', href: '#' },
    { label: 'Phân Tích', href: '#' },
    { label: 'Danh Mục', href: '#' },
    { label: 'Báo Cáo', href: '#' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo">
            <div className="logo-icon">
              <BarChart2 size={20} color="white" />
            </div>
            <span className="logo-text">NAU<span className="logo-accent">Stock</span></span>
          </div>

          {/* Nav Links – Desktop */}
          <ul className="navbar-links hide-mobile">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="navbar-link">{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="btn btn-ghost navbar-btn hide-mobile"
              onClick={onDataRefresh}
              title="Làm mới dữ liệu"
            >
              <RefreshCw size={15} />
              <span>Làm mới</span>
            </button>

            <button
              className="btn btn-primary navbar-btn"
              onClick={() => setUploadOpen(true)}
            >
              <Upload size={15} />
              <span className="hide-mobile">Upload Excel</span>
              <span className="show-mobile-only">Upload</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="mobile-nav-link">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => {
          setUploadOpen(false);
          onDataRefresh?.();
        }}
      />
    </>
  );
}

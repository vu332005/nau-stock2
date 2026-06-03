import { useState } from 'react';
import { Upload, Lock, X, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';
import '../../styles/upload.css';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('auth'); // 'auth' | 'upload'
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { uploadExcel, uploading, progress, error, success, reset } = useUpload();

  if (!isOpen) return null;

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setStep('upload');
      setAuthError('');
    } else {
      setAuthError('Mật khẩu không đúng');
      setPassword('');
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(ext)) {
      alert('Chỉ chấp nhận file .xlsx hoặc .xls');
      return;
    }
    setSelectedFile(file);
    reset();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const result = await uploadExcel(selectedFile);
    if (result) {
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setStep('auth');
    setPassword('');
    setAuthError('');
    setSelectedFile(null);
    reset();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <FileSpreadsheet size={20} color="var(--accent-blue)" />
            </div>
            <div>
              <h3 className="modal-title">Upload Dữ Liệu</h3>
              <p className="modal-subtitle">Cập nhật dữ liệu cổ phiếu từ file Excel</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step: Auth */}
        {step === 'auth' && (
          <form onSubmit={handleAuth} className="upload-form">
            <div className="form-group">
              <label className="form-label">
                <Lock size={14} />
                Mật khẩu Admin
              </label>
              <input
                type="password"
                className="input"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {authError}
                </span>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Xác nhận
            </button>
          </form>
        )}

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="upload-form">
            {/* Dropzone */}
            {!success && (
              <div
                className={`dropzone ${dragOver ? 'dragover' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                {selectedFile ? (
                  <div className="file-preview">
                    <FileSpreadsheet size={32} color="var(--accent-green)" />
                    <div>
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone-idle">
                    <Upload size={28} color="var(--text-muted)" />
                    <p>Kéo thả file Excel vào đây</p>
                    <span>hoặc click để chọn file (.xlsx, .xls)</span>
                  </div>
                )}
              </div>
            )}

            {/* Progress */}
            {uploading && progress && (
              <div className="upload-progress">
                <div className="progress-info">
                  <span>{progress.step === 'parsing' ? 'Đang đọc file...' : 'Đang lưu dữ liệu...'}</span>
                  <span>{progress.current}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress.current}%` }} />
                </div>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="upload-success">
                <CheckCircle size={40} color="var(--accent-green)" />
                <p>Upload thành công!</p>
                <span>Dữ liệu đã được cập nhật</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="upload-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            {!success && (
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={handleClose}>
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Đang upload...' : 'Upload'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

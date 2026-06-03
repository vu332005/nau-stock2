import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 20, text = 'Đang tải...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '48px',
      color: 'var(--text-muted)',
    }}>
      <Loader2
        size={size}
        style={{ animation: 'spin 1s linear infinite' }}
        color="var(--accent-blue)"
      />
      {text && <span style={{ fontSize: '14px' }}>{text}</span>}
    </div>
  );
}

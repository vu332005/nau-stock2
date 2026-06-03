-- ============================================================
-- NAUStock - Supabase Database Schema
-- Chạy SQL này trong Supabase SQL Editor
-- ============================================================

-- Bảng lưu các phiên upload
CREATE TABLE IF NOT EXISTS upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'BIẾN ĐỘNG TOP 100 VỐN HÓA',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  file_name TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Bảng lưu từng cổ phiếu
CREATE TABLE IF NOT EXISTS stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES upload_sessions(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  change_3m DECIMAL(10,4),
  change_6m DECIMAL(10,4),
  rank INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_stocks_session ON stocks(session_id);
CREATE INDEX IF NOT EXISTS idx_stocks_ticker ON stocks(ticker);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON upload_sessions(is_active, uploaded_at DESC);

-- Row Level Security (RLS)
ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- Policy: Tất cả đều có thể đọc (public read)
CREATE POLICY "Allow public read sessions"
  ON upload_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read stocks"
  ON stocks FOR SELECT
  TO anon
  USING (true);

-- Policy: Cho phép insert/update (anon key - admin dùng trực tiếp)
-- LƯU Ý: Trong production, nên dùng service_role key cho admin operations
CREATE POLICY "Allow insert sessions"
  ON upload_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update sessions"
  ON upload_sessions FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow insert stocks"
  ON stocks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow delete stocks"
  ON stocks FOR DELETE
  TO anon
  USING (true);

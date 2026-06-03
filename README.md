# NAUStock – Biến Động Cổ Phiếu VN

Web app hiển thị biến động Top 100 cổ phiếu vốn hóa lớn thị trường chứng khoán Việt Nam.

## 🚀 Quick Start

### 1. Clone & Install
```bash
cd nau-stock2
npm install
```

### 2. Tạo Supabase Project
1. Đăng ký tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào **SQL Editor** → paste nội dung file `supabase-schema.sql` → Run

### 3. Cấu hình Environment
```bash
# Copy file mẫu
cp .env.example .env.local

# Điền vào các giá trị từ Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD=your-secret-password
```

### 4. Chạy Development
```bash
npm run dev
```

## 📁 Cấu Trúc

```
src/
├── components/
│   ├── Layout/         # Navbar, Sidebar, Layout
│   ├── Dashboard/      # MarketTicker, SummaryCards, SearchBar
│   ├── StockTable/     # StockTable, StockRow, TableHeader
│   ├── Upload/         # UploadModal
│   └── Common/         # Badge, MiniChart, LoadingSpinner
├── hooks/
│   ├── useStocks.js    # Fetch data từ Supabase
│   └── useUpload.js    # Parse + upload Excel
├── lib/
│   ├── supabase.js     # Supabase client
│   └── excelParser.js  # Parse Excel với SheetJS
├── pages/
│   └── Dashboard.jsx   # Main page
└── styles/             # CSS files
```

## 📊 Format File Excel

File Excel cần có cấu trúc:

| Mã   | 3 Tháng   | 6 Tháng   |
|------|-----------|-----------|
| VIC  | 100000%   | 72.08%    |
| VHM  | 36.48%    | 44.37%    |
| VCB  | 1.08%     | 18.92%    |

## 🌐 Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import project
3. Thêm Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
4. Deploy!

## 🔐 Upload Excel (Admin)

1. Click nút **"Upload Excel"** trên navbar
2. Nhập mật khẩu admin (`VITE_ADMIN_PASSWORD`)
3. Drag & drop hoặc chọn file `.xlsx`
4. Click Upload – dữ liệu cũ sẽ bị thay thế

## Tech Stack

- **Frontend**: React 18 + Vite
- **Database**: Supabase (PostgreSQL)
- **Excel**: SheetJS (xlsx)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deploy**: Vercel

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { parseStockExcel } from '../lib/excelParser';

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null); // { step, total, current }
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadExcel = async (file) => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress({ step: 'parsing', current: 0, total: 100 });

    try {
      // 1. Parse Excel
      setProgress({ step: 'parsing', current: 10, total: 100 });
      const { title, stocks } = await parseStockExcel(file);

      if (!stocks || stocks.length === 0) {
        throw new Error('Không tìm thấy dữ liệu cổ phiếu trong file');
      }

      setProgress({ step: 'saving', current: 30, total: 100 });

      // 2. Deactivate all existing sessions
      await supabase
        .from('upload_sessions')
        .update({ is_active: false })
        .eq('is_active', true);

      setProgress({ step: 'saving', current: 40, total: 100 });

      // 3. Create new session
      const { data: newSession, error: sessionError } = await supabase
        .from('upload_sessions')
        .insert({
          title,
          file_name: file.name,
          is_active: true,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setProgress({ step: 'saving', current: 60, total: 100 });

      // 4. Insert stocks in batches of 50
      const batchSize = 50;
      const stocksWithSession = stocks.map((s) => ({
        ...s,
        session_id: newSession.id,
      }));

      for (let i = 0; i < stocksWithSession.length; i += batchSize) {
        const batch = stocksWithSession.slice(i, i + batchSize);
        const { error: insertError } = await supabase.from('stocks').insert(batch);
        if (insertError) throw insertError;

        const progressPct = 60 + Math.round(((i + batchSize) / stocks.length) * 35);
        setProgress({ step: 'saving', current: Math.min(progressPct, 95), total: 100 });
      }

      setProgress({ step: 'done', current: 100, total: 100 });
      setSuccess(true);

      return { sessionId: newSession.id, count: stocks.length, title };
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Lỗi upload dữ liệu');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setProgress(null);
  };

  return { uploadExcel, uploading, progress, error, success, reset };
}

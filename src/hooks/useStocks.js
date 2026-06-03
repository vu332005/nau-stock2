import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useStocks() {
  const [stocks, setStocks] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Lấy session active mới nhất
      const { data: sessionData, error: sessionError } = await supabase
        .from('upload_sessions')
        .select('*')
        .eq('is_active', true)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError && sessionError.code !== 'PGRST116') {
        throw sessionError;
      }

      if (!sessionData) {
        setStocks([]);
        setSession(null);
        return;
      }

      setSession(sessionData);

      // Lấy stocks của session này
      const { data: stocksData, error: stocksError } = await supabase
        .from('stocks')
        .select('*')
        .eq('session_id', sessionData.id)
        .order('rank', { ascending: true });

      if (stocksError) throw stocksError;

      setStocks(stocksData || []);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  // Computed values
  const topGainers3m = [...stocks]
    .filter((s) => s.change_3m !== null && s.change_3m > 0)
    .sort((a, b) => b.change_3m - a.change_3m)
    .slice(0, 5);

  const topGainers6m = [...stocks]
    .filter((s) => s.change_6m !== null && s.change_6m > 0)
    .sort((a, b) => b.change_6m - a.change_6m)
    .slice(0, 5);

  const topLosers3m = [...stocks]
    .filter((s) => s.change_3m !== null && s.change_3m < 0)
    .sort((a, b) => a.change_3m - b.change_3m)
    .slice(0, 5);

  return {
    stocks,
    session,
    loading,
    error,
    refetch: fetchActiveSession,
    topGainers3m,
    topGainers6m,
    topLosers3m,
  };
}

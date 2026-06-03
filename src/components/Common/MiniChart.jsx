import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Generate random sparkline data khi không có historical data
function generateSparklineData(change, points = 12) {
  const data = [];
  let value = 100;
  for (let i = 0; i < points; i++) {
    const volatility = Math.random() * 3 - 1.5;
    const trend = change / points;
    value += trend + volatility;
    data.push({ v: Math.max(value, 0) });
  }
  return data;
}

export default function MiniChart({ change3m, change6m }) {
  const change = change3m ?? change6m ?? 0;
  const data = generateSparklineData(change);
  const isPositive = change >= 0;
  const color = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';

  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

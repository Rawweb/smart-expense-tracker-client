import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

import { formatNaira } from '../utils/format.js';

const DailyChart = ({ days, dailyAverage }) => {
  // Recharts wants plain objects. Shorten the label, since "2026-07-14" is
  // too wide to read on an axis with thirty of them.
  const data = days.map((d) => ({
    date: d.date.slice(8), // "14"
    full: d.date,
    total: d.total,
  }));

  return (
    // ResponsiveContainer measures its parent. If the parent has no height,
    // the chart renders as nothing, with no error to tell you why.
    <div className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 4' stroke='#e5e9f0' vertical={false} />

          <XAxis
            dataKey='date'
            tick={{ fontSize: 11, fill: '#6b7a90' }}
            axisLine={{ stroke: '#e5e9f0' }}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: '#6b7a90' }}
            axisLine={false}
            tickLine={false}
            // ₦15,000 is too wide for an axis. ₦15k is not.
            tickFormatter={(v) => `₦${v / 1000}k`}
          />

          <Tooltip
            formatter={(value) => [formatNaira(value), 'Spent']}
            labelFormatter={(label, payload) => payload[0]?.payload.full || label}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e9f0',
              fontSize: '13px',
            }}
          />

          <Bar dataKey='total' radius={[4, 4, 0, 0]}>
            {/* A day above your own average gets flagged in orange. The chart
                is not just drawing the data, it is pointing at the problem. */}
            {data.map((d) => (
              <Cell key={d.full} fill={d.total > dailyAverage ? '#fb6514' : '#5c7cfa'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyChart;

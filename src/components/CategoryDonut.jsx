import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNaira } from '../utils/format.js';

import { CHART_COLORS } from '../utils/constants.js';

const CategoryDonut = ({ categories, grandTotal }) => {
  const data = categories.map((c) => ({
    name: c.category,
    value: c.total,
    percentage: c.percentage,
  }));

  return (
    <div className='relative h-56 w-56 shrink-0'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            innerRadius={68} 
            outerRadius={95}
            paddingAngle={2}
            stroke='none'
          >
            {/* One Cell per slice, so each can carry its own colour. */}
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [formatNaira(value), name]}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e9f0',
              fontSize: '13px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* The total sits in the hole. Absolutely positioned over the chart,
          with pointer-events-none so it never blocks the tooltip. */}
      <div className='pointer-events-none absolute inset-0 grid place-items-center'>
        <div className='text-center'>
          <p className='mono text-lg font-semibold'>{formatNaira(grandTotal)}</p>
          <p className='text-[10px] uppercase tracking-wider text-muted'>Total spent</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryDonut;

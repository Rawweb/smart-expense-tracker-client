import { Pencil, Trash2 } from 'lucide-react';

import Card from './ui/Card.jsx';
import { formatNaira, formatDate, getBudgetColor } from '../utils/format.js';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const color = getBudgetColor(budget.percentage);

  // Full class names, so Tailwind can actually find them when it scans the file.
  const bars = {
    safe: 'bg-safe',
    w50: 'bg-w50',
    w80: 'bg-w80',
    over: 'bg-over',
  };

  const texts = {
    safe: 'text-safe',
    w50: 'text-w50',
    w80: 'text-w80',
    over: 'text-over',
  };

  const isOver = budget.percentage >= 100;

  return (
    <Card className={budget.isActive ? '' : 'opacity-60'}>
      <div className='mb-3 flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <h3 className='truncate text-[15px] font-bold'>{budget.name}</h3>

            {/* A budget outside its dates is not being watched right now. Say so. */}
            {!budget.isActive && (
              <span className='shrink-0 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold text-muted'>
                Not active
              </span>
            )}
          </div>

          <p className='mono mt-0.5 text-xs text-muted'>
            {budget.category} &middot; {formatDate(budget.startDate)} to{' '}
            {formatDate(budget.endDate)}
          </p>
        </div>

        <div className='flex shrink-0 gap-1'>
          <button
            onClick={() => onEdit(budget)}
            aria-label='Edit budget'
            className='rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink'
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(budget)}
            aria-label='Delete budget'
            className='rounded-md p-1.5 text-muted hover:bg-paper hover:text-over'
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className='mb-1.5 flex items-baseline justify-between'>
        <span className='mono text-xs text-muted'>{formatNaira(budget.spent)} spent</span>
        <span className={`mono text-sm font-bold ${texts[color]}`}>{budget.percentage}%</span>
      </div>

      {/* The bar is clamped at 100. The number tells the truth, the bar just runs out. */}
      <div className='relative h-2 rounded-full bg-paper'>
        <div
          className={`h-2 rounded-full transition-all ${bars[color]}`}
          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
        />

        {/* The threshold marks. Darker once passed. */}
        {[50, 80].map((t) => (
          <span
            key={t}
            className={`absolute -top-0.5 h-3 w-0.5 rounded-full ${
              budget.percentage >= t ? 'bg-ink/40' : 'bg-line'
            }`}
            style={{ left: `${t}%` }}
          />
        ))}
      </div>

      <div className='mt-2 flex justify-between text-xs text-muted'>
        <span className='mono'>of {formatNaira(budget.limit)}</span>
        <span className={`mono font-semibold ${isOver ? texts.over : ''}`}>
          {isOver
            ? `${formatNaira(Math.abs(budget.remaining))} over`
            : `${formatNaira(budget.remaining)} left`}
        </span>
      </div>
    </Card>
  );
};

export default BudgetCard;

import { getBudgetColor, formatNaira } from '../utils/format.js';

const BudgetRail = ({ budget }) => {
  if (!budget) return null;

  const color = getBudgetColor(budget.percentage);

  // The bar cannot grow past 100 even when spending has. The number tells the
  // truth, the bar just runs out of room, which is what being over budget means.
  const width = Math.min(budget.percentage, 100);

  return (
    <div className='border-b border-line bg-card'>
      <div className='mx-auto flex max-w-6xl items-center gap-4 px-6 pb-3'>
        <span className='whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted'>
          {budget.name}
        </span>

        <div className='relative h-2 flex-1 rounded-full bg-line'>
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-${color} transition-all`}
            style={{ width: `${width}%` }}
          />

          {/* The threshold marks. Darker once you have passed them. */}
          {[50, 80, 100].map((t) => (
            <div
              key={t}
              className={`absolute -top-1 -bottom-1 w-0.5 rounded-full ${
                budget.percentage >= t ? 'bg-ink/40' : 'bg-line'
              }`}
              style={{ left: t === 100 ? 'calc(100% - 2px)' : `${t}%` }}
            />
          ))}
        </div>

        <span className={`mono whitespace-nowrap text-[13px] font-semibold text-${color}`}>
          {budget.percentage}% used, {formatNaira(Math.max(budget.remaining, 0))} left
        </span>
      </div>
    </div>
  );
};

export default BudgetRail;

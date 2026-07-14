import { formatRelative } from '../utils/format.js';

const AlertBanner = ({ alert }) => {
  if (!alert) return null;

  const styles = {
    50: 'border-w50/40 bg-w50/5 border-l-w50',
    80: 'border-w80/40 bg-w80/5 border-l-w80',
    100: 'border-over/40 bg-over/5 border-l-over',
  };

  const dots = {
    50: 'bg-w50',
    80: 'bg-w80',
    100: 'bg-over',
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-l-4 p-4 ${styles[alert.threshold]}`}
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dots[alert.threshold]}`} />

      <div className='min-w-0 flex-1'>
        <p className='text-sm font-bold'>
          {alert.threshold === 100
            ? `Your ${alert.category === 'Overall' ? 'overall' : alert.category} budget is finished`
            : `You have passed ${alert.threshold}% of your ${
                alert.category === 'Overall' ? 'overall' : alert.category
              } budget`}
        </p>
        <p className='mt-0.5 text-sm text-muted'>{alert.message}</p>
      </div>

      <span className='mono shrink-0 text-[11px] text-muted'>
        {formatRelative(alert.createdAt)}
      </span>
    </div>
  );
};

export default AlertBanner;

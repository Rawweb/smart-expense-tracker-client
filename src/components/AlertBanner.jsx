import { X } from 'lucide-react';

import { markAsRead } from '../api/notifications.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatRelative } from '../utils/format.js';

const AlertBanner = ({ alert }) => {
  const { notifications, markOneAsRead } = useNotifications();

  if (!alert) return null;

  // Read from the shared context, not from local state.
  // If this alert was marked read on the Alerts page, the banner is already gone.
  const current = notifications.find((n) => n._id === alert._id);
  if (current?.isRead) return null;

  const handleDismiss = async () => {
    // Optimistic. The banner vanishes and the bell count drops together.
    markOneAsRead(alert._id);

    try {
      await markAsRead(alert._id);
    } catch (error) {
      // Low stakes. It stays unread and reappears on the next load.
      console.error('Could not mark as read:', error.message);
    }
  };

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

  const scope = alert.category === 'Overall' ? 'overall' : alert.category;

  return (
    <div
      className={`relative rounded-xl border border-l-4 p-4 sm:flex sm:items-start sm:gap-3 ${styles[alert.threshold]}`}
    >
      <span
        className={`absolute top-[1.35rem] left-4 h-2 w-2 shrink-0 rounded-full sm:static sm:mt-1.5 ${dots[alert.threshold]}`}
      />

      <div className='min-w-0 pl-5 pr-4 sm:flex-1 sm:px-0'>
        <p className='text-sm font-bold'>
          {alert.threshold === 100
            ? `Your ${scope} budget is finished`
            : `You have passed ${alert.threshold}% of your ${scope} budget`}
        </p>
        <p className='mt-0.5 text-sm text-muted'>{alert.message}</p>
      </div>

      <span className='mono mt-2 block pl-5 text-[11px] text-muted sm:mt-0 sm:shrink-0 sm:pl-0'>
        {formatRelative(alert.createdAt)}
      </span>

      <button
        onClick={handleDismiss}
        aria-label='Dismiss alert'
        className='absolute top-3 right-3 rounded-md p-1 text-muted transition hover:bg-ink/5 hover:text-ink sm:static sm:-mr-1 sm:-mt-1 sm:shrink-0'
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default AlertBanner;

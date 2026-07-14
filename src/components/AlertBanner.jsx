import { useState } from 'react';
import { X } from 'lucide-react';

import { markAsRead } from '../api/notifications.js';
import { formatRelative } from '../utils/format.js';

const AlertBanner = ({ alert }) => {
  // Local, so the banner can vanish the instant it is clicked.
  const [dismissed, setDismissed] = useState(false);

  if (!alert || dismissed) return null;

  const handleDismiss = async () => {
    // Hide first. The user gets an instant response.
    setDismissed(true);

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
      className={`flex items-start gap-3 rounded-xl border border-l-4 p-4 ${styles[alert.threshold]}`}
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dots[alert.threshold]}`} />

      <div className='min-w-0 flex-1'>
        <p className='text-sm font-bold'>
          {alert.threshold === 100
            ? `Your ${scope} budget is finished`
            : `You have passed ${alert.threshold}% of your ${scope} budget`}
        </p>
        <p className='mt-0.5 text-sm text-muted'>{alert.message}</p>
      </div>

      <span className='mono shrink-0 text-[11px] text-muted'>
        {formatRelative(alert.createdAt)}
      </span>

      <button
        onClick={handleDismiss}
        aria-label='Dismiss alert'
        className='-mr-1 -mt-1 shrink-0 rounded-md p-1 text-muted transition hover:bg-ink/5 hover:text-ink'
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default AlertBanner;

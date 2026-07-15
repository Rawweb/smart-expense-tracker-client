import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';

import { markAsRead, markAllAsRead } from '../api/notifications.js';
import { useNotifications } from '../context/NotificationContext.jsx';

import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { TableSkeleton } from '../components/ui/Skeletons.jsx';

import { formatNaira, formatRelative } from '../utils/format.js';

const Alerts = () => {
  const { notifications, unreadCount, loading, markOneAsRead, markAllRead } = useNotifications();

  const [marking, setMarking] = useState(false);

  const handleMarkOne = async (notification) => {
    if (notification.isRead) return;

    // Optimistic. The badge drops instantly, and the row loses its highlight.
    markOneAsRead(notification._id);

    try {
      await markAsRead(notification._id);
    } catch (error) {
      console.error('Could not mark as read:', error.message);
    }
  };

  const handleMarkAll = async () => {
    setMarking(true);

    try {
      await markAllAsRead();
      markAllRead();
      toast.success('All alerts marked as read');
    } catch (error) {
      toast.error('Could not mark all as read');
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  const dots = {
    50: 'bg-w50',
    80: 'bg-w80',
    100: 'bg-over',
  };

  const texts = {
    50: 'text-w50',
    80: 'text-w80',
    100: 'text-over',
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-extrabold'>Alerts</h1>
          <p className='mt-0.5 text-sm text-muted'>
            Every threshold your spending has crossed, newest first
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant='ghost' onClick={handleMarkAll} loading={marking}>
            <Check size={15} />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            title='No alerts yet'
            message='When your spending crosses 50%, 80% or 100% of a budget, you will hear about it here.'
          />
        </Card>
      ) : (
        <Card>
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleMarkOne(n)}
              className={`relative cursor-pointer border-b border-line py-4 last:border-0 sm:flex sm:items-start sm:gap-3 ${
                n.isRead ? 'opacity-55' : ''
              }`}
            >
              <span
                className={`absolute top-[1.35rem] left-0 h-2 w-2 shrink-0 rounded-full sm:static sm:mt-1.5 ${dots[n.threshold]}`}
              />

              <div className='min-w-0 pl-5 pr-12 sm:flex-1 sm:px-0'>
                <p className='text-sm font-bold sm:hidden'>
                  {n.category === 'Overall' ? 'Overall budget' : `${n.category} budget`}
                </p>

                <p className='hidden text-sm font-bold sm:block'>
                  {n.threshold === 100
                    ? `Your ${n.category === 'Overall' ? 'overall' : n.category} budget is finished`
                    : `You have passed ${n.threshold}% of your ${
                        n.category === 'Overall' ? 'overall' : n.category
                      } budget`}
                </p>

                <p className='mono mt-0.5 text-xs text-muted'>{n.message}</p>
              </div>

              {/* The snapshot. This is what the numbers WERE when it fired, not
                  what they are now. That is why an old alert stays true. */}
              <span
                className={`mono absolute top-4 right-0 text-sm font-bold sm:static sm:shrink-0 ${texts[n.threshold]}`}
              >
                {n.percentage}%
              </span>

              <span className='mono mt-2 block pl-5 text-right text-[11px] text-muted sm:mt-0 sm:shrink-0 sm:pl-0'>
                {formatRelative(n.createdAt)}
              </span>
            </div>
          ))}
        </Card>
      )}

      <p className='text-xs text-muted'>
        Each threshold fires once per budget period, so crossing 50% does not alert you again on
        every small purchase.
      </p>
    </div>
  );
};

export default Alerts;

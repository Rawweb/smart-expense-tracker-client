import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

import { useAuth } from './AuthContext.jsx';
import { useNotifications } from './NotificationContext.jsx';
import { formatNaira } from '../utils/format.js';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { refetch, bumpAlertTick } = useNotifications();

  // useRef, not useState. Changing a ref does NOT cause a re-render, and we
  // do not want the whole app re-rendering because a socket connected.
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    // The API base URL ends with /api. The socket connects to the root.
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      localStorage.setItem('socketId', socket.id);
    });

    socket.on('connect_error', (error) => {
      // The server rejected the handshake, usually a bad or expired token.
      console.error('Socket connection failed:', error.message);
    });

    // The event the alert engine emits.
    socket.on('budget-alert', (alerts) => {
      alerts.forEach((alert) => {
        const isOver = alert.threshold === 100;

        toast.custom(
          (t) => (
            <div
              className={`flex w-[340px] items-center gap-3 rounded-lg border-l-4 bg-card px-4 py-3 shadow-lg ${
                isOver ? 'border-l-over' : 'border-l-w80'
              }`}
            >
              <span
                className={`mono grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                  isOver ? 'bg-over/10 text-over' : 'bg-w80/10 text-w80'
                }`}
              >
                {alert.percentage}%
              </span>

              <div className='min-w-0'>
                <p className='text-sm font-bold'>
                  {isOver
                    ? `${alert.category} budget finished`
                    : `${alert.category} past ${alert.threshold}%`}
                </p>
                <p className='mono mt-0.5 text-xs text-muted'>
                  {formatNaira(alert.spent)} of {formatNaira(alert.limit)}
                </p>
              </div>

              <button
                onClick={() => toast.dismiss(t.id)}
                className='ml-auto shrink-0 text-muted hover:text-ink'
              >
                <X size={14} />
              </button>
            </div>
          ),
          { duration: 6000 },
        );
      });

      // The bell count is now out of date. Refresh it.
      refetch();
      bumpAlertTick();
    });

    // The cleanup function. React runs this before the effect reruns, and when
    // the component unmounts. Without it, every re-render would open ANOTHER
    // socket, and you would end up with dozens, all firing the same toast.
    return () => {
      socket.disconnect();
      socketRef.current = null;
      localStorage.removeItem('socketId');  
    };
  }, [user, refetch, bumpAlertTick]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

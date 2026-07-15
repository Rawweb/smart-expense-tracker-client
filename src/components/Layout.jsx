import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu whenever the route changes. Without this, you tap a link,
  // the page changes underneath, and the menu stays open covering it.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/transactions', label: 'Income & Expenses' },
    { to: '/budgets', label: 'Budgets' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/reports', label: 'Reports' },
  ];

  const desktopLink = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-paper font-bold text-ink'
        : 'font-medium text-muted hover:bg-paper hover:text-ink'
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-3 py-3 text-sm transition ${
      isActive ? 'bg-paper font-bold text-ink' : 'font-medium text-muted hover:bg-paper'
    }`;

  return (
    <div className='min-h-screen'>
      <header className='sticky top-0 z-20 border-b border-line bg-card'>
        <nav className='mx-auto flex h-16 max-w-6xl items-center gap-1 px-4 md:px-6'>
          <div className='mr-6 flex items-center gap-2'>
            <div className='grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-extrabold text-white'>
              ET
            </div>
            <span className='text-[15px] font-extrabold'>ExpenseTracker</span>
          </div>

          {/* Desktop links. Hidden below md. */}
          <div className='hidden md:flex md:items-center md:gap-1'>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={desktopLink}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className='ml-auto flex items-center gap-2 md:gap-3'>
            <NavLink
              to='/alerts'
              className='relative grid h-9 w-9 place-items-center rounded-lg border border-line text-ink hover:bg-paper'
            >
              <Bell size={16} />

              {unreadCount > 0 && (
                <span className='absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-over px-1 text-[10px] font-bold text-white'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>

            <div className='grid h-8 w-8 place-items-center rounded-full bg-line text-xs font-bold text-brand'>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Logout icon only on desktop. On mobile it lives in the menu,
                where there is room for a proper label. */}
            <button
              onClick={logout}
              title='Log out'
              className='hidden h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:bg-paper hover:text-ink md:grid'
            >
              <LogOut size={16} />
            </button>

            {/* Hamburger. Only below md. */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className='grid h-9 w-9 place-items-center rounded-lg border border-line text-ink hover:bg-paper md:hidden'
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* The drop down panel. Not rendered at all when closed. */}
        {menuOpen && (
          <div className='border-t border-line px-4 py-3 md:hidden'>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={mobileLink}>
                {link.label}
              </NavLink>
            ))}

            <button
              onClick={logout}
              className='mt-2 flex w-full items-center gap-2 rounded-lg border-t border-line px-3 py-3 pt-4 text-sm font-medium text-muted hover:bg-paper'
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        )}
      </header>

      <main className='mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-7'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

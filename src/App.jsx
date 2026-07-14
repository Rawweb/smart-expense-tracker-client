import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import Layout from './components/Layout.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Alerts from './pages/Alerts.jsx';
import Reports from './pages/Reports.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* One Toaster for the whole app. Any component can now call toast(). */}
        <Toaster position='top-right' />

        <Routes>
          {/* Public. A logged in user gets bounced away from these. */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Private. The guard wraps Layout, so all five pages inherit it. */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* These render into Layout's <Outlet />. */}
            <Route index element={<Dashboard />} />
            <Route path='transactions' element={<Transactions />} />
            <Route path='budgets' element={<Budgets />} />
            <Route path='alerts' element={<Alerts />} />
            <Route path='reports' element={<Reports />} />
          </Route>

          <Route path='*' element={<h1 className='p-10'>Page not found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

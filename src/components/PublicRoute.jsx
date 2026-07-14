import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='min-h-screen' />;
  }

  if (user) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default PublicRoute;

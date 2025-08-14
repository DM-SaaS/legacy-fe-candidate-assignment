import { Login, Dashboard } from '../pages';
import { useAuth } from '../context/AuthContext';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

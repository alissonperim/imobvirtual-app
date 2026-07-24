import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import type { Role } from '../lib/types';

export function ProtectedRoute({ role }: { role: Role }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/entrar" replace />;
  if (currentUser.role !== role) {
    return <Navigate to={role === 'proprietario' ? '/app' : '/painel'} replace />;
  }
  return <Outlet />;
}

export function RootRedirect() {
  const { currentUser, homePathFor } = useAuth();
  if (!currentUser) return <Navigate to="/entrar" replace />;
  return <Navigate to={homePathFor(currentUser.role)} replace />;
}

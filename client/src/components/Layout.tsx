import type { FC, ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import './Layout.css';

export interface LayoutProps {
  children?: ReactNode;
}

const Layout: FC<LayoutProps> = () => {
  const { user, loading, logout } = useAuth();

  return (
    <div className="layout">
      <header className="layout-header">
        <Link to="/" className="layout-brand">
          SnowRunner Guide Forum
        </Link>
        <nav className="layout-nav">
          <Link to="/guides">Guides</Link>
          {user ? (
            <>
              <Link to="/guides/new">New Guide</Link>
              <Link to="/admin">Admin</Link>
              <span className="layout-user">{user.username}</span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : null}
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

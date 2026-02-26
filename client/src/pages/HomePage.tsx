import type { FC } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: FC = () => {
  return (
    <div className="home">
      <h1 className="home-title">SnowRunner Guide Forum</h1>
      <p className="home-intro">
        Share and discover map guides, waypoints, and tips for SnowRunner.
      </p>
      <div className="home-actions">
        <Link to="/guides" className="home-cta">
          Browse Guides
        </Link>
        <Link to="/register" className="home-cta secondary">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

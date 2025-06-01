import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo">
          FilmBoxd
        </RouterLink>
        <div className="nav-links">
          <RouterLink to="/" className="nav-link">Ana Sayfa</RouterLink>
          <RouterLink to="/login" className="nav-link">Giriş Yap</RouterLink>
          <RouterLink to="/register" className="nav-link">Kayıt Ol</RouterLink>
          <RouterLink to="/profile" className="nav-link">Profil</RouterLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
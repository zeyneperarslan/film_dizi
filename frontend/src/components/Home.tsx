import React from 'react';
import MediaList from './MediaList';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Film & Dizi Dünyasına Hoş Geldiniz</h1>
        <p>En yeni filmler ve diziler burada!</p>
      </div>
      <MediaList />
    </div>
  );
};

export default Home; 
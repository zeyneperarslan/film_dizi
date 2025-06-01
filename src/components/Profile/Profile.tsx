import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

interface User {
  id: string;
  username: string;
  email: string;
  preferences: string[];
}

interface ProfileProps {
  onLogout: () => void;
}

const filmGenres = [
  { id: 'action', label: 'Aksiyon' },
  { id: 'comedy', label: 'Komedi' },
  { id: 'drama', label: 'Drama' },
  { id: 'sci-fi', label: 'Bilim Kurgu' },
  { id: 'horror', label: 'Korku' },
  { id: 'romance', label: 'Romantik' },
  { id: 'thriller', label: 'Gerilim' },
  { id: 'animation', label: 'Animasyon' },
  { id: 'documentary', label: 'Belgesel' },
  { id: 'fantasy', label: 'Fantastik' }
];

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock user data
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      preferences: ['action', 'comedy', 'drama']
    };

    setUser(mockUser);
    setSelectedGenres(mockUser.preferences);
    setLoading(false);
  }, []);

  const handleGenreChange = (genreId: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleSavePreferences = () => {
    // Burada gerçek bir API çağrısı yapılacak
    console.log('Saving preferences:', selectedGenres);
    alert('Tercihleriniz kaydedildi!');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="error-message">Kullanıcı bilgileri yüklenemedi.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-section">
        <h1>Profil Bilgileri</h1>
        <div className="user-info">
          <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
          <p><strong>E-posta:</strong> {user.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <h2>Film ve Dizi Tercihleri</h2>
        <p className="section-description">Size özel film ve dizi önerileri için tercih ettiğiniz türleri seçin:</p>
        <div className="genres-grid">
          {filmGenres.map(genre => (
            <label key={genre.id} className="genre-checkbox">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.label}
            </label>
          ))}
        </div>
        <button onClick={handleSavePreferences} className="save-button">
          Tercihleri Kaydet
        </button>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Çıkış Yap
      </button>
    </div>
  );
};

export default Profile; 
// src/components/MovieDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetail.css';

interface MediaItem {
  id: string;
  title: string;
  type: 'Movie' | 'TV Show';
  year: string;
  posterUrl: string;
  genre: string[];
  rating: number;
  description: string;
  director: string;
  cast: string[];
}

// 1. mockMediaData: MediaList’te eklemiş olduğumuz film & dizilerin tam listesi
const mockMediaData: MediaItem[] = [
  {
    id: '1',
    title: 'Inception',
    type: 'Movie',
    year: '2010',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    genre: ['Bilim Kurgu', 'Gerilim', 'Aksiyon'],
    rating: 8.8,
    description:
      'Rüyalar aracılığıyla bilgi çalan bir hırsıza, imkansız olarak kabul edilen bir görev karşılığında suç geçmişinin silinmesi teklif edilir.',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
  },
  {
    id: '2',
    title: 'The Dark Knight',
    type: 'Movie',
    year: '2008',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    genre: ['Aksiyon', 'Suç', 'Drama'],
    rating: 9.0,
    description:
      'Joker olarak bilinen tehdit Gotham halkına kaos ve yıkım getirdiğinde, Batman adaletsizlikle savaşma yeteneğinin en büyük testlerinden birini kabul etmelidir.',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
  },
  {
    id: '3',
    title: 'Interstellar',
    type: 'Movie',
    year: '2014',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    genre: ['Bilim Kurgu', 'Macera', 'Drama'],
    rating: 8.6,
    description:
      'Dünya artık yaşanabilir bir yer olmadığında, bir grup kaşif insanlık için yeni bir yaşanabilir gezegen bulmak üzere galaksiler arası bir yolculuğa çıkar.',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    type: 'Movie',
    year: '1994',
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    genre: ['Drama', 'Suç'],
    rating: 9.3,
    description:
      'İki adam, yıllar süren hapis cezaları boyunca arkadaşlık ve umut bulur.',
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
  },
  {
    id: '5',
    title: 'Breaking Bad',
    type: 'TV Show',
    year: '2008–2013',
    posterUrl: 'https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg',
    genre: ['Suç', 'Drama', 'Gerilim'],
    rating: 9.5,
    description:
      'Kimya öğretmeni Walter White, akciğer kanseri teşhisi sonrası ailesini güvence altına almak için eski öğrencisi Jesse Pinkman ile metamfetamin üretip satmaya başlar.',
    director: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
  },
  {
    id: '6',
    title: 'The Godfather',
    type: 'Movie',
    year: '1972',
    posterUrl: 'https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg',
    genre: ['Drama', 'Suç'],
    rating: 9.2,
    description:
      'Corleone ailesinin lideri Don Vito Corleone, işini devralmasını istediği oğlu Michael’ın şehvet, güç ve intikam dolu dünyaya adım atışını izleriz.',
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
  },
  {
    id: '7',
    title: 'Stranger Things',
    type: 'TV Show',
    year: '2016–',
    posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
    genre: ['Bilim Kurgu', 'Drama', 'Korku'],
    rating: 8.7,
    description:
      'Hawkins kasabasında kaybolan bir çocuk etrafında gelişen gizemli olaylar, bilimsel deneyler ve doğaüstü varlıkları ortaya çıkarır.',
    director: 'The Duffer Brothers',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
  },
  {
    id: '8',
    title: 'The Matrix',
    type: 'Movie',
    year: '1999',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    genre: ['Bilim Kurgu', 'Aksiyon'],
    rating: 8.7,
    description:
      'Thomas Anderson, “Neo” lakabıyla tanınan bir hacker, gerçekliğin simülasyon olduğunu ve insanlığın makineler tarafından kontrol edildiğini keşfeder.',
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
  },
  {
    id: '9',
    title: 'Forrest Gump',
    type: 'Movie',
    year: '1994',
    posterUrl: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
    genre: ['Drama', 'Romantik'],
    rating: 8.8,
    description:
      'Zeka seviyesi ortalamanın altında olan Forrest Gump’ın, hayatın akışına kendini bırakıp bir dizi tarihi olaya tesadüfen dahil oluşunun dokunaklı hikayesi.',
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
  },
  {
    id: '10',
    title: 'Game of Thrones',
    type: 'TV Show',
    year: '2011–2019',
    posterUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    genre: ['Fantastik', 'Drama', 'Macera'],
    rating: 9.3,
    description:
      'Yedi Krallık’ta taht kavgaları, ejderhalar ve ejderha binekleri; soğuk kuzey, büyücülerin güçleri ve ihanetle dolu siyasi entrikalar arasındaki epik savaş.',
    director: 'David Benioff & D. B. Weiss',
    cast: ['Emilia Clarke', 'Kit Harington', 'Peter Dinklage'],
  },
  {
    id: '11',
    title: 'The Witcher',
    type: 'TV Show',
    year: '2019–',
    posterUrl: 'https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg',
    genre: ['Fantastik', 'Macera', 'Aksiyon'],
    rating: 8.2,
    description:
      'Canavarların insanları tehdit ettiği bir dünyada, mutant avcı Geralt of Rivia, kaderin kendisine çizdiği yola karşı savaşırken “The Witcher” olma hikâyesi anlatılır.',
    director: 'Lauren Schmidt Hissrich',
    cast: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan'],
  },
];

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. id’ye göre mock listeden ilgili öğeyi bul ve state’e ata
    const found = mockMediaData.find((item) => item.id === id);
    if (found) {
      setMovie(found);
    } else {
      setMovie(null);
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <p>Film veya dizi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-content">
        <div className="movie-poster-container">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'https://via.placeholder.com/500x750/808080/FFFFFF?text=No+Image';
            }}
          />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-type">
              ({movie.type === 'Movie' ? 'Film' : 'Dizi'})
            </span>
            <span className="movie-rating">⭐ {movie.rating}/10</span>
          </div>

          <div className="movie-genres">
            {movie.genre.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <div className="movie-director">
            <strong>Yönetmen:</strong> {movie.director}
          </div>

          <div className="movie-cast">
            <strong>Oyuncular:</strong>{' '}
            {movie.cast.join(', ')}
          </div>

          <div className="movie-description">
            <h2>Özet</h2>
            <p>{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

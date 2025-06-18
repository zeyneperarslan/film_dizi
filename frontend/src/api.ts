// src/api.ts
/// <reference types="vite/client" />
import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWMzMDRlNjc4NGQ1OTU3NTNkMmUzOWZjMzFkOTY1ZCIsIm5iZiI6MTc0ODcyNDE2NS43Mjg5OTk5LCJzdWIiOiI2ODNiNjljNTUwY2M0NzYxNmQ3ZjNhMGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.fVT2QWMihmWaI-QU4jKpOwD5HLCDuLAn_8SphzZmB2Q';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
}

export interface MediaResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Videos {
  results: Video[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  episode_count: number;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  vote_average: number;
  vote_count: number;
}

// Type guards
export const isMovie = (media: Movie | TVShow): media is Movie => {
  return 'title' in media;
};

export const isTVShow = (media: Movie | TVShow): media is TVShow => {
  return 'name' in media;
};

// Movies
export const getPopularMovies = () => {
  return api.get<MediaResponse<Movie>>('/movie/popular');
};

export const getTopRatedMovies = () => {
  return api.get<MediaResponse<Movie>>('/movie/top_rated');
};

export const getUpcomingMovies = () => {
  return api.get<MediaResponse<Movie>>('/movie/upcoming');
};

export const getNowPlayingMovies = () => {
  return api.get<MediaResponse<Movie>>('/movie/now_playing');
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get<Movie>(`${TMDB_BASE_URL}/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// TV Shows
export const getPopularTVShows = () => {
  return api.get<MediaResponse<TVShow>>('/tv/popular');
};

export const getTopRatedTVShows = () => {
  return api.get<MediaResponse<TVShow>>('/tv/top_rated');
};

export const getOnTheAirTVShows = () => {
  return api.get<MediaResponse<TVShow>>('/tv/on_the_air');
};

export const getAiringTodayTVShows = () => {
  return api.get<MediaResponse<TVShow>>('/tv/airing_today');
};

export const getTVShowDetails = async (id: number): Promise<TVShow> => {
  try {
    const response = await axios.get<TVShow>(`${TMDB_BASE_URL}/tv/${id}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
};

export const getTVShowSeason = (tvId: number, seasonNumber: number) => {
  return api.get<Season>(`/tv/${tvId}/season/${seasonNumber}`);
};

// Search
export const searchMedia = (query: string) => {
  return api.get<MediaResponse<Movie | TVShow>>('/search/multi', {
    params: {
      query,
      include_adult: false,
      language: 'tr-TR',
    },
  });
};

// Genres
export const getGenres = async (type: 'movie' | 'tv') => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/${type}/list`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} genres:`, error);
    throw error;
  }
};

// Discover
export const discoverMovies = (params: {
  with_genres?: string;
  sort_by?: string;
  year?: number;
  page?: number;
}) => {
  return api.get<MediaResponse<Movie>>('/discover/movie', { params });
};

export const discoverTVShows = (params: {
  with_genres?: string;
  sort_by?: string;
  first_air_date_year?: number;
  page?: number;
}) => {
  return api.get<MediaResponse<TVShow>>('/discover/tv', { params });
};

interface UserPreference {
  userId: string;
  username: string;
  favoriteGenres: string[];
  watchlist: string[];
  ratings: {
    mediaId: number;
    rating: number;
  }[];
}

interface Recommendation {
  media: Movie | TVShow;
  score: number;
  reason: string;
}

// Kullanıcı tercihlerini kaydet
export const saveUserPreference = async (userId: string, preference: UserPreference) => {
  try {
    const response = await axios.post(`${TMDB_BASE_URL}/preferences`, preference);
    return response.data;
  } catch (error) {
    console.error('Error saving user preference:', error);
    throw error;
  }
};

// Benzer kullanıcıları bul
export const findSimilarUsers = async (userId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/users/similar/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error finding similar users:', error);
    throw error;
  }
};

// İçerik bazlı öneriler
export const getContentBasedRecommendations = async (userId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/recommendations/content/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting content-based recommendations:', error);
    throw error;
  }
};

// İşbirlikçi filtreleme önerileri
export const getCollaborativeRecommendations = async (userId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/recommendations/collaborative/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting collaborative recommendations:', error);
    throw error;
  }
};

// Hibrit öneriler (içerik + işbirlikçi)
export const getHybridRecommendations = async (userId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/recommendations/hybrid/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting hybrid recommendations:', error);
    throw error;
  }
};

export const getMedia = async (type: 'all' | 'movie' | 'tv', category: string) => {
  try {
    const endpoint = type === 'all' ? 'movie' : type;
    const response = await axios.get<MediaResponse<Movie | TVShow>>(
      `${TMDB_BASE_URL}/${endpoint}/${category}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} ${category}:`, error);
    throw error;
  }
};

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  media_type: 'movie' | 'tv';
  similarity_score: number;
}

export const semanticSearch = async (query: string): Promise<SearchResult[]> => {
  try {
    // Önce tüm popüler film ve dizileri al
    const [moviesResponse, tvShowsResponse] = await Promise.all([
      getMedia('movie', 'popular'),
      getMedia('tv', 'popular')
    ]);

    const movieResults = moviesResponse.results
      .filter(isMovie)
      .map(movie => ({
        ...movie,
        media_type: 'movie' as const,
        similarity_score: calculateSimilarity(query, movie.title, movie.overview)
      }));

    const tvResults = tvShowsResponse.results
      .filter(isTVShow)
      .map(show => ({
        ...show,
        media_type: 'tv' as const,
        similarity_score: calculateSimilarity(query, show.name, show.overview)
      }));

    const allMedia = [...movieResults, ...tvResults];

    // Benzerlik skoruna göre sırala ve en iyi sonuçları döndür
    return allMedia
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 10);
  } catch (error) {
    console.error('Error in semantic search:', error);
    throw error;
  }
};

// Basit bir benzerlik hesaplama fonksiyonu
const calculateSimilarity = (query: string, title: string, overview: string): number => {
  const queryWords = query.toLowerCase().split(' ');
  const titleWords = title.toLowerCase().split(' ');
  const overviewWords = overview.toLowerCase().split(' ');

  let score = 0;

  // Başlıkta eşleşen kelimeler için daha yüksek puan
  queryWords.forEach(word => {
    if (titleWords.includes(word)) score += 2;
    if (overviewWords.includes(word)) score += 1;
  });

  // Özel durumlar için puanlar
  if (query.toLowerCase().includes('komedi') && overview.toLowerCase().includes('comedy')) score += 3;
  if (query.toLowerCase().includes('aksiyon') && overview.toLowerCase().includes('action')) score += 3;
  if (query.toLowerCase().includes('dram') && overview.toLowerCase().includes('drama')) score += 3;
  if (query.toLowerCase().includes('romantik') && overview.toLowerCase().includes('romance')) score += 3;
  if (query.toLowerCase().includes('korku') && overview.toLowerCase().includes('horror')) score += 3;
  if (query.toLowerCase().includes('bilim kurgu') && overview.toLowerCase().includes('science fiction')) score += 3;

  return score;
};

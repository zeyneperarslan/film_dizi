// src/components/MovieDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Button,
  useToast,
  Container,
  Divider,
  Textarea,
  Avatar,
  Flex,
  IconButton,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getTVShowDetails, Movie, TVShow, Genre, isMovie } from '../api';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  rating?: number;
}

const MovieDetail: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [media, setMedia] = useState<Movie | TVShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user, updateUserPreferences } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const data = type === 'movie' 
          ? await getMovieDetails(parseInt(id))
          : await getTVShowDetails(parseInt(id));
        setMedia(data);
      } catch (error) {
        console.error('Error fetching media details:', error);
        toast({
          title: 'Hata',
          description: 'Film/dizi detayları yüklenirken bir hata oluştu.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id, type, toast]);

  const handleAddToFavorites = () => {
    if (!user) {
      toast({
        title: 'Giriş yapmanız gerekiyor',
        description: 'Favorilere eklemek için lütfen giriş yapın.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    const isMovie = 'title' in media!;
    const title = isMovie ? (media as Movie).title : (media as TVShow).name;
    
    const currentWatchlist = user.preferences?.watchlist || [];
    const isInWatchlist = currentWatchlist.includes(title);

    if (isInWatchlist) {
      const newWatchlist = currentWatchlist.filter(item => item !== title);
      updateUserPreferences({ watchlist: newWatchlist });
      toast({
        title: 'Favorilerden çıkarıldı',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      updateUserPreferences({ watchlist: [...currentWatchlist, title] });
      toast({
        title: 'Favorilere eklendi',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddComment = () => {
    if (!user) {
      toast({
        title: 'Giriş yapmanız gerekiyor',
        description: 'Yorum yapmak için lütfen giriş yapın.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Yorum boş olamaz',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      text: comment,
      createdAt: new Date().toISOString(),
      rating: rating,
    };

    setComments([...comments, newComment]);
    setComment('');
    setRating(5);
    toast({
      title: 'Yorum ve puanınız eklendi',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="pink.500" />
      </Center>
    );
  }

  if (!media) {
    return (
      <Center minH="100vh">
        <Text>Film/dizi bulunamadı.</Text>
      </Center>
    );
  }

  const isMovieType = isMovie(media);

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box
            position="relative"
            h="500px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="xl"
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
              alt={isMovieType ? media.title : media.name}
              w="100%"
              h="100%"
              objectFit="cover"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
              p={8}
            >
              <Heading size="2xl" color="white" mb={2}>
                {isMovieType ? media.title : media.name}
              </Heading>
              <HStack spacing={4}>
                <Tag size="lg" colorScheme="pink">
                  {media.vote_average.toFixed(1)}/10
                </Tag>
                <Text color="white">
                  {isMovieType ? media.release_date : media.first_air_date}
                </Text>
              </HStack>
            </Box>
          </Box>

          <Box bg={cardBg} p={8} borderRadius="xl" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={2}>Özet</Heading>
                <Text color={textColor}>{media.overview}</Text>
              </Box>

              {media.genres && (
                <Box>
                  <Heading size="md" mb={2}>Türler</Heading>
                  <HStack wrap="wrap" spacing={2}>
                    {media.genres.map((genre) => (
                      <Tag key={genre.id} colorScheme="teal">
                        {genre.name}
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              )}

              {isMovieType && media.runtime && (
                <Box>
                  <Heading size="md" mb={2}>Süre</Heading>
                  <Text>{media.runtime} dakika</Text>
                </Box>
              )}

              {!isMovieType && media.number_of_seasons && (
                <Box>
                  <Heading size="md" mb={2}>Dizi Bilgileri</Heading>
                  <Text>Sezon Sayısı: {media.number_of_seasons}</Text>
                  <Text>Bölüm Sayısı: {media.number_of_episodes}</Text>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default MovieDetail;

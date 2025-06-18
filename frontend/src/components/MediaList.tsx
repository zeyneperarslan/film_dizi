// src/components/MediaList.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Image,
  Badge,
  HStack,
  VStack,
  Select,
  Flex,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  Link,
  ButtonGroup,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { getMedia, getGenres, Movie, TVShow, Genre, isMovie, isTVShow } from '../api';
import { FaFilm, FaTv } from 'react-icons/fa';

const MediaList: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('popular');
  const [media, setMedia] = useState<(Movie | TVShow)[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('pink.500', 'pink.300');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          getGenres('movie'),
          getGenres('tv'),
        ]);
        setMovieGenres(movieData.genres);
        setTVGenres(tvData.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await getMedia(selectedType, selectedCategory);
        setMedia(data.results);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [selectedType, selectedCategory]);

  const getGenreNames = (genreIds: number[], type: 'movie' | 'tv') => {
    const genres = type === 'movie' ? movieGenres : tvGenres;
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
  };

  const handleMediaClick = (item: Movie | TVShow) => {
    const type = isMovie(item) ? 'movie' : 'tv';
    navigate(`/${type}/${item.id}`);
  };

  const getMediaTitle = (item: Movie | TVShow) => {
    return isMovie(item) ? item.title : item.name;
  };

  const getMediaDate = (item: Movie | TVShow) => {
    return isMovie(item) ? item.release_date : item.first_air_date;
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg" bgGradient="linear(to-r, pink.400, purple.400)" bgClip="text">
              {selectedType === 'movie' ? 'Filmler' : 'Diziler'}
            </Heading>
            <ButtonGroup>
              <Button
                leftIcon={<FaFilm />}
                colorScheme={selectedType === 'movie' ? 'pink' : 'gray'}
                onClick={() => setSelectedType('movie')}
              >
                Filmler
              </Button>
              <Button
                leftIcon={<FaTv />}
                colorScheme={selectedType === 'tv' ? 'pink' : 'gray'}
                onClick={() => setSelectedType('tv')}
              >
                Diziler
              </Button>
            </ButtonGroup>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {media.map((item) => (
              <Link
                key={item.id}
                as={RouterLink}
                to={`/${selectedType}/${item.id}`}
                _hover={{ textDecoration: 'none' }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={accentColor}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                    borderColor: 'pink.400',
                  }}
                >
                  <CardBody p={0}>
                    <Box
                      position="relative"
                      height="300px"
                      overflow="hidden"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={getMediaTitle(item)}
                        objectFit="cover"
                        width="100%"
                        height="100%"
                        transition="transform 0.3s"
                        _hover={{ transform: 'scale(1.05)' }}
                      />
                      <Box
                        position="absolute"
                        top={2}
                        right={2}
                        bg="rgba(0,0,0,0.7)"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        <Text color="white" fontSize="sm">
                          {item.vote_average.toFixed(1)} ⭐
                        </Text>
                      </Box>
                    </Box>
                  </CardBody>
                  <CardFooter p={4}>
                    <VStack align="start" spacing={2} width="100%">
                      <Heading size="md" color={textColor}>
                        {getMediaTitle(item)}
                      </Heading>
                      <Text color={textColor} fontSize="sm">
                        {getMediaDate(item)?.split('-')[0]}
                      </Text>
                      <HStack wrap="wrap" spacing={2}>
                        {getGenreNames(item.genre_ids, selectedType === 'movie' ? 'movie' : 'tv').map((genre) => (
                          <Badge
                            key={genre}
                            colorScheme="pink"
                            variant="subtle"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default MediaList;

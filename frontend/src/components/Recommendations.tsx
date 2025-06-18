import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getContentBasedRecommendations,
  getCollaborativeRecommendations,
  getHybridRecommendations,
  Movie,
  TVShow,
} from '../api';
import MediaCard from './MediaCard';

interface Recommendation {
  media: Movie | TVShow;
  score: number;
  reason: string;
}

const Recommendations: React.FC = () => {
  const [contentBasedRecs, setContentBasedRecs] = useState<Recommendation[]>([]);
  const [collaborativeRecs, setCollaborativeRecs] = useState<Recommendation[]>([]);
  const [hybridRecs, setHybridRecs] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        toast({
          title: 'Giriş yapmanız gerekiyor',
          description: 'Önerileri görmek için lütfen giriş yapın.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const [contentBased, collaborative, hybrid] = await Promise.all([
          getContentBasedRecommendations(user.id),
          getCollaborativeRecommendations(user.id),
          getHybridRecommendations(user.id),
        ]);

        setContentBasedRecs(contentBased);
        setCollaborativeRecs(collaborative);
        setHybridRecs(hybrid);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: 'Öneriler yüklenirken bir hata oluştu',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, navigate, toast]);

  const renderRecommendationCard = (rec: Recommendation) => {
    const isMovie = 'title' in rec.media;
    const title = isMovie ? (rec.media as Movie).title : (rec.media as TVShow).name;
    const posterPath = rec.media.poster_path;
    const voteAverage = rec.media.vote_average;

    return (
      <Box
        key={rec.media.id}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        cursor="pointer"
        onClick={() => navigate(`/media/${rec.media.id}`)}
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.02)' }}
      >
        <VStack align="stretch" spacing={2}>
          <Box position="relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              style={{ width: '100%', height: 'auto' }}
            />
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme="teal"
            >
              {rec.score.toFixed(1)} Benzerlik
            </Badge>
          </Box>
          <Box p={4}>
            <Heading size="md" mb={2}>{title}</Heading>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {rec.reason}
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme="blue">
                {voteAverage.toFixed(1)}/10
              </Badge>
              <Badge colorScheme="purple">
                {isMovie ? 'Film' : 'Dizi'}
              </Badge>
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Progress size="xs" isIndeterminate />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Size Özel Öneriler</Heading>
      
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Hibrit Öneriler</Tab>
          <Tab>İçerik Bazlı</Tab>
          <Tab>Benzer Kullanıcılar</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" color="gray.600">
                İçerik ve kullanıcı davranışlarına dayalı öneriler
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {hybridRecs.map(renderRecommendationCard)}
              </SimpleGrid>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" color="gray.600">
                Beğendiğiniz içeriklere benzer öneriler
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {contentBasedRecs.map(renderRecommendationCard)}
              </SimpleGrid>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" color="gray.600">
                Benzer kullanıcıların beğendiği içerikler
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {collaborativeRecs.map(renderRecommendationCard)}
              </SimpleGrid>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Recommendations; 
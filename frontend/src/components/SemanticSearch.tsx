import React, { useState } from 'react';
import {
  Box,
  Container,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useToast,
  Card,
  CardBody,
  CardFooter,
  Image,
  Badge,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { semanticSearch, SearchResult } from '../api';

const SemanticSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('pink.500', 'pink.300');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir arama sorgusu girin.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await semanticSearch(query);
      setResults(searchResults);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Arama sırasında bir hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaClick = (result: SearchResult) => {
    navigate(`/${result.media_type}/${result.id}`);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={4} bgGradient="linear(to-r, pink.500, purple.500)" bgClip="text">
              Akıllı Arama
            </Heading>
            <Text color={textColor} mb={6}>
              Ne tür film veya dizi izlemek istediğinizi anlatın, size en uygun önerileri sunalım.
            </Text>
            <HStack>
              <Input
                placeholder="Örn: Komik ve romantik bir film arıyorum..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="lg"
                bg={cardBg}
                _hover={{ borderColor: accentColor }}
                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
              />
              <Button
                colorScheme="pink"
                size="lg"
                onClick={handleSearch}
                isLoading={isLoading}
                loadingText="Aranıyor..."
              >
                Ara
              </Button>
            </HStack>
          </Box>

          {results.length > 0 && (
            <Box>
              <Heading size="md" mb={4}>
                Sizin İçin Seçtiklerimiz
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {results.map((result) => (
                  <Card
                    key={result.id}
                    bg={cardBg}
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-5px)',
                      shadow: 'lg',
                    }}
                    cursor="pointer"
                    onClick={() => handleMediaClick(result)}
                  >
                    <CardBody p={0}>
                      <Box position="relative" h="400px">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                          alt={result.title || result.name}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          transition="transform 0.3s"
                          _hover={{ transform: 'scale(1.05)' }}
                        />
                        <Badge
                          position="absolute"
                          top={2}
                          right={2}
                          colorScheme="pink"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {result.vote_average.toFixed(1)}
                        </Badge>
                      </Box>
                    </CardBody>
                    <CardFooter>
                      <VStack align="start" spacing={2} w="100%">
                        <Heading size="md" noOfLines={2}>
                          {result.title || result.name}
                        </Heading>
                        <Text color={textColor} noOfLines={2}>
                          {result.overview}
                        </Text>
                        <Badge colorScheme="purple" variant="subtle">
                          {result.media_type === 'movie' ? 'Film' : 'Dizi'}
                        </Badge>
                      </VStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default SemanticSearch; 
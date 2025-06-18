import React from 'react';
import {
  Box,
  Image,
  VStack,
  Heading,
  Text,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { Movie, TVShow } from '../api';

interface MediaCardProps {
  media: Movie | TVShow;
  onClick?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  const isMovie = 'title' in media;
  const title = isMovie ? (media as Movie).title : (media as TVShow).name;
  const posterPath = media.poster_path;
  const voteAverage = media.vote_average;
  const releaseDate = isMovie ? (media as Movie).release_date : (media as TVShow).first_air_date;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <VStack align="stretch" spacing={0}>
        <Box position="relative">
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            w="100%"
            h="auto"
            objectFit="cover"
          />
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="blue"
          >
            {voteAverage.toFixed(1)}/10
          </Badge>
        </Box>
        <VStack align="stretch" p={4} spacing={2}>
          <Heading size="md" noOfLines={2}>
            {title}
          </Heading>
          <HStack spacing={2}>
            <Badge colorScheme="purple">
              {isMovie ? 'Film' : 'Dizi'}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {new Date(releaseDate).getFullYear()}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default MediaCard; 
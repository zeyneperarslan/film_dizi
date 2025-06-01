// src/components/MediaList.tsx

import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  TagRoot,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

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

// MovieDetail.tsx içindeki mockMediaData ile bire bir eşleşecek tam liste
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
    posterUrl: 'https://www.themoviedb.org/t/p/w1280/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
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

const MediaList: React.FC = () => {
  return (
    <Box p={5}>
      <Heading mb={6}>Film & Dizi Arşivi</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {mockMediaData.map((media) => (
          <RouterLink
            key={media.id}
            to={`/media/${media.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'lg', cursor: 'pointer' }}
              display="flex"
              flexDirection="column"
              height="100%"
            >
              <Image
                src={media.posterUrl}
                alt={media.title}
                objectFit="cover"
                w="100%"
                h="450px"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/300x450/808080/FFFFFF?text=No+Image';
                }}
              />
              <VStack p={4} align="start" gap={2} flexGrow={1}>
                <Heading size="md">{media.title}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {media.type === 'Movie' ? 'Film' : 'Dizi'} - {media.year}
                </Text>
                <Box>
                  {media.genre.map((g) => (
                    <TagRoot
                      size="sm"
                      key={g}
                      variant="solid"
                      colorPalette="teal"
                      mr={1}
                      mb={1}
                    >
                      {g}
                    </TagRoot>
                  ))}
                </Box>
                <Text fontWeight="bold">Puan: {media.rating}/10</Text>
              </VStack>
            </Box>
          </RouterLink>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MediaList;

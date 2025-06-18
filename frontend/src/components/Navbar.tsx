import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Navbar.css';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Button,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const Navbar: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box as="nav" bg={bgColor} boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" py={4}>
          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <Heading size="md" bgGradient="linear(to-r, pink.500, purple.500)" bgClip="text">
              FilmBoxd
            </Heading>
          </Link>

          <HStack spacing={4}>
            <Link as={RouterLink} to="/search" _hover={{ textDecoration: 'none' }}>
              <Button
                leftIcon={<SearchIcon />}
                variant="ghost"
                colorScheme="pink"
                _hover={{ bg: hoverBg }}
              >
                Akıllı Arama
              </Button>
            </Link>
            <Link as={RouterLink} to="/" color={textColor} _hover={{ color: 'pink.500' }}>
              Ana Sayfa
            </Link>
            <Link as={RouterLink} to="/login" color={textColor} _hover={{ color: 'pink.500' }}>
              Giriş Yap
            </Link>
            <Link as={RouterLink} to="/register" color={textColor} _hover={{ color: 'pink.500' }}>
              Kayıt Ol
            </Link>
            <Link as={RouterLink} to="/profile" color={textColor} _hover={{ color: 'pink.500' }}>
              Profil
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 
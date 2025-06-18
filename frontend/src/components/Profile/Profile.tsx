import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Tag,
  SimpleGrid,
  useToast,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: 'Çıkış yapıldı',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  return (
    <Box maxW="container.md" mx="auto" p={6}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Avatar
            size="2xl"
            name={user.username}
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            mb={4}
          />
          <Heading size="lg">{user.username}</Heading>
          <Text color="gray.500">{user.email}</Text>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            Hesap Bilgileri
          </Heading>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Text fontWeight="bold">Kullanıcı Adı:</Text>
              <Text>{user.username}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="bold">Email:</Text>
              <Text>{user.email}</Text>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            Tercihler
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Favori Türler:
              </Text>
              <HStack wrap="wrap" spacing={2}>
                {user.preferences?.favoriteGenres?.length ? (
                  user.preferences.favoriteGenres.map((genre) => (
                    <Tag key={genre} colorScheme="teal">
                      {genre}
                    </Tag>
                  ))
                ) : (
                  <Text color="gray.500">Henüz favori tür eklenmemiş</Text>
                )}
              </HStack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                İzleme Listesi:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {user.preferences?.watchlist?.length ? (
                  user.preferences.watchlist.map((item) => (
                    <Box
                      key={item}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      _hover={{ shadow: 'md' }}
                    >
                      <Text>{item}</Text>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500">İzleme listeniz boş</Text>
                )}
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>

        <Button colorScheme="red" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile; 
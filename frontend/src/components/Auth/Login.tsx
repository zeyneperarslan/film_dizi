import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Giriş başarılı',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Giriş başarısız',
        description: 'Email veya şifre hatalı',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto" mt={20}>
      <VStack as="form" onSubmit={handleSubmit} gap={4}>
        <Heading as="h1" size="lg" textAlign="center">
          Giriş Yap
        </Heading>
        <FormControl width="full">
          <FormLabel>E-posta</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="Email adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl width="full">
          <FormLabel>Şifre</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" width="full" isLoading={isLoading}>
          Giriş Yap
        </Button>
        <Text>
          Hesabınız yok mu?{" "}
          <RouterLink to="/register">
            <ChakraLink color="teal.500" as="span">Kayıt Olun</ChakraLink>
          </RouterLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
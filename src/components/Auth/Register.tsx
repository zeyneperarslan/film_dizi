import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Field,
  Link as ChakraLink,
} from '@chakra-ui/react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', { username, email, password });
      alert('Kayıt Başarılı! ' + response.data.message + ' Şimdi giriş yapabilirsiniz.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Bir hata oluştu.';
      alert('Kayıt Başarısız: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto" mt={20}>
      <VStack as="form" onSubmit={handleSubmit} gap={4}>
        <Heading as="h1" size="lg" textAlign="center">
          Hesap Oluştur
        </Heading>
        <Field.Root width="full">
          <Field.Label>Kullanıcı Adı</Field.Label>
          <Input
            id="username-register"
            type="text"
            placeholder="Kullanıcı adınız"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field.Root>
        <Field.Root width="full">
          <Field.Label>E-posta Adresi</Field.Label>
          <Input
            id="email-register"
            type="email"
            placeholder="Email adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field.Root>
        <Field.Root width="full">
          <Field.Label>Şifre</Field.Label>
          <Input
            id="password-register"
            type="password"
            placeholder="Şifreniz (en az 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </Field.Root>
        <Button type="submit" colorPalette="teal" width="full" loading={isLoading}>
          Kayıt Ol
        </Button>
        <Text>
          Zaten bir hesabınız var mı?{" "}
          <RouterLink to="/login">
            <ChakraLink color="teal.500" as="span">Giriş Yapın</ChakraLink>
          </RouterLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register; 
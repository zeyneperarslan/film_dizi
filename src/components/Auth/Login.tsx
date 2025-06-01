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

interface LoginProps {
  onLoginSuccess: () => void;
}

// Varsayılan bir AuthContext veya benzeri bir state yönetimi olmadığını varsayarak,
// token ve kullanıcı bilgisini şimdilik local storage'a kaydedeceğiz.
// Daha sonra bunu bir Context API veya Redux/Zustand gibi bir state management ile iyileştirebiliriz.

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      // alert('Giriş Başarılı! Hoş geldiniz!'); // Uyarıyı kaldırabiliriz, yönlendirme yeterli
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.userId,
        username: response.data.username,
        email: email, // Login yanıtında email yoksa, formdaki email'i kullan
        preferences: response.data.preferences
      }));
      onLoginSuccess(); // App.tsx'deki state'i güncelle
      navigate('/'); // Ana sayfaya (veya profil sayfasına) yönlendir
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Bir hata oluştu.';
      alert(`Giriş Başarısız: ${errorMessage}`);
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
        <Field.Root width="full">
          <Field.Label>E-posta</Field.Label>
          <Input
            id="email"
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
            id="password"
            type="password"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field.Root>
        <Button type="submit" colorPalette="teal" width="full" loading={isLoading}>
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
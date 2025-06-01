import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Link as ChakraLink, Button, HStack } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { system } from './theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import MediaList from './components/MediaList';
import MediaDetail from './components/MediaDetail';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import './App.css';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Sayfa ilk yüklendiğinde localStorage'dan token kontrolü
    const token = localStorage.getItem('token');
    return !!token;
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogoutGlobal = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Yönlendirme NavLinks veya Profile içinde yapılacak
  };

  const NavLinks = () => {
    const navigate = useNavigate();

    const onLogoutClick = () => {
      handleLogoutGlobal();
      navigate('/login');
    };

    return (
      <HStack as="nav" gap={4} mb={8} justifyContent="center">
        {!isAuthenticated ? (
          <>
            <RouterLink to="/login">
              <ChakraLink _hover={{ textDecoration: 'underline' }} as="span">
                Giriş Yap
              </ChakraLink>
            </RouterLink>
            <RouterLink to="/register">
              <ChakraLink _hover={{ textDecoration: 'underline' }} as="span">
                Kayıt Ol
              </ChakraLink>
            </RouterLink>
          </>
        ) : (
          <>
            <RouterLink to="/">
              <ChakraLink _hover={{ textDecoration: 'underline' }} as="span">
                Ana Sayfa
              </ChakraLink>
            </RouterLink>
            <RouterLink to="/media">
              <ChakraLink _hover={{ textDecoration: 'underline' }} as="span">
                Arşiv
              </ChakraLink>
            </RouterLink>
            <RouterLink to="/profile">
              <ChakraLink _hover={{ textDecoration: 'underline' }} as="span">
                Profilim
              </ChakraLink>
            </RouterLink>
            <Button size="sm" colorScheme="red" onClick={onLogoutClick}>
              Çıkış Yap
            </Button>
          </>
        )}
      </HStack>
    );
  };

  return (
    <ChakraProvider value={system}>
      <Router>
        <div className="App">
          <Navbar />
          <Box textAlign="center" fontSize="xl" minH="100vh" p={8}>
            <NavLinks />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile onLogout={handleLogoutGlobal} />} />
              <Route path="/media/:id" element={<MovieDetail />} />
              <Route path="/media" element={<MediaList />} />
              <Route 
                path="/" 
                element={isAuthenticated ? <MediaList /> : <Login onLoginSuccess={handleLoginSuccess} />}
              />
            </Routes>
          </Box>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;

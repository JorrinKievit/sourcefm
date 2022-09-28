import { ChakraProvider, Container } from '@chakra-ui/react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Toast from './components/Toast';
import IndexPage from './pages';
import SettingsPage from './pages/settings';

import './styles/globals.css';
import theme from './styles/theme';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Toast />
      <Container maxW="container.xl" py={4}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </Container>
    </ChakraProvider>
  );
};

export default App;

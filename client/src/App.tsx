import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import HomePage from './pages/HomePage.js';
import GuideListPage from './pages/GuideListPage.js';
import GuideDetailPage from './pages/GuideDetailPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import NewGuidePage from './pages/NewGuidePage.js';
import AdminPage from './pages/AdminPage.js';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="guides" element={<GuideListPage />} />
          <Route path="guides/new" element={<NewGuidePage />} />
          <Route path="guides/:slug" element={<GuideDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

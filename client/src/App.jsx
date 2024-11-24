import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header/Header';
import List from './components/List/List';
import Fpage from './components/Fpage/Fpage';
import PostDetails from './components/PostDetails/PostDetails';
import BottomHeader from './components/BottomHeader/BottomHeader';
import Settings from './components/Settings/Settings';
import SettingsModal from './components/SettingsModal/SettingsModal';
import LoginPage from './components/LoginPage/LoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthContext } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Modal from './components/Modal/Modal';
import UserIsNotAuth from './components/UserIsNotAuth/UserIsNotAuth';
import './App.css'

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  return (
    <GoogleOAuthProvider clientId="916298270226-6hmbi7j9ks5lh1n3m7avmo7hjfdaap0r.apps.googleusercontent.com">
      <div className="App">
        <SearchProvider>
          <Routes>
            <Route path="/" element={<Fpage />} />
            <Route path="/Fpage" element={<PrivateRoute element={Fpage} isAuthenticated={!!user} />} />
            <Route path="/Settings" element={<PrivateRoute element={Settings} isAuthenticated={!!user} />} />
            <Route path="/SettingsProfile" element={<PrivateRoute element={SettingsModal} isAuthenticated={!!user} />} />
            <Route path="/profile" element={<PrivateRoute element={ProfilePage} isAuthenticated={!!user} />} />
            <Route path="/List" element={<PrivateRoute element={List} isAuthenticated={!!user} />} />
            <Route path="/post/:id" element={<PrivateRoute element={PostDetails} isAuthenticated={!!user} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <BottomHeader />
        </SearchProvider>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

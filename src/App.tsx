import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './app/store';
import Header from './elements/header/Header';
import ModalManager from './elements/modal/ModalManager';
import ProfilePage from './pages/ProfilePage';
import HomePage from "./pages/HomePage.tsx"; // Создадим следующим шагом

const App: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Router>
            <Header />

            <main style={{ padding: '20px' }}>
                <Routes>
                    {/* Главная страница */}
                    <Route path="/" element={<HomePage />} />

                    {/* Страница профиля  */}
                    <Route
                        path="/profile"
                        element={user ? <ProfilePage /> : <Navigate to="/" replace />}
                    />

                    {/* Редирект со всех несуществующих страниц на главную */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <ModalManager />
        </Router>
    );
};

export default App;
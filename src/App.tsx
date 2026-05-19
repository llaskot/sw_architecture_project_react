import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './app/store';
import Header from './elements/header/Header';
import ModalManager from './elements/modal/ModalManager';
import ProfilePage from './pages/ProfilePage';
import HomePage from "./pages/HomePage.tsx";
import CarPage from "./pages/CarPage/CarPage.tsx";
import RentPage from "./pages/RentPage/RentPage.tsx";
import MyRentsPage from "./pages/MyRentsPage/MyRentsPage.tsx";

const App: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Router>
            <Header />

            <main style={{ padding: '20px' }}>
                <Routes>
                    {/* Главная страница */}
                    <Route path="/" element={<HomePage />} />

                    {/*Car page*/}
                    <Route path="/cars/:car_id" element={<CarPage />} />

                    {/*rent page*/}
                    <Route path="/rent/:car_id" element={<RentPage />} />

                    {/* Route for user rental history list */}
                    <Route
                        path="/my-rents"
                        element={user ? <MyRentsPage /> : <Navigate to="/" replace />}
                    />

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
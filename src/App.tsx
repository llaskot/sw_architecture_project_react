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
import EditRentPage from "./pages/EditRentPage/EditRentPage.tsx";
import './App.css';
import AdminRentDetailsPage from "./pages/AdminPage/Rent/AdminRentDetailsPage.tsx";
import {UserDetailsPage} from "./pages/AdminPage/User/UserDetailsPage.tsx";
import AdminPage from "./pages/AdminPage/AdminPage.tsx";

const App: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Router>
            <Header />

            <main className="app-main">
                <Routes>
                    {/* Main page */}
                    <Route path="/" element={<HomePage />} />

                    {/* Car page */}
                    <Route path="/cars/:car_id" element={<CarPage />} />

                    {/* Rent page */}
                    <Route path="/rent/:car_id" element={<RentPage />} />

                    {/* Edit rent page */}
                    <Route path="/edit-rent/:rent_id" element={<EditRentPage />} />

                    {/* Route for user rental history list */}
                    <Route
                        path="/my-rents"
                        element={user ? <MyRentsPage /> : <Navigate to="/" replace />}
                    />

                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/rents/:id" element={<AdminRentDetailsPage />} />
                    <Route path="/admin/users/:id" element={<UserDetailsPage />} />

                    {/* Profile page */}
                    <Route
                        path="/profile"
                        element={user ? <ProfilePage /> : <Navigate to="/" replace />}
                    />

                    {/* Redirect from all non-existent pages to the main page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <ModalManager />
        </Router>
    );
};

export default App;
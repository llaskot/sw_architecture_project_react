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
import {UsersListPage} from "./pages/AdminPage/User/UsersListPage.tsx";
import {CreateUserPage} from "./pages/AdminPage/User/CreateUserPage.tsx";
import {CarsListPage} from "./pages/AdminPage/Car/CarsListPage.tsx";
import {CarDetailsPage} from "./pages/AdminPage/Car/CarDetailsPage.tsx";
import {CreateCarPage} from "./pages/AdminPage/Car/CreateCarPage.tsx";
import ModelsListPage from "./pages/AdminPage/Model/ModelsListPage.tsx";
import CreateModelPage from "./pages/AdminPage/Model/CreateModelPage.tsx";
import ModelDetailsPage from "./pages/AdminPage/Model/ModelDetailsPage.tsx";
import BrandsListPage from "./pages/AdminPage/Brand/BrandsListPage.tsx";
import BrandDetailsPage from "./pages/AdminPage/Brand/BrandDetailsPage.tsx";
import CreateBrandPage from "./pages/AdminPage/Brand/CreateBrandPage.tsx";
import {CreateCheckupPage} from "./pages/AdminPage/Checkup/CreateCheckupPage.tsx";

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

                    <Route path="/admin" element={<AdminPage role="admin"/>} />
                    <Route path="/admin/rents/:id" element={<AdminRentDetailsPage role="admin"/>} />
                    <Route path="/admin/users/:id" element={<UserDetailsPage />} />
                    <Route path="/admin/users" element={<UsersListPage role="admin" />} />
                    <Route path="/admin/users/create" element={<CreateUserPage />} />

                    <Route path="/admin/cars" element={<CarsListPage role="admin" />} />
                    <Route path="/admin/cars/create" element={<CreateCarPage role="admin" />} />
                    <Route path="/admin/cars/:id" element={<CarDetailsPage role="admin" />} />
                    <Route path="/admin/models" element={<ModelsListPage role="admin" />} />
                    <Route path="/admin/models/create" element={<CreateModelPage role="admin"/>} />
                    <Route path="/admin/models/:id" element={<ModelDetailsPage role="admin" />} />
                    <Route path="/admin/brands" element={<BrandsListPage role="admin" />} />
                    <Route path="/admin/brands/create" element={<CreateBrandPage role="admin" />} />
                    <Route path="/admin/brands/:id" element={<BrandDetailsPage role="admin" />} />
                    <Route path="/admin/checkup/create" element={<CreateCheckupPage/>} />



                    <Route path="/manager" element={<AdminPage role="manager"/>} />
                    <Route path="/manager/users" element={<UsersListPage role="manager" />} />
                    <Route path="/manager/cars" element={<CarsListPage role="manager" />} />
                    <Route path="/manager/models" element={<ModelsListPage role="manager" />} />
                    <Route path="/manager/brands" element={<BrandsListPage role="manager" />} />

                    <Route path="/manager/users/:id" element={<UserDetailsPage role="manager" />} />
                    <Route path="/manager/rents/:id" element={<AdminRentDetailsPage role="manager"/>} />
                    <Route path="/manager/cars/:id" element={<CarDetailsPage role="manager" />} />
                    <Route path="/manager/models/:id" element={<ModelDetailsPage role="manager" />} />
                    <Route path="/manager/brands/:id" element={<BrandDetailsPage role="manager" />} />








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
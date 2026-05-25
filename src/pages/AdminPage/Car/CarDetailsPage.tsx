import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCar, getModels, updateCar, uploadCarImage, type Car, type AutoModelRead } from '../../../api/carsApi';
import { CarContainer } from '../../../elements/car/CarContainer/CarContainer';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import Button from '../../../elements/button/Button';
import './CarDetailsPage.css';

interface CarDetailsPageProps {
    role: 'admin' | 'manager';
}

export const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ role }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [car, setCar] = useState<Car | null>(null);
    const [models, setModels] = useState<AutoModelRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCarAndModels = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const [carData, modelsData] = await Promise.all([
                    getCar(id),
                    getModels()
                ]);

                setCar(carData);
                setModels(modelsData);
            } catch (err) {
                console.error("Failed to load car details:", err);
                setError(t('admin.car.loadError', 'Failed to load car details'));
            } finally {
                setLoading(false);
            }
        };

        fetchCarAndModels();
    }, [id, t]);

    const handleSave = async (updatedData: any) => {
        if (!id) return;

        // Отделяем файл от остальных данных
        const { newImageFile, ...carPayload } = updatedData;

        // 1. Сохраняем текстовые данные
        let savedCar = await updateCar(id, carPayload);

        // 2. Если добавили картинку — грузим её и обновляем стейт
        if (newImageFile) {
            await uploadCarImage(id, newImageFile);
            savedCar = await getCar(id);
        }

        setCar(savedCar);
    };

    const handleGoBack = () => {
        navigate(`/${role}/cars`);
    };

    if (loading) {
        return (
            <div className="car-details-page loading">
                {t('rent.loading', 'Loading...')}
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="car-details-page">
                <Button onClick={handleGoBack} className="btn-small car-details-back-btn">
                    &larr; {t('admin.nav.back', 'Go Back')}
                </Button>
                <RentErrorBlock message={error || t('admin.car.notFound', 'Car not found')} />
            </div>
        );
    }

    return (
        <div className="admin-rent-details-container">
            <div className="admin-rent-header">
                <h2 className="car-details-title">
                    {car.model?.brand?.name} {car.model?.name}
                    <span className="car-details-id">#{car._id}</span>
                </h2>
                <div>
                    <Button
                        onClick={handleGoBack}
                        type="button"
                        className="btn-nav"
                    >
                        {t('admin.nav.back', 'Go Back')}
                    </Button>
                </div>
            </div>

            <RentErrorBlock message={error} />

            <div className="admin-rent-content">
                <CarContainer
                    initialData={car}
                    role={role}
                    mode="view"
                    models={models}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
};
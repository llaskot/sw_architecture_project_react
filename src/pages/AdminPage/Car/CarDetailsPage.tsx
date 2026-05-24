import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCar, getModels, updateCar, type Car, type AutoModelRead } from '../../../api/carsApi';
import { CarContainer } from '../../../elements/car/CarContainer/CarContainer';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import Button from '../../../elements/button/Button';
import './CarDetailsPage.css';
import ImageUploadModal from "../../../elements/modal/ImageUploadModal.tsx";

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
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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

    const handleImageUploadSuccess = async () => {
        if (!id) return;
        try {
            const carData = await getCar(id);
            setCar(carData);
        } catch (err) {
            console.error("Failed to refresh car details:", err);
        }
    };

    const handleSave = async (updatedData: Partial<Car>) => {
        if (!id) return;
        const savedCar = await updateCar(id, updatedData);
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
        <div className="car-details-page">
            <div className="car-details-header">
                <Button onClick={handleGoBack} className="btn-small car-details-back-btn">
                    &larr; {t('admin.nav.back', 'Go Back')}
                </Button>
                <h2 className="car-details-title">
                    {car.model?.brand?.name} {car.model?.name}
                    <span className="car-details-id">#{car._id.substring(0, 8)}</span>
                </h2>
            </div>

            <div className="car-details-content">
                <CarContainer
                    initialData={car}
                    role={role}
                    mode="view"
                    models={models}
                    onSave={handleSave}
                    onImageUploadClick={() => setIsImageModalOpen(true)}
                />
            </div>
            <ImageUploadModal
                isOpen={isImageModalOpen}
                carId={car._id}
                onClose={() => setIsImageModalOpen(false)}
                onSuccess={handleImageUploadSuccess}
            />
        </div>
    );
};
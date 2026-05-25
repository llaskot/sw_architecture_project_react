import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createCar, getModels, uploadCarImage, type AutoModelRead } from '../../../api/carsApi';
import { CarContainer } from '../../../elements/car/CarContainer/CarContainer';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import Button from '../../../elements/button/Button';
import './CreateCarPage.css';

interface CreateCarPageProps {
    role: 'admin' | 'manager';
}

export const CreateCarPage: React.FC<CreateCarPageProps> = ({ role }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [models, setModels] = useState<AutoModelRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true);
            setError(null);

            try {
                const modelsData = await getModels();
                setModels(modelsData);
            } catch (err) {
                console.error("Failed to load models:", err);
                setError(t('admin.car.loadModelsError', 'Failed to load models for the dropdown'));
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, [t]);

    const handleSave = async (newData: any) => {
        // Отделяем файл от данных
        const { newImageFile, ...carPayload } = newData;

        // 1. Создаем машину (нам нужен её _id)
        const createdCar = await createCar(carPayload);

        // 2. Если есть картинка и машина создалась успешно — загружаем картинку
        if (newImageFile && createdCar._id) {
            await uploadCarImage(createdCar._id, newImageFile);
        }

        navigate(`/${role}/cars`);
    };

    const handleGoBack = () => {
        navigate(`/${role}/cars`);
    };

    if (loading) {
        return (
            <div className="create-car-page loading">
                {t('rent.loading', 'Loading...')}
            </div>
        );
    }

    return (
        <div className="create-car-page">
            <div className="admin-rent-header">
                <h2 className="create-car-title">
                    {t('admin.car.createNew', 'Create New Car')}
                </h2>
                <Button onClick={handleGoBack} className="btn-nav create-car-back-btn">
                   {t('admin.nav.back', 'Go Back')}
                </Button>

            </div>

            {error && <RentErrorBlock message={error} />}

            <div className="create-car-content">
                <CarContainer
                    initialData={{
                        active: true,
                        available: true,
                        in_use: false
                    }}
                    role={role}
                    mode="create"
                    models={models}
                    onSave={handleSave}
                    onCancelBack={handleGoBack}
                />
            </div>
        </div>
    );
};
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCarById, type Car } from '../../api/carsApi';
import CarPlaceholder from '../../elements/carCard/CarPlaceholder';
import './CarPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CarPage: React.FC = () => {
    const { car_id } = useParams<{ car_id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!car_id) return;

        setLoading(true);
        getCarById(car_id)
            .then((data) => {
                setCar(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(t('carDetail.errorLoad', 'Помилка завантаження даних'));
                setLoading(false);
            });
    }, [car_id, t]);

    if (loading) {
        return <div className="car-page-loading">{t('home.loading', 'Завантаження машин...')}</div>;
    }

    if (error || !car) {
        return (
            <div className="car-page-error">
                <p>{error || t('carDetail.notFound', 'Автомобіль не знайдено')}</p>
                <button className="car-page__btn-back" onClick={() => navigate('/')}>
                    {t('carDetail.backToList', 'Назад до списку')}
                </button>
            </div>
        );
    }

    const brandName = car.model?.brand?.name || t('carCard.unknown', 'Невідомо');
    const modelName = car.model?.name || t('carCard.unknown', 'Невідомо');
    const title = `${brandName} ${modelName}`.trim();

    // Берём большую версию картинки
    const imageUrl = car.img?.large ? `${BASE_URL}/${car.img.large}` : null;

    return (
        <div className="car-page">
            {/* Шапка: модель сверху (крупно), производитель снизу (поменьше) */}
            <div className="car-page__header">
                <div className="car-page__title-container car-page__tooltip-trigger">
                    <h1 className="car-page__model-title">{modelName}</h1>
                    {car.model?.description && (
                        <div className="car-page__tooltip">
                            {car.model.description}
                        </div>
                    )}
                </div>

                <div className="car-page__brand-container car-page__tooltip-trigger">
                    <h2 className="car-page__brand-title">
                        {t('carCard.brandLabel', 'Виробник')}: {brandName}
                    </h2>
                    {car.model?.brand?.description && (
                        <div className="car-page__tooltip">
                            {car.model.brand.description}
                        </div>
                    )}
                </div>
            </div>

            <div className="car-page__content">
                {/* ЛЕВАЯ СТОРОНА: Медиа-блок (Большое фото или умный SVG) */}
                <div className="car-page__media-side">
                    <div className="car-page__image-wrapper">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="car-page__img"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <CarPlaceholder category={car.model?.category} />
                        )}
                    </div>
                </div>

                {/* ПРАВАЯ СТОРОНА: Характеристики автомобиля */}
                <div className="car-page__info-side">
                    <div className="car-page__specs">
                        <div className="car-page__spec-item">
                            <span className="car-page__spec-label">{t('carCard.brandLabel', 'Виробник')}:</span>
                            <span className="car-page__spec-value">{brandName}</span>
                        </div>
                        <div className="car-page__spec-item">
                            <span className="car-page__spec-label">{t('carDetail.countryLabel', 'Країна виробника')}:</span>
                            <span className="car-page__spec-value">{car.model?.brand?.country || t('carCard.unknown', 'Невідомо')}</span>
                        </div>
                        <div className="car-page__spec-item">
                            <span className="car-page__spec-label">{t('carDetail.categoryLabel', 'Клас комфорту')}:</span>
                            <span className="car-page__spec-value">{car.model?.category || t('carCard.unknown', 'Невідомо')}</span>
                        </div>
                        <div className="car-page__spec-item">
                            <span className="car-page__spec-label">{t('carCard.year', 'Рік')}:</span>
                            <span className="car-page__spec-value">{car.year}</span>
                        </div>
                        <div className="car-page__spec-item">
                            <span className="car-page__spec-label">{t('carCard.color', 'Колір')}:</span>
                            <span className="car-page__spec-value">{car.color}</span>
                        </div>
                        <div className="car-page__spec-item">
                            <span className="car-page__spec-label">{t('carDetail.mileageLabel', 'Пробіг')}:</span>
                            <span className="car-page__spec-value">{car.mileage} км</span>
                        </div>
                    </div>

                    {/* Нижний блок: Цена, статус доступности строго под ней и кнопки */}
                    <div className="car-page__action-section">
                        <div className="car-page__price-box">
                            <div className="car-page__price">
                                ${car.price_per_day} <span className="car-page__price-period">/ {t('carCard.pricePerDay', 'доба')}</span>
                            </div>
                            <div className={`car-page__status ${car.available ? 'car-page__status--available' : 'car-page__status--unavailable'}`}>
                                {car.available ? t('carCard.available', 'Доступно') : t('carCard.unavailable', 'Недоступно')}
                            </div>
                        </div>

                        <div className="car-page__buttons-group">
                            <button className="car-page__btn-book" disabled={!car.available}>
                                {t('carDetail.bookBtn', 'Забронювати на майбутнє')}
                            </button>
                            <button className="car-page__btn-back" onClick={() => navigate('/')}>
                                {t('carDetail.backToList', 'Назад до списку')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarPage;
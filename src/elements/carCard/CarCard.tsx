import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CarPlaceholder from './CarPlaceholder';
import './CarCard.css';

interface CarBrand {
    _id: string;
    name: string;
    country: string;
    description: string;
    active: boolean;
}

interface CarModel {
    _id: string;
    brand_id: string;
    name: string;
    description: string;
    category: string;
    active: boolean;
    brand?: CarBrand | null;
}

interface CarCardProps {
    car: {
        _id: string;
        model_id: string;
        vin: string;
        plate_number: string;
        year: number;
        color: string;
        mileage: number;
        price_per_day: number;
        available: boolean;
        in_use: boolean;
        active: boolean;
        img?: {
            small: string;
            large: string;
        } | null;
        model?: CarModel | null;
    };
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CarCard: React.FC<CarCardProps> = ({ car }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const brandName = car.model?.brand?.name || t('carCard.unknown', 'Невідомо');
    const modelName = car.model?.name || t('carCard.unknown', 'Невідомо');
    const title = `${brandName} ${modelName}`.trim();

    const imageUrl = car.img?.small
        ? `${BASE_URL}/${car.img.small}?t=${Date.now()}`
        : null;
    const handleNavigate = () => {
        navigate(`/cars/${car._id}`);
    };

    return (
        <div className="car-card">
            {/* Ліва частина: Інформація */}
            <div className="car-card__info-side">
                <div className="car-card__meta-group">
                    {/* Модель */}
                    <div className="car-card__field car-card__field--model">
                        <span className="car-card__value">{modelName}</span>
                    </div>

                    {/* Виробник */}
                    <div className="car-card__field car-card__field--brand">
                        <span className="car-card__label">{t('carCard.brandLabel', 'Виробник')}:</span>
                        <span className="car-card__value">{brandName}</span>
                    </div>
                </div>

                <div className="car-card__specs-group">
                    <div className="car-card__field">
                        <span className="car-card__label">{t('carCard.year')}:</span>
                        <span className="car-card__value">{car.year}</span>
                    </div>

                    <div className="car-card__field">
                        <span className="car-card__label">{t('carCard.color')}:</span>
                        <span className="car-card__value">{car.color}</span>
                    </div>
                </div>

                {/* Блок ціни та доступності */}
                <div className="car-card__price-section">
                    <div className="car-card__price">
                        ${car.price_per_day} <span className="car-card__price-period">/ {t('carCard.pricePerDay')}</span>
                    </div>
                    <div className={`car-card__status ${car.available ? 'car-card__status--available' : 'car-card__status--unavailable'}`}>
                        {car.available ? t('carCard.available') : t('carCard.unavailable')}
                    </div>
                </div>
            </div>

            {/* Права частина: Картинка та кнопка */}
            <div className="car-card__image-side">
                <div className="car-card__image-wrapper">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="car-card__img"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        /* Прокидываем категорию для выбора правильного SVG-плейсхолдера */
                        <CarPlaceholder category={car.model?.category} />
                    )}
                </div>
                <button className="car-card__button" onClick={handleNavigate}>
                    {t('carCard.moreDetails')}
                </button>
            </div>
        </div>
    );
};

export default CarCard;
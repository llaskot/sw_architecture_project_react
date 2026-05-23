import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCarById, type Car } from '../../api/carsApi';
import { createRent } from '../../api/rentApi';
import RentForm, { type RentFormValues } from '../../elements/rent/RentForm/RentForm';
import Button from '../../elements/button/Button';
import './RentPage.css';
import {parseApiError} from "../../utils/errorHandler.ts";

const RentPage: React.FC = () => {
    const { car_id } = useParams<{ car_id: string }>();
    const { t } = useTranslation();

    // Состояния для загрузки данных об авто
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageError, setPageError] = useState<string | null>(null);

    // Состояния для процесса отправки формы аренды
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // Первоначальный запрос данных машины для получения актуальной цены за сутки
    useEffect(() => {
        if (!car_id) {
            setPageError(t('carDetail.notFound', 'Автомобіль не знайдено'));
            setLoading(false);
            return;
        }

        getCarById(car_id)
            .then((data) => {
                setCar(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setPageError(t('carDetail.errorLoad', 'Помилка завантаження даних'));
                setLoading(false);
            });
    }, [car_id, t]);

// Обработчик отправки данных на бэкенд
    const handleRentSubmit = async (values: RentFormValues) => {
        if (!car_id) return;

        setIsSubmitting(true);
        setServerError(null);

        try {
            await createRent({
                car_id,
                ...values
            });

            // Если дошли сюда — всё 100% успешно
            setIsSuccess(true);
        } catch (err: any) {
            console.error(err);
            // Сразу парсим ошибку через нашу новую утилиту
            setServerError(parseApiError(err, t('rent.error', 'Failed to submit rental request')));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="rent-page-status">{t('home.loading', 'Завантаження...')}</div>;
    }

    if (pageError || !car) {
        return (
            <div className="rent-page-status rent-page-status--error">
                <p>{pageError || t('carDetail.notFound')}</p>
                <Button onClick={() => window.close()}>{t('rent.closeTab', 'Закрити вкладку')}</Button>
            </div>
        );
    }

    // Экран успешного завершения бронирования автомобиля
    if (isSuccess) {
        return (
            <div className="rent-page-success">
                <div className="rent-page-success__box">
                    <h2>🎉 {t('rent.successTitle', 'Оренду успішно оформлено!')}</h2>
                    <p>{t('rent.successText', "Ваше замовлення прийнято в обробку. Менеджер зв'яжеться з вами найближчим часом.")}</p>
                    <Button onClick={() => window.close()}>{t('rent.closeTab', 'Закрити вкладку')}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="rent-page">
            <div className="rent-page__container">
                <h1 className="rent-page__title">{t('rent.pageTitle', 'Оформлення оренди')}</h1>

                {/* Краткая сводка по выбранному автомобилю */}
                <div className="rent-page__car-preview">
                    <h2 className="rent-page__car-name">
                        {car.model?.name}
                    </h2>
                    <div className="rent-page__car-meta">
                        <span>{t('carCard.year', 'Рік')}: <strong>{car.year}</strong></span>
                        <span>{t('carCard.color', 'Колір')}: <strong>{car.color}</strong></span>
                        <span>{t('carCard.pricePerDay', 'Ціна за добу')}: <strong>${car.price_per_day}</strong></span>
                        <span>{t('carCard.plate_number')}: <strong>{car.plate_number}</strong></span>
                    </div>
                </div>

                {/* Внедряем наш переиспользуемый компонент формы */}
                <RentForm
                    pricePerDay={car.price_per_day}
                    onSubmit={handleRentSubmit}
                    isSubmitting={isSubmitting}
                    serverError={serverError}
                    onClearServerError={() => setServerError(null)}
                />
            </div>
        </div>
    );
};

export default RentPage;
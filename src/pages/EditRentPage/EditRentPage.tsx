import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRentById, updateRent } from '../../api/rentApi';
import { getCarById, type Car } from '../../api/carsApi';
import CarSelectDropdown from '../../elements/rent/CarSelectDropdown/CarSelectDropdown';
import RentForm, { type RentFormValues } from '../../elements/rent/RentForm/RentForm';
import Button from '../../elements/button/Button';
import './EditRentPage.css';
import {parseApiError} from "../../utils/errorHandler.ts";

const EditRentPage: React.FC = () => {
    const { rent_id } = useParams<{ rent_id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Состояния для первичной загрузки страницы
    const [loading, setLoading] = useState<boolean>(true);
    const [pageError, setPageError] = useState<string | null>(null);

    // Состояния формы и автомобиля
    const [initialValues, setInitialValues] = useState<Partial<RentFormValues>>();
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [carPreview, setCarPreview] = useState<Car | null>(null);
    const [isCarLoading, setIsCarLoading] = useState<boolean>(false);

    // Состояния процесса отправки
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false); // <-- Добавили состояние успеха

    // Первоначальный запрос данных аренды по ID
    useEffect(() => {
        if (!rent_id) {
            setPageError(t('rent.edit.notFound', 'Ідентифікатор оренди не знайдено'));
            setLoading(false);
            return;
        }

        getRentById(rent_id)
            .then((data) => {
                if (data.car) {
                    setCarPreview(data.car as unknown as Car);
                }
                setSelectedCarId(data.car_id);

                setInitialValues({
                    start_date: data.start_date,
                    days_qty: data.days_qty,
                    driver: data.driver,
                    user_dock: data.user_dock
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setPageError(parseApiError(err, t('rent.edit.errorLoad', 'Помилка завантаження даних оренди')));
                setLoading(false);
            });
    }, [rent_id, t]);

    // Обработчик изменения автомобиля в дропдауне
    const handleCarChange = async (newCarId: string) => {
        setSelectedCarId(newCarId);
        if (!newCarId) return;

        if (carPreview && carPreview._id === newCarId) return;

        setIsCarLoading(true);
        try {
            const newCarData = await getCarById(newCarId);
            setCarPreview(newCarData);
        } catch (err) {
            console.error('Failed to load new car details:', err);
        } finally {
            setIsCarLoading(false);
        }
    };

    // Обработчик отправки обновленных данных
// Обработчик отправки обновленных данных
    const handleRentSubmit = async (values: RentFormValues) => {
        if (!rent_id || !selectedCarId) return;

        setIsSubmitting(true);
        setServerError(null);

        try {
            const payload = {
                car_id: selectedCarId,
                ...values
            };

            await updateRent(rent_id, payload);

            // Просто включаем экран успеха
            setIsSuccess(true);
        } catch (err: any) {
            console.error(err);
            // Используем глобальную функцию для вывода ошибки
            setServerError(parseApiError(err, t('rent.edit.errorSubmit', 'Помилка оновлення оренди')));
        } finally {
            setIsSubmitting(false);
        }
    };
    // Отображение состояний загрузки и ошибок
    if (loading) {
        return <div className="edit-rent-page__loading">{t('home.loading', 'Завантаження...')}</div>;
    }

    if (pageError) {
        return (
            <div className="edit-rent-page__error">
                <p>{pageError}</p>
                <Button onClick={() => navigate('/my-rents')}>{t('profile.cancel', 'Назад')}</Button>
            </div>
        );
    }

    // <-- Добавили Экран успешного обновления (покажется вместо формы)
    if (isSuccess) {
        return (
            <div className="edit-rent-page-success">
                <div className="edit-rent-page-success__box">
                    <h2>🎉 {t('rent.edit.successTitle', 'Оренду успішно оновлено!')}</h2>
                    <p>{t('rent.edit.successText', 'Зміни збережено. Ви можете повернутися до списку своїх бронювань.')}</p>
                    <Button onClick={() => navigate('/my-rents')}>
                        {t('rent.edit.backToList', 'До списку оренд')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-rent-page">
            <div className="edit-rent-page__container">
                <h1 className="edit-rent-page__title">{t('rent.edit.pageTitle', 'Редагування оренди')}</h1>

                <div className="edit-rent-page__dropdown-wrapper">
                    <CarSelectDropdown
                        label={t('rent.edit.carLabel', 'Обраний автомобіль')}
                        selectedCarId={selectedCarId}
                        onCarChange={handleCarChange}
                    />
                </div>

                {isCarLoading ? (
                    <div className="edit-rent-page__loading">{t('home.loading', 'Оновлення авто...')}</div>
                ) : carPreview ? (
                    <div className="edit-rent-page__car-preview">
                        <h2 className="edit-rent-page__car-name">
                            {carPreview.model?.name}
                        </h2>
                        <div className="edit-rent-page__car-meta">
                            <span>{t('carCard.year', 'Рік')}: <strong>{carPreview.year}</strong></span>
                            <span>{t('carCard.color', 'Колір')}: <strong>{carPreview.color}</strong></span>
                            <span>{t('carCard.pricePerDay', 'Ціна за добу')}: <strong>${carPreview.price_per_day}</strong></span>
                            <span>{t('carCard.plate_number', 'Номер')}: <strong>{carPreview.plate_number}</strong></span>
                        </div>
                    </div>
                ) : null}

                {carPreview && (
                    <>
                        <RentForm
                            pricePerDay={carPreview.price_per_day}
                            initialValues={initialValues}
                            onSubmit={handleRentSubmit}
                            isSubmitting={isSubmitting}
                            serverError={serverError}
                            onClearServerError={() => setServerError(null)}
                        />
                        <div className="edit-rent-page__cancel-action">
                            <Button
                                onClick={() => navigate('/my-rents')}
                                disabled={isSubmitting}
                                className="edit-rent-page__btn-cancel"
                            >
                                {t('profile.cancel', 'Скасувати')}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditRentPage;
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import RentDatePicker from '../RentDatePicker/RentDatePicker';
import RentErrorBlock from '../RentErrorBlock/RentErrorBlock';
import Input from '../../input/Input';
import Button from '../../button/Button';
import './RentForm.css';
// import {useNavigate} from "react-router-dom";

export interface RentFormValues {
    start_date: string;
    days_qty: number;
    driver: boolean;
    user_dock: string;
}

interface RentFormProps {
    pricePerDay: number;
    initialValues?: Partial<RentFormValues>;
    onSubmit: (values: RentFormValues) => void;
    isSubmitting: boolean;
    serverError: string | null;
    onClearServerError: () => void;
}

const RentForm: React.FC<RentFormProps> = ({
                                               pricePerDay,
                                               initialValues,
                                               onSubmit,
                                               isSubmitting,
                                               serverError,
                                               onClearServerError,
                                           }) => {
    const {t} = useTranslation();
    // const navigate = useNavigate();

    // Внутренние состояния полей
    const [startDate, setStartDate] = useState<string>('');
    const [daysQty, setDaysQty] = useState<number | string>();
    const [driver, setDriver] = useState<boolean>(false);
    const [userDock, setUserDock] = useState<string>('');

    // Состояние для объединенной ошибки валидации формы
    const [validationError, setValidationError] = useState<string | null>(null);

    // Синхронизация данных при редактировании
    useEffect(() => {
        if (initialValues) {
            if (initialValues.start_date) {
                const localDate = new Date(initialValues.start_date);
                const offset = localDate.getTimezoneOffset() * 60000;
                setStartDate(new Date(localDate.getTime() - offset).toISOString().slice(0, 16));
            }
            if (initialValues.days_qty) setDaysQty(initialValues.days_qty);
            if (initialValues.driver !== undefined) setDriver(initialValues.driver);
            if (initialValues.user_dock) setUserDock(initialValues.user_dock);
        }
    }, [initialValues]);

    // Живой интерактивный пересчет стоимости
    const totalPrice = (Number(daysQty) || 0) * pricePerDay;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        onClearServerError(); // Сброс ошибки сервера при новой попытке

        // Собираем все ошибки валидации в один массив
        const errors: string[] = [];
        if (!startDate) errors.push(t('rent.error.startDateRequired', 'Оберіть дату та час початку'));
        if (!userDock.trim()) errors.push(t('rent.error.userDockRequired', 'Вкажіть дані документа'));
        if (!daysQty || Number(daysQty) < 1) {
            errors.push(t('rent.error.daysMin', 'Мінімальний термін — 1 доба'));
        }
        // Если есть ошибки, склеиваем их через точку с запятой для вывода в одно поле
        if (errors.length > 0) {
            setValidationError(errors.join('; '));
            return;
        }

        // Если всё ок, отправляем данные

        onSubmit({
            start_date: new Date(startDate).toISOString(),
            days_qty: Number(daysQty),
            driver,
            user_dock: userDock.trim(),
        });
    };

    // Определяем, какую ошибку выводить (приоритет у серверной, если она есть)
    const activeError = serverError || validationError;

    const handleClearErrors = () => {
        setValidationError(null);
        onClearServerError();
    };

    return (
        /* noValidate отключает стандартные всплывающие подсказки браузера */
        <form onSubmit={handleFormSubmit} className="rent-form" noValidate>

            {/* Компонент выбора даты и времени (теперь без локальной ошибки снизу) */}
            <RentDatePicker
                label={t('rent.startDateLabel', 'Дата та час початку оренди')}
                value={startDate}
                onChange={setStartDate}
            />

            {/* Инпут для количества дней */}
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                label={t('rent.daysQtyLabel', 'Кількість діб оренди')}
                value={daysQty}
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                        setDaysQty(val);
                    }
                }}
            />

            {/* Инпут для документов */}
            <Input
                type="text"
                label={t('rent.userDockLabel', 'Паспортні дані / Посвідчення водія')}
                placeholder={t('rent.userDockPlaceholder', 'Серія, номер або ID-картка')}
                value={userDock}
                onChange={(e) => setUserDock(e.target.value)}
            />

            {/* Выбор водителя */}
            <div className="rent-form__checkbox-wrapper">
                <label className="rent-form__checkbox-label">
                    <input
                        type="checkbox"
                        checked={driver}
                        onChange={(e) => setDriver(e.target.checked)}
                        className="rent-form__checkbox"
                    />
                    <span className="rent-form__checkbox-text">
                        {t('rent.driverLabel', 'Потрібен водій')}
                    </span>
                </label>
            </div>

            {/* Расчет цены */}
            <div className="rent-form__price-box">
                <span className="rent-form__price-label">{t('rent.totalPriceLabel', 'Загальна вартість')}:</span>
                <span className="rent-form__price-value">${totalPrice}</span>
            </div>

            {/* Единое поле вывода перехваченных ошибок — строго над кнопкой подтверждения */}
            {activeError && (
                <RentErrorBlock message={activeError} onClose={handleClearErrors}/>
            )}

            {/* Кнопка отправки */}
            <div>
                <Button type="submit" disabled={isSubmitting} className="confirm-big">
                    {isSubmitting ? t('rent.submittingBtn', 'Обробка...') : t('rent.submitBtn', 'Підтвердити замовлення')}
                </Button>

            </div>
        </form>

    );
};

export default RentForm;
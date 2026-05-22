import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../input/Input';
import './RentDatePicker.css';

interface RentDatePickerProps {
    label: string;
    value: string; // Ожидает формат "YYYY-MM-DDTHH:00"
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

const RentDatePicker: React.FC<RentDatePickerProps> = ({
                                                           label,
                                                           value,
                                                           onChange,
                                                           error,
                                                           disabled = false,
                                                       }) => {
    const { t } = useTranslation();

    // Разделяем входящую строку на дату и час
    const [datePart, timePart] = value ? value.split('T') : ['', ''];
    const selectedHour = timePart ? timePart.slice(0, 2) : '';

    // Вычисляем текущую дату в локальном формате для блокировки прошлого (min)
    const getMinDate = (): string => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().split('T')[0];
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        const hour = selectedHour || '00'; // Если час еще не выбран, ставим 00
        onChange(newDate ? `${newDate}T${hour}:00` : '');
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHour = e.target.value;
        const date = datePart || getMinDate(); // Если дата не выбрана, ставим текущую
        onChange(`${date}T${newHour}:00`);
    };

    // Генерируем массив часов от 00 до 23 для выпадающего списка
    const hoursOptions = Array.from({ length: 24 }, (_, i) => {
        return i < 10 ? `0${i}` : `${i}`;
    });

    return (
        <div className="rent-datetime-container">
            <span className="rent-datetime-label">{label}</span>

            <div className={`rent-datetime-fields ${disabled ? 'rent-datetime-fields--disabled' : ''}`}>
                <div className="rent-datetime-fields__date">
                    <Input
                        type="date"
                        value={datePart}
                        min={getMinDate()} // Блокируем прошлые дни
                        onChange={handleDateChange}
                        error={error}
                        disabled={disabled} // <-- Добавили
                    />
                </div>

                <div className="rent-datetime-fields__hour">
                    <select
                        value={selectedHour}
                        onChange={handleHourChange}
                        className="rent-datetime-select"
                        disabled={disabled} // <-- Добавили
                    >
                        <option value="" disabled>
                            {t('rent.chooseHour', 'Година')}
                        </option>
                        {hoursOptions.map((hour) => (
                            <option key={hour} value={hour}>
                                {hour}:00
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default RentDatePicker;
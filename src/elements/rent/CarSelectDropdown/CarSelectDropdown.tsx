import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getCars, type Car } from '../../../api/carsApi';
import './CarSelectDropdown.css';

interface CarSelectDropdownProps {
    selectedCarId: string | null;
    onCarChange: (carId: string, car: Car) => void;
    label?: string;
}

const CarSelectDropdown: React.FC<CarSelectDropdownProps> = ({
                                                                 selectedCarId,
                                                                 onCarChange,
                                                                 label
                                                             }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCarName, setSelectedCarName] = useState<string>('');

    const containerRef = useRef<HTMLDivElement>(null);

    // Закрытие дропдауна при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Живой поиск машин с дебаунсом и жестким лимитом в 10000 единиц
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('limit', '10000'); // Хардкодный лимит, чтобы забрать все машины разом

                if (searchQuery) {
                    params.append('search', searchQuery);
                }

                const response = await getCars(params);
                setCars(response.items || []);

                // Если машина уже выбрана, вытягиваем только её модель и госномер для триггера
                if (selectedCarId && !searchQuery) {
                    const currentCar = response.items.find(c => c._id === selectedCarId);
                    if (currentCar) {
                        setSelectedCarName(`${currentCar.model?.name} (${currentCar.plate_number})`);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch cars for dropdown:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedCarId]);

    const handleSelectCar = (car: Car) => {
        setSelectedCarName(`${car.model?.name} (${car.plate_number})`);
        onCarChange(car._id, car);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="car-select-dropdown" ref={containerRef}>
            {label && <label className="car-select-dropdown__label">{label}</label>}

            <div
                className={`car-select-dropdown__trigger ${isOpen ? 'car-select-dropdown__trigger--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="car-select-dropdown__display">
                    {selectedCarName || t('rent.edit.selectCarPlaceholder', 'Select a vehicle...')}
                </span>
                <span className="car-select-dropdown__arrow">▼</span>
            </div>

            {isOpen && (
                <div className="car-select-dropdown__menu">
                    <input
                        type="text"
                        className="car-select-dropdown__search"
                        placeholder={t('rent.edit.searchCarPlaceholder', 'Type to filter cars...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />

                    <div className="car-select-dropdown__options">
                        {loading && <div className="car-select-dropdown__loading">{t('home.loading', 'Loading cars...')}</div>}

                        {!loading && cars.length === 0 && (
                            <div className="car-select-dropdown__empty">{t('home.noCars', 'No cars found')}</div>
                        )}

                        {!loading && cars.map((car) => (
                            <div
                                key={car._id}
                                className={`car-select-dropdown__option ${car._id === selectedCarId ? 'car-select-dropdown__option--selected' : ''}`}
                                onClick={() => handleSelectCar(car)}
                            >
                                <span className="car-select-dropdown__option-name">
                                    {car.model?.name}
                                </span>
                                <span className="car-select-dropdown__option-plate">
                                    {car.plate_number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarSelectDropdown;
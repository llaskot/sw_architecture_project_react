import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable, { type Column } from '../../DataTable/DataTable';
import Button from '../../button/Button';
import { type Car } from '../../../api/carsApi'; // ИМПОРТИРУЕМ РОДНОЙ ИНТЕРФЕЙС ИЗ API
import './CarsTable.css';

interface CarsTableProps {
    cars: Car[];
    loading: boolean;
    role: 'admin' | 'manager';
    onDeleteClick: (id: string) => void;
}

export const CarsTable: React.FC<CarsTableProps> = ({
                                                        cars,
                                                        loading,
                                                        role,
                                                        onDeleteClick
                                                    }) => {
    const { t } = useTranslation();

    const columns: Column<Car>[] = [
        {
            key: 'id',
            header: t('admin.table.id', 'ID'),
            render: (car) => (
                <div title={car._id} className="cars-table-id">
                    {car._id.substring(0, 8)}...
                </div>
            )
        },
        {
            key: 'brand',
            header: t('carCard.brand', 'Brand'),
            render: (car) => car.model?.brand?.name || '-'
        },
        {
            key: 'model',
            header: t('carCard.model', 'Model'),
            render: (car) => car.model?.name || '-'
        },
        {
            key: 'category',
            header: t('filters.categories.title', 'Category'),
            render: (car) => car.model?.category || '-'
        },
        {
            key: 'year',
            header: t('carCard.year', 'Year'),
            render: (car) => car.year || '-'
        },
        {
            key: 'mileage',
            header: t('carCard.mileage', 'Mileage'),
            render: (car) => car.mileage ? `${car.mileage} km` : '-'
        },
        {
            key: 'price',
            header: t('carCard.price', 'Price / Day'),
            render: (car) => `$${car.price_per_day || 0}`
        },
        {
            key: 'active',
            header: t('profile.statusActive', 'Active'),
            render: (car) => (
                <div className={`cars-bool-cell ${car.active ? 'bool-true' : 'bool-false'}`}>
                    {car.active ? '✓' : '✗'}
                </div>
            )
        },
        {
            key: 'actions',
            header: t('admin.table.actions', 'Actions'),
            render: (car) => (
                <div className="cars-table-actions">
                    <Link
                        to={`/${role}/cars/${car._id}`}
                        className="btn-small cars-btn-show"
                    >
                        {t('carCard.moreDetails', 'Show')}
                    </Link>

                    {role === 'admin' && (
                        <Button
                            type="button"
                            className="btn-small cars-btn-delete"
                            onClick={() => onDeleteClick(car._id)}
                        >
                            {t('rent.actions.delete', 'Delete')}
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="cars-table-container">
        <DataTable
            data={cars}
            columns={columns}
            loading={loading}
            emptyMessage={t('rent.table.empty', 'No records found')}
        />
        </div>
    );
};
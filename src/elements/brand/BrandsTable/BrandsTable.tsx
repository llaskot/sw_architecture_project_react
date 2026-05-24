import React from 'react';
import { useTranslation } from 'react-i18next';
import DataTable, { type Column } from '../../DataTable/DataTable';
import Button from '../../button/Button';
import { type Brand } from '../../../api/carsApi';
import './BrandsTable.css';

interface BrandsTableProps {
    brands: Brand[];
    role: 'admin' | 'manager';
    onDetailsClick: (brand: Brand) => void;
    onDeleteClick?: (brand: Brand) => void;
}

export const BrandsTable: React.FC<BrandsTableProps> = ({
                                                            brands,
                                                            role,
                                                            onDetailsClick,
                                                            onDeleteClick
                                                        }) => {
    const { t } = useTranslation();

    const columns: Column<Brand>[] = [
        {
            key: 'name',
            header: t('admin.brands.name', 'Name'),
            render: (item) => item.name || '-'
        },
        {
            key: 'country',
            header: t('admin.brands.country', 'Country'),
            render: (item) => item.country || '-'
        },
        {
            key: 'description',
            header: t('admin.brands.description', 'Description'),
            render: (item) => {
                const text = item.description || '-';
                return text.length > 50 ? `${text.substring(0, 50)}...` : text;
            }
        },
        {
            key: 'active',
            header: t('admin.brands.active', 'Active'),
            render: (item) => (
                <span className={`brands-status-badge ${item.active ? 'active' : 'inactive'}`}>
                    {item.active ? t('admin.brands.yes', 'Yes') : t('admin.brands.no', 'No')}
                </span>
            )
        },
        {
            key: 'actions',
            header: t('admin.actions', 'Actions'),
            render: (item) => (
                <div className="brands-table-actions">
                    <Button
                        type="button"
                        className="btn-small action-btn details-btn"
                        onClick={() => onDetailsClick(item)}
                    >
                        {t('admin.actions.details', 'Details')}
                    </Button>

                    {role === 'admin' && onDeleteClick && (
                        <Button
                            type="button"
                            className="btn-small action-btn delete-btn"
                            onClick={() => onDeleteClick(item)}
                        >
                            {t('admin.actions.delete', 'Delete')}
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="brands-table-container">
            <DataTable
                columns={columns}
                data={brands}
            />
        </div>
    );
};

export default BrandsTable;
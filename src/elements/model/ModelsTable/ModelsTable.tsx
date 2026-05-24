import React from 'react';
import { useTranslation } from 'react-i18next';
import DataTable, { type Column } from '../../DataTable/DataTable';
import Button from '../../button/Button';
import { type AutoModelRead } from '../../../api/carsApi';
import './ModelsTable.css';

interface ModelsTableProps {
    models: AutoModelRead[];
    role: 'admin' | 'manager';
    onDetailsClick: (model: AutoModelRead) => void;
    onDeleteClick?: (model: AutoModelRead) => void;
}

export const ModelsTable: React.FC<ModelsTableProps> = ({
                                                            models,
                                                            role,
                                                            onDetailsClick,
                                                            onDeleteClick
                                                        }) => {
    const { t } = useTranslation();

    const columns: Column<AutoModelRead>[] = [
        {
            key: 'brand',
            header: t('admin.models.brand', 'Brand'),
            render: (item) => item.brand?.name || item.brand_id || '-'
        },
        {
            key: 'name',
            header: t('admin.models.name', 'Name'),
            render: (item) => item.name || '-'
        },
        {
            key: 'category',
            header: t('admin.models.category', 'Category'),
            render: (item) => item.category || '-'
        },
        {
            key: 'description',
            header: t('admin.models.description', 'Description'),
            render: (item) => {
                const text = item.description || '-';
                return text.length > 50 ? `${text.substring(0, 50)}...` : text;
            }
        },
        {
            key: 'active',
            header: t('admin.models.active', 'Active'),
            render: (item) => (
                <span className={`models-status-badge ${item.active ? 'active' : 'inactive'}`}>
                    {item.active ? t('admin.models.yes', 'Yes') : t('admin.models.no', 'No')}
                </span>
            )
        },
        {
            key: 'actions',
            header: t('admin.actions', 'Actions'),
            render: (item) => (
                <div className="models-table-actions">
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
        <div className="models-table-container">
            <DataTable
                columns={columns}
                data={models}
            />
        </div>
    );
};

export default ModelsTable;
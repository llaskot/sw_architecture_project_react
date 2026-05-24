import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getModels, deleteModel, type AutoModelRead } from '../../../api/carsApi';
import ModelsTable from '../../../elements/model/ModelsTable/ModelsTable';
import DeleteModal from '../../../elements/modal/DeleteModal';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import { CreateActionButton } from '../../../elements/button/CreateActionButton/CreateActionButton';
import Input from '../../../elements/input/Input';
import './ModelsListPage.css';

interface ModelsListPageProps {
    role: 'admin' | 'manager';
}

export const ModelsListPage: React.FC<ModelsListPageProps> = ({ role }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [models, setModels] = useState<AutoModelRead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [modelToDelete, setModelToDelete] = useState<AutoModelRead | null>(null);

    const fetchModels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getModels();
            setModels(data);
        } catch (err: any) {
            console.error("Failed to fetch models:", err);
            setError(t('admin.models.loadError', 'Failed to load models list.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    const handleDetailsClick = (model: AutoModelRead) => {
        navigate(`/${role}/models/${model._id}`);
    };

    const handleDeleteClick = (model: AutoModelRead) => {
        setModelToDelete(model);
        setDeleteModalOpen(true);
    };

    // Client-side filtering
    const filteredModels = useMemo(() => {
        if (!searchTerm.trim()) return models;
        const lowerSearch = searchTerm.toLowerCase();

        return models.filter(model => {
            const nameMatch = model.name?.toLowerCase().includes(lowerSearch);
            const brandMatch = model.brand?.name?.toLowerCase().includes(lowerSearch);
            const descMatch = model.description?.toLowerCase().includes(lowerSearch);
            return nameMatch || brandMatch || descMatch;
        });
    }, [models, searchTerm]);

    return (
        <div className="models-list-page">
            <div className="models-list-header">
                <h2 className="models-list-title">{t('admin.models.title', 'Models Management')}</h2>
                {role === 'admin' && (
                    <CreateActionButton
                        navigateTo={`/${role}/models/create`}
                    />
                )}
            </div>

            <div className="models-list-controls">
                <Input
                    label={t('admin.models.search', 'Search Models')}
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('admin.models.searchPlaceholder', 'Type name or brand...')}
                />
            </div>

            <RentErrorBlock message={error} />

            {loading ? (
                <div className="models-list-loading">{t('rent.loading', 'Loading...')}</div>
            ) : !error && (
                <ModelsTable
                    models={filteredModels}
                    role={role}
                    onDetailsClick={handleDetailsClick}
                    onDeleteClick={role === 'admin' ? handleDeleteClick : undefined}
                />
            )}

            {filteredModels.length === 0 && !loading && !error && (
                <div className="models-list-empty">
                    {t('admin.models.noModels', 'No models found matching your search.')}
                </div>
            )}

            <DeleteModal
                id={modelToDelete?._id || ''}
                isOpen={deleteModalOpen}
                title={t('admin.models.deleteConfirmTitle', 'Delete Model')}
                message={t('admin.models.deleteConfirmMessage', 'Are you sure you want to delete this model?')}
                confirmBtnText={t('admin.actions.delete', 'Delete')}
                errorText={t('admin.models.deleteError', 'Failed to delete model.')}
                onDeleteApi={deleteModel}
                onClose={() => setDeleteModalOpen(false)}
                onSuccess={() => {
                    if (modelToDelete) {
                        setModels(prev => prev.filter(m => m._id !== modelToDelete._id));
                    }
                    setDeleteModalOpen(false);
                }}
            />
        </div>
    );
};

export default ModelsListPage;
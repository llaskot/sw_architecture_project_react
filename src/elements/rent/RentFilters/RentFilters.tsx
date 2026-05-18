import React from 'react';
import { useTranslation } from 'react-i18next';
import MultiSelect from '../../MultiSelect/MultiSelect';
import './RentFilters.css';

interface RentFiltersProps {
    availableStages: string[];
    selectedStages: string[];
    onStagesChange: (stages: string[]) => void;
    sortDate: 'asc' | 'desc' | 'none';
    onSortDateChange: (sort: 'asc' | 'desc' | 'none') => void;
}

const RentFilters: React.FC<RentFiltersProps> = ({
                                                     availableStages,
                                                     selectedStages,
                                                     onStagesChange,
                                                     sortDate,
                                                     onSortDateChange,
                                                 }) => {
    const { t } = useTranslation();

    return (
        <div className="rent-filters">
            {/* Multi-select dropdown for filtering by rental stages */}
            <div className="rent-filters__item">
                <MultiSelect
                    label={t('rent.filters.stageLabel', 'Filter by Stage')}
                    options={availableStages}
                    selectedValues={selectedStages}
                    onChange={onStagesChange}
                    placeholder={t('rent.filters.stagePlaceholder', 'All Stages')}
                />
            </div>

            {/* Standard select dropdown for date sorting */}
            <div className="rent-filters__item">
                <label className="rent-filters__sort-label">
                    {t('rent.filters.sortLabel', 'Sort by Date')}
                </label>
                <select
                    value={sortDate}
                    onChange={(e) => onSortDateChange(e.target.value as any)}
                    className="rent-filters__select"
                >
                    <option value="desc">{t('rent.filters.sortDesc', 'Newest First')}</option>
                    <option value="asc">{t('rent.filters.sortAsc', 'Oldest First')}</option>
                    <option value="none">{t('rent.filters.sortNone', 'No Sorting')}</option>
                </select>
            </div>
        </div>
    );
};

export default RentFilters;
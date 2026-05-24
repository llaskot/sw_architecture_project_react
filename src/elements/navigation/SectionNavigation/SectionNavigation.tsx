import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SectionNavigation.css';

interface SectionNavigationProps {
    role: 'admin' | 'manager';
}

export const SectionNavigation: React.FC<SectionNavigationProps> = ({ role }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Определяем текущий раздел по URL
    const getActiveSection = () => {
        if (location.pathname.includes('/users')) return 'users';
        if (location.pathname.includes('/cars')) return 'cars';
        return 'rents';
    };

    const currentSection = getActiveSection();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const section = e.target.value;


        if (section === 'rents') {
            navigate(`/${role}`);
        } else {
            navigate(`/${role}/${section}`);
        }
    };



    return (
        <select
            className="section-navigation-select"
            value={currentSection}
            onChange={handleChange}
        >
            <option value="rents">{t('admin.nav.rents', 'Rents')}</option>
            <option value="users">{t('admin.nav.users', 'Users')}</option>
            {role === 'admin' && (
                <option value="cars">{t('admin.nav.cars', 'Cars')}</option>
            )}
        </select>
    );
};
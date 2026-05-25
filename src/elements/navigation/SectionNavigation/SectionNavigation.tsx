import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import './SectionNavigation.css';

interface SectionNavigationProps {
    role: 'admin' | 'manager';
}

export const SectionNavigation: React.FC<SectionNavigationProps> = ({role}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Определяем текущий раздел по URL
    const getActiveSection = () => {
        if (location.pathname.includes('/users')) return 'users';
        if (location.pathname.includes('/cars')) return 'cars';
        if (location.pathname.includes('/models')) return 'models';
        if (location.pathname.includes('/brands')) return 'brands';

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
                <option value="rents">{t(`${role}.nav.rents`, 'Rents')}</option>
                <option value="users">{t(`${role}.nav.users`, 'Users')}</option>

                <option value="cars">{t(`${role}.nav.cars`, 'Cars')}</option>
                <option value="models">{t(`${role}.nav.models`, 'Models')}</option>
                <option value="brands">{t(`${role}.nav.brands`, 'Brands')}</option>

        </select>
    );
};
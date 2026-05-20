import React from 'react';
import { useTranslation } from 'react-i18next';
import './AdminPage.css';

const AdminPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="admin-page-container">
            <div className="admin-page-content">
                <h2>{t('admin.title', 'Admin Dashboard')}</h2>
                {/* Empty content area ready for data tables */}
            </div>
        </div>
    );
};

export default AdminPage;
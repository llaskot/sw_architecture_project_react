import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserById, updateUser } from '../../../api/userApi';
import { UserContainer } from '../../../elements/user/UserContainer/UserContainer';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import './UserDetailsPage.css';

interface UserDetailsPageProps {
    role?: 'admin' | 'manager';
}

export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ role = 'admin' }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null);
                const data = await getUserById(id);
                setUserData(data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || t('carDetail.errorLoad', 'Error loading data'));
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, t]);

    const handleSave = async (updatedData: any) => {
        if (!id) return;
        const result = await updateUser(id, updatedData);
        setUserData(result);
    };

    if (loading) {
        return <div className="user-details-loading">{t('rent.submittingBtn', 'Processing...')}</div>;
    }

    if (error && !userData) {
        return (
            <div className="user-details-page">
                <RentErrorBlock message={error} />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="user-details-page">
                <RentErrorBlock message={t('carDetail.notFound', 'Not found')} />
            </div>
        );
    }

    return (
        <div className="user-details-page">
            <div className="user-details-header">
                <h2 className="user-details-title">{t('profile.title', 'User Profile')}</h2>
                <button className="btn-back" onClick={() => navigate(-1)}>
                    {t('auth.backToCode', 'Go back')}
                </button>
            </div>

            <UserContainer
                initialData={userData}
                role={role}
                mode="view"
                onSave={handleSave}
            />
        </div>
    );
};
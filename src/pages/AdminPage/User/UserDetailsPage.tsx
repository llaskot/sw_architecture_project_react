import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserById, updateUser } from '../../../api/userApi';
import { UserContainer } from '../../../elements/user/UserContainer/UserContainer';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import Button from '../../../elements/button/Button'; // Импортируем Button для единообразия
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
        return <div className="user-details-loading" style={{ textAlign: 'center', padding: '50px' }}>{t('rent.submittingBtn', 'Processing...')}</div>;
    }

    return (
        <div className="admin-rent-details-container">
            <div className="admin-rent-header">
                <h2>{t('profile.title', 'User Profile')} {userData && userData._id ? `#${userData._id}` : ''}</h2>
                <div>
                    <Button
                        onClick={() => navigate(-1)}
                        type="button"
                        className="btn-nav"
                    >
                        {t('common.back', 'Back')}
                    </Button>
                </div>
            </div>

            <RentErrorBlock message={error} />

            {userData ? (
                <UserContainer
                    initialData={userData}
                    role={role}
                    mode="view"
                    onSave={handleSave}
                />
            ) : (
                <div className="user-details-page">
                    <RentErrorBlock message={t('carDetail.notFound', 'Not found')} />
                </div>
            )}
        </div>
    );
};
import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useTranslation } from 'react-i18next';

interface UserProfile {
    _id: string;
    email: string;
    login: string;
    first_name: string;
    last_name: string;
    active: boolean;
    is_admin: boolean;
    is_manager: boolean;
}

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiClient('/users/profile');
                setProfile(data);
                setFormData(data);
            } catch (err: any) {
                setError(err.detail || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const getRoles = (p: UserProfile) => {
        const roles = [];
        if (p.is_admin) roles.push('Admin');
        if (p.is_manager) roles.push('Manager');
        if (roles.length === 0) roles.push('User');
        return roles.join(', ');
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            // Здесь будет запрос PUT, когда подготовим
            setProfile({ ...profile, ...formData } as UserProfile);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.detail || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!profile) return null;

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{t('profile.title')}</h2>

            <p><strong>ID:</strong> {profile._id}</p>
            <p><strong>{t('profile.role')}:</strong> {getRoles(profile)}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Email */}
                <label style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', marginBottom: '5px' }}>{t('profile.email')}</span>
                    <input
                        type="email"
                        disabled={!isEditing}
                        value={formData.email || ''}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>

                {/* Login */}
                <label style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', marginBottom: '5px' }}>{t('profile.login')}</span>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.login || ''}
                        onChange={e => setFormData({...formData, login: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>

                {/* First Name */}
                <label style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', marginBottom: '5px' }}>{t('profile.first_name')}</span>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.first_name || ''}
                        onChange={e => setFormData({...formData, first_name: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>

                {/* Last Name */}
                <label style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', marginBottom: '5px' }}>{t('profile.last_name')}</span>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.last_name || ''}
                        onChange={e => setFormData({...formData, last_name: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>
            </div>

            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '10px 20px', cursor: 'pointer' }}
                    >
                        {t('profile.edit')}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            {t('profile.save')}
                        </button>
                        <button
                            onClick={() => { setIsEditing(false); setFormData(profile); }}
                            style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            {t('profile.cancel')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
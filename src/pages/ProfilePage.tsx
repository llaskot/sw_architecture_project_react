


import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {userApi} from "../api/userApi.ts";
import './ProfilePage.css';

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
                const data = await userApi.getProfile();
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
            setError(''); // Reset old error before request

            const cleanData = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value !== '')
            );

            const updatedProfile = await userApi.updateProfile(cleanData);
            setProfile(updatedProfile);
            setFormData(updatedProfile);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.detail || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;
    if (!profile) return null;

    return (
        <div className="profile-card">
            <h2 className="profile-title">{t('profile.title')}</h2>

            <p><strong>ID:</strong> {profile._id}</p>
            <p><strong>{t('profile.role')}:</strong> {getRoles(profile)}</p>

            <div className="profile-fields-container">
                {/* Email */}
                <label className="profile-label">
                    <span className="profile-label-text">{t('profile.email')}</span>
                    <input
                        type="email"
                        disabled={!isEditing}
                        value={formData.email || ''}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="profile-input"
                    />
                </label>

                {/* Login */}
                <label className="profile-label">
                    <span className="profile-label-text">{t('profile.login')}</span>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.login || ''}
                        onChange={e => setFormData({...formData, login: e.target.value})}
                        className="profile-input"
                    />
                </label>

                {/* First Name */}
                <label className="profile-label">
                    <span className="profile-label-text">{t('profile.first_name')}</span>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.first_name || ''}
                        onChange={e => setFormData({...formData, first_name: e.target.value})}
                        className="profile-input"
                    />
                </label>

                {/* Last Name */}
                <label className="profile-label">
                    <span className="profile-label-text">{t('profile.last_name')}</span>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.last_name || ''}
                        onChange={e => setFormData({...formData, last_name: e.target.value})}
                        className="profile-input"
                    />
                </label>
            </div>

            <div className="profile-actions">
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="profile-btn-edit"
                    >
                        {t('profile.edit')}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            className="profile-btn-save"
                        >
                            {t('profile.save')}
                        </button>
                        <button
                            onClick={() => { setIsEditing(false); setFormData(profile); }}
                            className="profile-btn-cancel"
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
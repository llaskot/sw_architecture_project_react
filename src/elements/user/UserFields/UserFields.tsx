import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../input/Input';
import './UserFields.css';
import PasswordInput from "../../input/PasswordInput.tsx";

interface UserFieldsData {
    email: string;
    login?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    active?: boolean | null;
    is_admin?: boolean | null;
    is_manager?: boolean | null;
    password?: string;
}

interface UserFieldsProps {
    data: Partial<UserFieldsData>;
    onChange: (field: keyof UserFieldsData, value: any) => void;
    disabled?: boolean;
    showPassword?: boolean;
}

export const UserFields: React.FC<UserFieldsProps> = ({ data, onChange, disabled, showPassword }) => {
    const { t } = useTranslation();

    return (
        <div className="user-fields">
            <div className="admin-field-row">
                <label className="admin-field-label">{t('profile.first_name', 'First Name')}</label>
                <div className="admin-field-value">
                    <Input value={data.first_name || ''} onChange={(e) => onChange('first_name', e.target.value)} disabled={disabled} />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('profile.last_name', 'Last Name')}</label>
                <div className="admin-field-value">
                    <Input value={data.last_name || ''} onChange={(e) => onChange('last_name', e.target.value)} disabled={disabled} />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('profile.email', 'Email')}</label>
                <div className="admin-field-value">
                    <Input type="email" value={data.email || ''} onChange={(e) => onChange('email', e.target.value)} disabled={disabled} />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('profile.login', 'Login')}</label>
                <div className="admin-field-value">
                    <Input value={data.login || ''} onChange={(e) => onChange('login', e.target.value)} disabled={disabled} />
                </div>
            </div>

            {showPassword && (
                <div className="admin-field-row">
                    <label className="admin-field-label">{t('auth.passwordLabel', 'Password')}</label>
                    <div className="admin-field-value">
                        <PasswordInput type="password" value={data.password || ''} onChange={(e) => onChange('password', e.target.value)} disabled={disabled} />
                    </div>
                </div>
            )}

            <div className="admin-field-row">
                <label className="admin-field-label">{t('profile.roles', 'Roles & Status')}</label>
                <div className="admin-field-value user-checkbox-group">
                    <label className="user-checkbox-label">
                        <input type="checkbox" checked={!!data.active} onChange={(e) => onChange('active', e.target.checked)} disabled={disabled} />
                        <span>{t('profile.statusActive', 'Active')}</span>
                    </label>
                    <label className="user-checkbox-label">
                        <input type="checkbox" checked={!!data.is_admin} onChange={(e) => onChange('is_admin', e.target.checked)} disabled={disabled} />
                        <span>{t('profile.roleAdmin', 'Admin')}</span>
                    </label>
                    <label className="user-checkbox-label">
                        <input type="checkbox" checked={!!data.is_manager} onChange={(e) => onChange('is_manager', e.target.checked)} disabled={disabled} />
                        <span>{t('profile.roleManager', 'Manager')}</span>
                    </label>
                </div>
            </div>
        </div>
    );
};
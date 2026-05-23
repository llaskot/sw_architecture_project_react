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

export const UserFields: React.FC<UserFieldsProps> = ({
                                                          data,
                                                          onChange,
                                                          disabled,
                                                          showPassword
                                                      }) => {
    const { t } = useTranslation();

    return (
        <div className="user-fields">
            <Input
                label={t('profile.first_name', 'First Name')}
                value={data.first_name || ''}
                onChange={(e) => onChange('first_name', e.target.value)}
                disabled={disabled}
            />

            <Input
                label={t('profile.last_name', 'Last Name')}
                value={data.last_name || ''}
                onChange={(e) => onChange('last_name', e.target.value)}
                disabled={disabled}
            />

            <Input
                label={t('profile.email', 'Email')}
                type="email"
                value={data.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                disabled={disabled}
            />

            <Input
                label={t('profile.login', 'Login')}
                value={data.login || ''}
                onChange={(e) => onChange('login', e.target.value)}
                disabled={disabled}
            />

            {showPassword && (
                <PasswordInput
                    label={t('auth.passwordLabel', 'Password')}
                    type="password"
                    value={data.password || ''}
                    onChange={(e) => onChange('password', e.target.value)}
                    disabled={disabled}
                />
            )}

            <div className="user-checkbox-group">
                <label className="user-checkbox-label">
                    <input
                        type="checkbox"
                        checked={!!data.active}
                        onChange={(e) => onChange('active', e.target.checked)}
                        disabled={disabled}
                    />
                    <span>{t('profile.statusActive', 'Active')}</span>
                </label>

                <label className="user-checkbox-label">
                    <input
                        type="checkbox"
                        checked={!!data.is_admin}
                        onChange={(e) => onChange('is_admin', e.target.checked)}
                        disabled={disabled}
                    />
                    <span>{t('profile.roleAdmin', 'Admin')}</span>
                </label>

                <label className="user-checkbox-label">
                    <input
                        type="checkbox"
                        checked={!!data.is_manager}
                        onChange={(e) => onChange('is_manager', e.target.checked)}
                        disabled={disabled}
                    />
                    <span>{t('profile.roleManager', 'Manager')}</span>
                </label>
            </div>
        </div>
    );
};
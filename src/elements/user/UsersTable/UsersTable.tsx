import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable, { type Column } from '../../DataTable/DataTable';
import Button from '../../button/Button';
import './UsersTable.css';

// Описываем структуру пользователя (поля из ответа API)
export interface UserTableItem {
    _id?: string;
    id?: string;
    email: string;
    login?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    active?: boolean | null;
    is_admin?: boolean | null;
    is_manager?: boolean | null;
}

interface UsersTableProps {
    users: UserTableItem[];
    loading: boolean;
    role: 'admin' | 'manager';
    onDeleteClick: (id: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
                                                          users,
                                                          loading,
                                                          role,
                                                          onDeleteClick
                                                      }) => {
    const { t } = useTranslation();

    const columns: Column<UserTableItem>[] = [
        {
            key: 'id',
            header: t('admin.table.id', 'ID'),
            render: (item) => {
                const itemId = item._id || item.id || '';
                return (
                    <div title={itemId} className="users-table-id">
                        {itemId.substring(0, 8)}...
                    </div>
                );
            }
        },
        {
            key: 'email',
            header: t('profile.email', 'Email'),
            render: (item) => item.email
        },
        {
            key: 'login',
            header: t('profile.login', 'Login'),
            render: (item) => item.login || '-'
        },
        {
            key: 'first_name',
            header: t('profile.first_name', 'First Name'),
            render: (item) => item.first_name || '-'
        },
        {
            key: 'last_name',
            header: t('profile.last_name', 'Last Name'),
            render: (item) => item.last_name || '-'
        },
        {
            key: 'active',
            header: t('profile.statusActive', 'Active'),
            render: (item) => (
                <div className={`users-bool-cell ${item.active ? 'bool-true' : 'bool-false'}`}>
                    {item.active ? '✓' : '✗'}
                </div>
            )
        },
        {
            key: 'is_admin',
            header: t('profile.roleAdmin', 'Admin'),
            render: (item) => (
                <div className={`users-bool-cell ${item.is_admin ? 'bool-true' : 'bool-false'}`}>
                    {item.is_admin ? '✓' : '✗'}
                </div>
            )
        },
        {
            key: 'is_manager',
            header: t('profile.roleManager', 'Manager'),
            render: (item) => (
                <div className={`users-bool-cell ${item.is_manager ? 'bool-true' : 'bool-false'}`}>
                    {item.is_manager ? '✓' : '✗'}
                </div>
            )
        },
        {
            key: 'actions',
            header: t('rent.table.actions', 'Actions'),
            render: (item) => {
                const itemId = item._id || item.id || '';
                return (
                    <div className="users-table-actions">
                        <Link
                            to={`/${role}/users/${itemId}`}
                            className="btn-small users-btn-show"
                        >
                            {t('carCard.Show', 'Show')}
                        </Link>

                        {role === 'admin' && (
                            <Button
                                type="button"
                                className="btn-small users-btn-delete"
                                onClick={() => onDeleteClick(itemId)}
                            >
                                {t('rent.actions.delete', 'Delete')}
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable
            data={users}
            columns={columns}
            loading={loading}
            emptyMessage={t('rent.table.empty', 'No records found')}
        />
    );
};
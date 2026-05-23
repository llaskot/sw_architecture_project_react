import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsers, type UserResponseAdm } from '../../../api/userApi';
import { UsersTable } from '../../../elements/user/UsersTable/UsersTable';
import { SectionNavigation } from '../../../elements/navigation/SectionNavigation/SectionNavigation';
import Pagination from '../../../elements/Pagination/Pagination';
import Input from '../../../elements/input/Input';
import './UsersListPage.css';
import {CreateActionButton} from "../../../elements/button/CreateActionButton/CreateActionButton.tsx";

interface UsersListPageProps {
    role?: 'admin' | 'manager';
}

export const UsersListPage: React.FC<UsersListPageProps> = ({ role = 'admin' }) => {
    const { t } = useTranslation();

    const [users, setUsers] = useState<UserResponseAdm[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [hideInactive, setHideInactive] = useState<boolean>(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllUsers({
                page,
                limit,
                search: search || null,
                hide_inactive: role === 'admin' ? hideInactive : null,
            });
            setUsers(response.items);
            setTotalPages(Math.ceil(response.total / limit));
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, hideInactive, role]);

    // Загрузка данных при изменении страницы или фильтра неактивных
    useEffect(() => {
        fetchUsers();
    }, [page, hideInactive, role, fetchUsers]);

    // Дебаунс для инпута поиска
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (page === 1) {
                fetchUsers();
            } else {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleDeleteStub = (id: string) => {
        alert(`Delete user ID: ${id}`);
    };

    return (
        <div className="users-list-page-container">
            <div className="users-list-page-header">
                <h2>{t('usersList.title', 'Users Management')}</h2>
                <SectionNavigation role={role} />
            </div>

            <div className="users-list-page-filters">
                <div className="users-list-search-wrapper">
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('home.searchPlaceholder', 'Search...')}
                    />
                </div>

                {role === 'admin' && (
                    <div className="users-list-checkbox-wrapper">
                        <label className="users-list-checkbox-label">
                            <input
                                type="checkbox"
                                checked={hideInactive}
                                onChange={(e) => setHideInactive(e.target.checked)}
                            />
                            {t('admin.filters.hideInactive', 'Hide Inactive')}
                        </label>
                        <CreateActionButton navigateTo="/admin/users/create" />
                    </div>
                )}
            </div>

            <UsersTable
                users={users}
                loading={loading}
                role={role}
                onDeleteClick={handleDeleteStub}
            />

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};
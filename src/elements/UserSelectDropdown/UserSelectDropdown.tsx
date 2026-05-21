import React, { useState, useEffect, useRef } from 'react';
import { getAllUsers, type UserResponseAdm } from '../../api/userApi';
import './UserSelectDropdown.css';

interface UserSelectDropdownProps {
    selectedUserId: string | null;
    onUserChange: (userId: string | null) => void;
    label?: string;
}

const UserSelectDropdown: React.FC<UserSelectDropdownProps> = ({
                                                                   selectedUserId,
                                                                   onUserChange,
                                                                   label
                                                               }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [users, setUsers] = useState<UserResponseAdm[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedUserName, setSelectedUserName] = useState<string>('');

    const containerRef = useRef<HTMLDivElement>(null);
    const limit = 50;

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset list and pagination when search query changes
    useEffect(() => {
        setPage(1);
        setUsers([]);
        setHasMore(true);
    }, [searchQuery]);

    // Fetch users with pagination and search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await getAllUsers({
                    page,
                    limit,
                    search: searchQuery || null
                });

                const fetchedItems = response.items || [];

                setUsers(prev => {
                    if (page === 1) return fetchedItems;
                    // Prevent duplicates just in case
                    const existingIds = new Set(prev.map(u => u._id));
                    const uniqueNewItems = fetchedItems.filter(item => !existingIds.has(item._id));
                    return [...prev, ...uniqueNewItems];
                });

                // Check if there are more items to load
                setHasMore(users.length + fetchedItems.length < response.total);

                // Update selected user display text if matches
                if (selectedUserId) {
                    const current = fetchedItems.find(u => u._id === selectedUserId);
                    if (current) {
                        const name = current.first_name && current.last_name
                            ? `${current.first_name} ${current.last_name}`
                            : current.email;
                        setSelectedUserName(name);
                    }
                } else if (page === 1 && !searchQuery) {
                    setSelectedUserName('');
                }
            } catch (error) {
                console.error('Failed to fetch users for dropdown:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, page]);

    // Track when user selected from code but name is not yet updated
    useEffect(() => {
        if (!selectedUserId) {
            setSelectedUserName('');
        }
    }, [selectedUserId]);

    const handleSelectUser = (user: UserResponseAdm | null) => {
        if (!user) {
            setSelectedUserName('');
            onUserChange(null);
        } else {
            const name = user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.email;
            setSelectedUserName(name);
            onUserChange(user._id);
        }
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

        if (isBottom && !loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="user-select-dropdown" ref={containerRef}>
            {label && <label className="user-select-dropdown__label">{label}</label>}

            <div
                className={`user-select-dropdown__trigger ${isOpen ? 'user-select-dropdown__trigger--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="user-select-dropdown__display">
                    {selectedUserName || 'Select a user...'}
                </span>
                <span className="user-select-dropdown__arrow">▼</span>
            </div>

            {isOpen && (
                <div className="user-select-dropdown__menu">
                    <input
                        type="text"
                        className="user-select-dropdown__search"
                        placeholder="Type to filter users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />

                    <div className="user-select-dropdown__options" onScroll={handleScroll}>
                        {/* Static All option */}
                        <div
                            className={`user-select-dropdown__option ${!selectedUserId ? 'user-select-dropdown__option--selected' : ''}`}
                            onClick={() => handleSelectUser(null)}
                        >
                            <span className="user-select-dropdown__option-name" style={{ fontWeight: 'bold' }}>
                                All Users
                            </span>
                        </div>

                        {users.map((user) => (
                            <div
                                key={user._id}
                                className={`user-select-dropdown__option ${user._id === selectedUserId ? 'user-select-dropdown__option--selected' : ''}`}
                                onClick={() => handleSelectUser(user)}
                            >
                                <span className="user-select-dropdown__option-name">
                                    {user.first_name || user.last_name
                                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                        : 'No Name'}
                                </span>
                                <span className="user-select-dropdown__option-email">
                                    {user.email}
                                </span>
                            </div>
                        ))}

                        {loading && page === 1 && (
                            <div className="user-select-dropdown__loading">Loading users...</div>
                        )}

                        {!loading && users.length === 0 && searchQuery && (
                            <div className="user-select-dropdown__empty">No users found</div>
                        )}

                        {loading && page > 1 && (
                            <div className="user-select-dropdown__scroll-loading">Loading more...</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSelectDropdown;
import React, {useEffect, useState} from 'react';
import {getAllAdminRents, type GetAdminRentsParams, getRentStages} from '../../api/rentApi';
import DataTable from '../../elements/DataTable/DataTable';
import Pagination from '../../elements/Pagination/Pagination';
import RentFilters from '../../elements/rent/RentFilters/RentFilters';
import CarSelectDropdown from '../../elements/rent/CarSelectDropdown/CarSelectDropdown';
import './AdminPage.css';
import UserSelectDropdown from "../../elements/UserSelectDropdown/UserSelectDropdown.tsx";

const AdminPage: React.FC = () => {
    const [rents, setRents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [availableStages, setAvailableStages] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [sortDate, setSortDate] = useState<'asc' | 'desc' | 'none'>('none');
    const [hideInactive, setHideInactive] = useState<boolean>(false);

    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);


    useEffect(() => {
        const fetchStages = async () => {
            try {
                const stages = await getRentStages();
                setAvailableStages(stages);
            } catch (error) {
                console.error('Failed to load rent stages', error);
            }
        };
        fetchStages();
    }, []);

    useEffect(() => {
        const fetchRents = async () => {
            setLoading(true);
            try {
                const params: GetAdminRentsParams = {
                    page,
                    limit,
                    stage: selectedStages.length > 0 ? selectedStages : null,
                    sort_date: sortDate,
                    hide_inactive: hideInactive,
                    car_id: selectedCarId,
                    client_id: selectedUserId,
                };

                const data = await getAllAdminRents(params);
                setRents(data.items);
                setTotalPages(Math.ceil(data.total / limit));
            } catch (error) {
                console.error('Failed to fetch admin rents', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRents();
    }, [page, limit, selectedStages, sortDate, hideInactive, selectedCarId, selectedUserId]);

    const handleAction = (action: string, id: number) => {
        alert(`Action: ${action} for rent ID: ${id}`);
    };

    const columns = [
        {
            key: 'client',
            header: 'Client',
            render: (item: any) => (
                <span className="admin-clickable-stub" onClick={() => alert(`Client ${item.client?.id}`)}>
                    {item.client?.first_name} {item.client?.last_name}
                </span>
            )
        },
        {key: 'user_dock', header: 'User Dock'},
        {
            key: 'car_model',
            header: 'Model',
            render: (item: any) => item.car?.model?.name
        },
        {
            key: 'plate_number',
            header: 'Plate Number',
            render: (item: any) => (
                <span className="admin-clickable-stub" onClick={() => alert(`Car ${item.car?.id}`)}>
                    {item.car?.plate_number}
                </span>
            )
        },
        {
            key: 'price_per_day',
            header: 'Price / Day',
            render: (item: any) => `$${item.car?.price_per_day}`
        },
        {
            key: 'total_price',
            header: 'Total',
            render: (item: any) => `$${item.total_price}`
        },
        {key: 'start_date', header: 'Start Date'},
        {key: 'end_date', header: 'End Date'},
        {
            key: 'comment',
            header: 'Comment',
            render: (item: any) => (
                <div className="admin-truncate-text" title={item.comment || ''}>
                    {item.comment || '-'}
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="admin-actions-group">
                    <button className="admin-btn update" onClick={() => handleAction('Update', item.id)}>Update</button>
                    <button className="admin-btn stage" onClick={() => handleAction('Change Stage', item.id)}>Stage
                    </button>
                    <button className="admin-btn delete" onClick={() => handleAction('Delete', item.id)}>Delete</button>
                </div>
            )
        }
    ];

    return (
        <div className="admin-page-container">
            <div className="admin-page-content">
                <h2>Admin Dashboard - All Rents</h2>

                <div className="admin-filters-panel">
                    <div className="admin-filter-item admin-filter-item--stages">
                        <label className="admin-filter-label">Stages & Sort</label>
                        <RentFilters
                            availableStages={availableStages}
                            selectedStages={selectedStages}
                            onStagesChange={setSelectedStages}
                            sortDate={sortDate}
                            onSortDateChange={setSortDate}
                        />
                    </div>

                    <div className="admin-filter-item admin-filter-item--fluid">
                        <label className="admin-filter-label">Vehicle</label>
                        <CarSelectDropdown
                            selectedCarId={selectedCarId}
                            onCarChange={(id) => {
                                setSelectedCarId(id || null);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="admin-filter-item admin-filter-item--fluid">
                        <label className="admin-filter-label">Client</label>
                        <UserSelectDropdown
                            selectedUserId={selectedUserId}
                            onUserChange={(id) => {
                                setSelectedUserId(id);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="admin-filter-item admin-filter-item--checkbox">
                        <label className="admin-checkbox-filter">
                            <input
                                type="checkbox"
                                checked={hideInactive}
                                onChange={(e) => {
                                    setHideInactive(e.target.checked);
                                    setPage(1);
                                }}
                            />
                            Hide Inactive
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">Loading rents...</div>
                ) : (
                    <>
                        <DataTable columns={columns} data={rents}/>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
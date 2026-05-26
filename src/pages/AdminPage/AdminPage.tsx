import React, {useEffect, useState} from 'react';
import {getAllAdminRents, type GetAdminRentsParams, getRentStages, deleteRent} from '../../api/rentApi';
import DataTable from '../../elements/DataTable/DataTable';
import Pagination from '../../elements/Pagination/Pagination';
import RentFilters from '../../elements/rent/RentFilters/RentFilters';
import CarSelectDropdown from '../../elements/rent/CarSelectDropdown/CarSelectDropdown';
import {useTranslation} from 'react-i18next';
import './AdminPage.css';
import UserSelectDropdown from "../../elements/UserSelectDropdown/UserSelectDropdown.tsx";
import ChangeStageModal from "../../elements/rent/ChangeStageModal/ChangeStageModal.tsx";
import DeleteModal from "../../elements/modal/DeleteModal.tsx";
import {Link} from "react-router-dom";
import {SectionNavigation} from "../../elements/navigation/SectionNavigation/SectionNavigation.tsx";


export interface AdminProps {
    role: 'admin' | 'manager';
}

const AdminPage: React.FC<AdminProps> = ({role}) => {
    const {t} = useTranslation();
    const [rents, setRents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [availableStages, setAvailableStages] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [sortDate, setSortDate] = useState<'asc' | 'desc' | 'none'>('none');
    const [hideInactive, setHideInactive] = useState<boolean>(true);

    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [isStageModalOpen, setIsStageModalOpen] = useState<boolean>(false);
    const [selectedRentIdForStage, setSelectedRentIdForStage] = useState<string | number | null>(null);
    const [rentToDelete, setRentToDelete] = useState<string | number | null>(null);


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
    console.log(role);
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
    }, [page, limit, selectedStages, sortDate, hideInactive, selectedCarId, selectedUserId, refreshTrigger]);


    const columns = [
        {
            key: 'id',
            header: t('admin.table.id', 'ID'),
            render: (item: any) => (
                <div
                    className="admin-id-cell"
                    title={String(item._id)}
                >
                    <Link
                        to={`/admin/rents/${item._id || item.id}`}
                        className="admin-clickable-stub"
                        style={{color: '#0ea5e9', textDecoration: 'none', fontWeight: '500'}}
                    >
                        #{item._id}
                    </Link>
                </div>
            )
        },
        {
            key: 'stage',
            header: t('admin.table.stage', 'Stage'),
            render: (item: any) => (
                <span>
                    {item.stage || '-'}
                </span>
            )
        },
        {
            key: 'client',
            header: t('admin.table.client', 'Client'),
            render: (item: any) => {
                const clientId = item.client?._id || item.client?.id;
                return clientId ? (
                    <Link
                        to={`/${role}/users/${clientId}`}
                        className="admin-clickable-stub"
                        style={{color: '#0ea5e9', textDecoration: 'none', fontWeight: '500'}}
                    >
                        {item.client?.first_name} {item.client?.last_name}
                    </Link>
                ) : (
                    <span>-</span>
                );
            }
        },
        {key: 'user_dock', header: t('admin.table.userDock', 'User Dock')},
        {
            key: 'car_model',
            header: t('admin.table.model', 'Model'),
            render: (item: any) => item.car?.model?.name
        },
        {
            key: 'plate_number',
            header: t('admin.table.plateNumber', 'Plate Number'),
            render: (item: any) => {
                const carId = item.car?._id || item.car?.id;
                return carId ? (
                    <Link
                        to={`/${role}/cars/${carId}`}
                        className="admin-clickable-stub"
                        style={{color: '#0ea5e9', textDecoration: 'none', fontWeight: '500'}}
                    >
                        {item.car?.plate_number}
                    </Link>
                ) : (
                    <span>-</span>
                );
            }

        },
        {
            key: 'price_per_day',
            header: t('admin.table.pricePerDay', 'Price / Day'),
            render: (item: any) => `$${item.car?.price_per_day}`
        },
        {
            key: 'total_price',
            header: t('admin.table.totalPrice', 'Total'),
            render: (item: any) => `$${item.total_price}`
        },
        {key: 'start_date', header: t('admin.table.startDate', 'Start Date')},
        {key: 'end_date', header: t('admin.table.endDate', 'End Date')},
        {
            key: 'comment',
            header: t('admin.table.comment', 'Comment'),
            render: (item: any) => (
                <div className="admin-truncate-text" title={item.comment || ''}>
                    {item.comment || '-'}
                </div>
            )
        },
        {
            key: 'actions',
            header: t('admin.table.actions', 'Actions'),
            render: (item: any) => (
                <div className="admin-actions-group">
                    <button className="admin-btn stage" onClick={() => {
                        setSelectedRentIdForStage(item._id || item.id);
                        setIsStageModalOpen(true);
                    }}>
                        {t('admin.table.stageBtn', 'Stage')}
                    </button>
                    {(role === 'admin' || ["booked", "ordered"].includes(item.stage ?? "")) && <button
                        className="admin-btn delete"
                        onClick={() => setRentToDelete(item._id || item.id)}
                    >
                        {t('rent.actions.delete', 'Delete')}
                    </button>}
                </div>
            )
        }
    ];

    return (
        <div className="admin-page-container">
            <div className="admin-page-content">
                <div className='page-name'><h2>{t('admin.pageTitle')}</h2>
                    <SectionNavigation role={role}/></div>
                <div className="admin-filters-panel">
                    {/* Render inputs directly, they already contain internal labels */}
                    <RentFilters
                        availableStages={availableStages}
                        selectedStages={selectedStages}
                        onStagesChange={setSelectedStages}
                        sortDate={sortDate}
                        onSortDateChange={setSortDate}
                    />

                    <div className="admin-filter-item admin-filter-item--fluid">
                        <label className="admin-filter-label">
                            {t('admin.filters.vehicle')}
                        </label>
                        <CarSelectDropdown
                            selectedCarId={selectedCarId}
                            onCarChange={(id) => {
                                setSelectedCarId(id || null);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="admin-filter-item admin-filter-item--fluid">
                        <label className="admin-filter-label">{t('admin.filters.client')}</label>
                        <UserSelectDropdown
                            selectedUserId={selectedUserId}
                            onUserChange={(id) => {
                                setSelectedUserId(id);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="admin-filter-item admin-filter-item--clear">
                        <button
                            type="button"
                            className="admin-clear-filters"
                            title="Clear all filters"
                            onClick={() => {
                                setSelectedStages([]);
                                setSortDate('none');
                                setSelectedCarId('');
                                setSelectedUserId('');
                                setPage(1);
                            }}
                        >
                            &times;
                        </button>
                    </div>

                    {role == "admin" && <div className="admin-filter-item admin-filter-item--checkbox">
                        <label className="admin-checkbox-filter">
                            <input
                                type="checkbox"
                                checked={hideInactive}
                                onChange={(e) => {
                                    setHideInactive(e.target.checked);
                                    setPage(1);
                                }}
                            />
                            {t('admin.filters.hideInactive')}
                        </label>
                    </div>}
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
            {isStageModalOpen && selectedRentIdForStage !== null && (
                <ChangeStageModal
                    rentId={selectedRentIdForStage}
                    isOpen={isStageModalOpen}
                    onClose={() => {
                        setIsStageModalOpen(false);
                        setSelectedRentIdForStage(null);
                    }}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                />
            )}
            <DeleteModal
                id={rentToDelete || ''}
                isOpen={rentToDelete !== null}
                title={t('rent.delete.title')}
                message={t('rent.delete.text')}
                confirmBtnText={t('rent.delete.confirmBtn')}
                errorText={t('rent.delete.error')}
                onDeleteApi={deleteRent}
                onClose={() => setRentToDelete(null)}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />
        </div>
    );
};

export default AdminPage;




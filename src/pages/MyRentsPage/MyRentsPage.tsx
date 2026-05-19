import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {deleteRent, getAllRents, getRentStages, type RentRead} from '../../api/rentApi';
import DataTable, { type Column } from '../../elements/DataTable/DataTable';
import Pagination from '../../elements/Pagination/Pagination';
import RentFilters from '../../elements/rent/RentFilters/RentFilters';
import RentRowActions from '../../elements/rent/RentRowActions/RentRowActions';
import './MyRentsPage.css';
import {useNavigate} from "react-router-dom";
import Modal from "../../elements/modal/Modal.tsx";
import Button from "../../elements/button/Button.tsx";


const MyRentsPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Filter and sorting states
    const [availableStages, setAvailableStages] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [sortDate, setSortDate] = useState<'asc' | 'desc' | 'none'>('desc');

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const limit = 3;

// Data and loading states
    const [rents, setRents] = useState<RentRead[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Modal and delete states
    const [rentToDelete, setRentToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    // Fetch available rental stages dynamically on mount
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const stagesData = await getRentStages();
                setAvailableStages(stagesData);
            } catch (error) {
                console.error('Failed to load rental stages:', error);
            }
        };
        fetchStages();
    }, []);

    // Fetch filtered and paginated rentals list whenever filters or page changes
    useEffect(() => {
        const fetchRents = async () => {
            setLoading(true);
            try {
                const response = await getAllRents({
                    stage: selectedStages.length > 0 ? selectedStages : null,
                    sort_date: sortDate,
                    page: currentPage,
                    limit,
                });
                setRents(response.items || []);
                setTotalItems(response.total || 0);
            } catch (error) {
                console.error('Failed to fetch rentals:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRents();
    }, [selectedStages, sortDate, currentPage, refreshTrigger]);

    const handleDeleteConfirm = async () => {
        if (!rentToDelete) return;
        setIsDeleting(true);
        try {
            await deleteRent(rentToDelete);
            setRentToDelete(null);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to delete rental:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Reset page to 1 when filters or sorting change
    const handleStagesChange = (stages: string[]) => {
        setSelectedStages(stages);
        setCurrentPage(1);
    };

    const handleSortDateChange = (sort: 'asc' | 'desc' | 'none') => {
        setSortDate(sort);
        setCurrentPage(1);
    };

    const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);

    // Configuration of data columns for the general purpose DataTable component
    const columns = useMemo<Column<RentRead>[]>(() => [
        {
            key: 'model',
            header: t('rent.table.model', 'Model'),
            render: (rent) =>  (<span className={"my-rents-page__cell"}> { rent?.car?.model?.name } </span> )
        },
        {
            key: 'plate_number',
            header: t('rent.table.plateNumber', 'Plate Number'),
            render: (rent) => (<span className={"my-rents-page__cell"}> { rent.car?.plate_number } </span> )
        },
        {
            key: 'start_date',
            header: t('rent.table.startDate', 'Start Date'),
            render: (rent) => (<span className={"my-rents-page__cell"}>{new Date(rent.start_date).toLocaleString()} </span> )
        },
        {
            key: 'stage',
            header: t('rent.table.stage', 'Stage'),
            render: (rent) => (<span className={"my-rents-page__cell"}> {rent.stage} </span> )
        },

        {
            key: 'end_date',
            header: t('rent.table.endDate', 'End Date'),
            render: (rent) => (<span className={"my-rents-page__cell"}> { new Date(rent.end_date).toLocaleString() } </span> )
        },
        {
            key: 'total_price',
            header: t('rent.table.totalPrice', 'Total Price'),
            render: (rent) => (<span className={"my-rents-page__cell"}> {`$${rent.total_price}`} </span> )
        },
        {
            key: 'driver',
            header: t('rent.table.driver', 'driver'),
            render: (rent) => (<span className={"my-rents-page__cell"}> {rent.driver ? '✓' : '×'} </span> )
        },
        {
            key: 'actions',
            header: t('rent.table.actions', 'Actions'),
            render: (rent) => (
                <RentRowActions
                    stage={rent.stage}
                    onUpdate={() => navigate(`/edit-rent/${rent._id}`)}
                    onDelete={() => rent._id && setRentToDelete(rent._id)}
                    onPay={() => alert(`Payment flow placeholder for rent ID: ${rent._id}`)}
                />
            )
        }

    ], [t]);

    return (
        <div className="my-rents-page">
            <h1 className="my-rents-page__title">{t('rent.page.title', 'My Rentals')}</h1>

            {/* Filter and sorting pane */}
            <RentFilters
                availableStages={availableStages}
                selectedStages={selectedStages}
                onStagesChange={handleStagesChange}
                sortDate={sortDate}
                onSortDateChange={handleSortDateChange}
            />

            {/* Reusable presentations layer data table */}
            <DataTable
                data={rents}
                columns={columns}
                loading={loading}
                emptyMessage={t('rent.table.empty', 'No rental bookings found matching your criteria.')}
            />

            {/* Pagination controller */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                disabled={loading}
            />
            {rentToDelete && (
                <Modal onClose={() => !isDeleting && setRentToDelete(null)}>
                    <div className="my-rents-page__modal">
                        <h2>{t('rent.delete.title', 'Підтвердження видалення')}</h2>
                        <p>{t('rent.delete.text', 'Ви впевнені, що хочете видалити це замовлення? Цю дію неможливо скасувати.')}</p>
                        <div className="my-rents-page__modal-actions">
                            <Button onClick={() => setRentToDelete(null)} disabled={isDeleting}>
                                {t('profile.cancel', 'Скасувати')}
                            </Button>
                            <Button onClick={handleDeleteConfirm} disabled={isDeleting}>
                                {isDeleting ? t('rent.deleting', 'Видалення...') : t('rent.delete.confirmBtn', 'Так, видалити')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyRentsPage;
import React from 'react';
import { useTranslation } from 'react-i18next';
import './RentRowActions.css';

interface RentRowActionsProps {
    stage: string;
    onUpdate: () => void;
    onDelete: () => void;
    onPay: () => void;
}

const RentRowActions: React.FC<RentRowActionsProps> = ({
                                                           stage,
                                                           onUpdate,
                                                           onDelete,
                                                           onPay,
                                                       }) => {
    const { t } = useTranslation();

    // Contextual button availability mapping based on the current stage
    const isOrdered = stage === 'ordered';
    const isBooked = stage === 'booked';

    return (
        <div className="rent-row-actions">
            <button
                type="button"
                onClick={onUpdate}
                disabled={!isOrdered}
                className="rent-row-actions__btn rent-row-actions__btn--update"
            >
                {t('rent.actions.update', 'Update')}
            </button>

            <button
                type="button"
                onClick={onDelete}
                disabled={!isOrdered}
                className="rent-row-actions__btn rent-row-actions__btn--delete"
            >
                {t('rent.actions.delete', 'Delete')}
            </button>

            <button
                type="button"
                onClick={onPay}
                disabled={!isBooked}
                className="rent-row-actions__btn rent-row-actions__btn--pay"
            >
                {t('rent.actions.pay', 'Pay')}
            </button>
        </div>
    );
};

export default RentRowActions;
import React from 'react';
// import { useTranslation } from 'react-i18next';
import './RentRowActions.css';
import Button from "../../button/Button.tsx";

interface RentRowActionsProps {
    stage: string;
    onUpdate: () => void;
    onDelete: () => void;
    onPay: () => void;
    onCheck: () => void;
}

const RentRowActions: React.FC<RentRowActionsProps> = ({
                                                           stage,
                                                           onUpdate,
                                                           onDelete,
                                                           onPay,
                                                           onCheck
                                                       }) => {
    // const { t } = useTranslation();

    // Contextual button availability mapping based on the current stage
    const isOrdered = stage === 'ordered';
    const canDelete = !['ordered', 'booked'].includes(stage);
    const hideCheck = stage === 'closed';


    return (
        <div className="rent-row-actions">
            <button
                type="button"
                onClick={onUpdate}
                disabled={!isOrdered}
                className="rent-row-actions__btn rent-row-actions__btn--update"
            >
                {/*{t('rent.actions.update', 'Update')}*/}
                ✏️
            </button>

            <button
                type="button"
                onClick={onDelete}
                disabled={canDelete}
                className="rent-row-actions__btn rent-row-actions__btn--delete"
            >
                {/*{t('rent.actions.delete', 'Delete')}*/}
                🗑️
            </button>

            <button
                type="button"
                onClick={onPay}
                disabled={isOrdered}
                className="rent-row-actions__btn rent-row-actions__btn--pay"
            >
                {/*{t('rent.actions.pay', 'Pay')}*/}
                💳
            </button>
            {hideCheck && <Button className="btn-nav" onClick={onCheck}>
                {/*{t('rent.actions.checkup', 'ck')}*/}
                🔍
            </Button>}
        </div>
    );
};

export default RentRowActions;
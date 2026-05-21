import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from '../button/Button';
import SubmitButton from '../button/SubmitButton';
import RentErrorBlock from '../rent/RentErrorBlock/RentErrorBlock';
import './DeleteModal.css';

export interface DeleteModalProps {
    id: string | number;
    isOpen: boolean;
    title: string;
    message: string;
    confirmBtnText: string;
    errorText: string;
    onDeleteApi: (id: string) => Promise<any>;
    onClose: () => void;
    onSuccess: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
                                                     id,
                                                     isOpen,
                                                     title,
                                                     message,
                                                     confirmBtnText,
                                                     errorText,
                                                     onDeleteApi,
                                                     onClose,
                                                     onSuccess
                                                 }) => {
    const { t } = useTranslation();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDeleteConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsDeleting(true);

        try {
            await onDeleteApi(String(id));
            onSuccess();
            onClose();
        } catch (err: any) {
            let msg = errorText;

            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                msg = Array.isArray(detail) ? detail.map((d: any) => d.msg).join(', ') : String(detail);
            } else if (err.message) {
                msg = err.message;
            }

            setErrorMessage(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal onClose={() => !isDeleting && onClose()}>
            <form onSubmit={handleDeleteConfirm} className="delete-modal-form">
                <h2 className="delete-modal-title">
                    {title}
                </h2>

                <RentErrorBlock message={errorMessage} />

                <p className="delete-modal-message">
                    {message}
                </p>

                <div className="delete-modal-actions">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {t('profile.cancel', 'Cancel')}
                    </Button>
                    <SubmitButton
                        loading={isDeleting}
                    >
                        {confirmBtnText}
                    </SubmitButton>
                </div>
            </form>
        </Modal>
    );
};

export default DeleteModal;
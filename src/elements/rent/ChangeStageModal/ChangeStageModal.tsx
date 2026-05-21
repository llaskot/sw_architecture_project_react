import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../modal/Modal';
import StageDropdown, {type StageOption } from '../StageDropdown/StageDropdown';
import Textarea from '../../input/Textarea';
import RentErrorBlock from '../RentErrorBlock/RentErrorBlock';
import SubmitButton from '../../button/SubmitButton';
import Button from '../../button/Button';
import { changeRentStage, getRentStages } from '../../../api/rentApi';
import './ChangeStageModal.css';

export interface ChangeStageModalProps {
    rentId: string | number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ChangeStageModal: React.FC<ChangeStageModalProps> = ({
                                                               rentId,
                                                               isOpen,
                                                               onClose,
                                                               onSuccess
                                                           }) => {
    const { t } = useTranslation();

    const [stages, setStages] = useState<StageOption[]>([]);
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [comment, setComment] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            const fetchStages = async () => {
                try {
                    const availableStages = await getRentStages();
                    const formattedStages = availableStages.map((stage: string) => ({
                        value: stage,
                        label: stage.charAt(0).toUpperCase() + stage.slice(1)
                    }));
                    setStages(formattedStages);
                } catch (err) {
                    console.error('Failed to load stages', err);
                }
            };
            fetchStages();

            setSelectedStage(null);
            setComment('');
            setErrorMessage(null);
            setValidationError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setValidationError('');

        if (!selectedStage) {
            setValidationError(t('rent.errors.stageRequired', 'Please select a stage'));
            return;
        }

        setLoading(true);
        try {
            await changeRentStage(String(rentId), selectedStage, comment.trim() || null);
            onSuccess();
            onClose();
        } catch (err: any) {
            let msg = t('rent.errors.serverDefault', 'An error occurred while changing the stage');

            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                msg = Array.isArray(detail) ? detail.map((d: any) => d.msg).join(', ') : String(detail);
            } else if (err.message) {
                msg = err.message;
            }

            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal onClose={onClose}>
            <form onSubmit={handleSubmit} className="change-stage-form">
                <h3 className="change-stage-title">
                    {t('rent.stageModal.title', 'Change Rental Stage')}
                </h3>

                <RentErrorBlock message={errorMessage} />

                <StageDropdown
                    label={t('rent.table.stage', 'Stage')}
                    options={stages}
                    value={selectedStage}
                    onChange={(val) => {
                        setSelectedStage(val);
                        setValidationError('');
                    }}
                    placeholder={t('rent.filters.stagePlaceholder', 'Select stage')}
                    error={validationError}
                    disabled={loading}
                />

                <Textarea
                    label={t('admin.table.comment', 'Comment')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('rent.edit.commentPlaceholder', 'Type a comment optional...')}
                    disabled={loading}
                    rows={4}
                />

                <div className="change-stage-actions">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('profile.cancel', 'Cancel')}
                    </Button>
                    <SubmitButton
                        loading={loading}
                    >
                        {t('profile.save', 'Save')}
                    </SubmitButton>
                </div>
            </form>
        </Modal>
    );
};

export default ChangeStageModal;
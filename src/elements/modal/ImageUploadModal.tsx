import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from '../button/Button';
import SubmitButton from '../button/SubmitButton';
import RentErrorBlock from '../rent/RentErrorBlock/RentErrorBlock';
import { uploadCarImage } from '../../api/carsApi';
import { parseApiError } from '../../utils/errorHandler';
import './ImageUploadModal.css';

interface ImageUploadModalProps {
    isOpen: boolean;
    carId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
                                                                      isOpen,
                                                                      carId,
                                                                      onClose,
                                                                      onSuccess
                                                                  }) => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError(t('admin.car.imageUploadEmpty', 'Please select an image first.'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await uploadCarImage(carId, selectedFile);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Upload Image Error:", err);
            setError(parseApiError(err, t('admin.car.imageUploadError', 'Failed to upload image.')));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="image-upload-modal-container">
                <h3 className="image-upload-modal-title">
                    {t('admin.car.uploadImageTitle', 'Upload Car Image')}
                </h3>

                {error && <RentErrorBlock message={error} />}

                <form onSubmit={handleUpload} className="image-upload-modal-form">
                    <div
                        className={`image-upload-dropzone ${previewUrl ? 'has-image' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="image-upload-preview" />
                        ) : (
                            <div className="image-upload-placeholder">
                                <span className="image-upload-icon">📷</span>
                                <span>{t('admin.car.clickToSelect', 'Click here to select an image')}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="image-upload-hidden-input"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="image-upload-modal-actions">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="btn-small image-upload-cancel-btn"
                        >
                            {t('profile.cancel', 'Cancel')}
                        </Button>

                        <SubmitButton
                            loading={loading}
                            disabled={!selectedFile || loading}
                            className="btn-small"
                        >
                            {t('profile.upload', 'Upload')}
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ImageUploadModal;
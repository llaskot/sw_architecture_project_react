import React, { type ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
    closeOnBackdropClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, closeOnBackdropClick = true }) => {
    return (
        <div
            className="modal-overlay"
            onClick={() => closeOnBackdropClick && onClose()}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal content
            >
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                    aria-label="Close"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
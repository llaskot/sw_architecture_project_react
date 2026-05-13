import React, { type ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
    closeOnBackdropClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, closeOnBackdropClick = true }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}
            onClick={() => closeOnBackdropClick && onClose()}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    minWidth: '320px',
                    color: 'black',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()} // Чтобы не закрывалось при клике на саму форму
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#999',
                        lineHeight: '1',
                        padding: '5px',
                        zIndex: 10
                    }}
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
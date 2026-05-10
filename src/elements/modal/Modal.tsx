import React, { type ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
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
            onClick={onClose}
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
                {children}
            </div>
        </div>
    );
};

export default Modal;
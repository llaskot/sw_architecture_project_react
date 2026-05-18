import React from 'react';
import './RentErrorBlock.css';

interface RentErrorBlockProps {
    message: string | null;
    onClose?: () => void;
}

const RentErrorBlock: React.FC<RentErrorBlockProps> = ({ message, onClose }) => {
    if (!message) return null; // Если ошибки нет, компонент ничего не рендерит

    return (
        <div className="rent-error-block">
            <div className="rent-error-block__content">
                <span className="rent-error-block__icon">⚠️</span>
                <p className="rent-error-block__text">{message}</p>
            </div>
            {onClose && (
                <button
                    type="button"
                    className="rent-error-block__close-btn"
                    onClick={onClose}
                    title="Закрити"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default RentErrorBlock;

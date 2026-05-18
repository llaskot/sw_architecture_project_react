import React from 'react';

interface CarPlaceholderProps {
    category?: string | null;
}

const CarPlaceholder: React.FC<CarPlaceholderProps> = ({ category }) => {
    // Приводим к нижнему регистру для надёжности сравнения
    const cat = category?.toLowerCase();

    // 1. ВНЕДОРОЖНИК / SUV (jeep-car-svgrepo-com.svg)
    if (cat === 'suv') {
        return (
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                {/* Голубой фон-круг */}
                <circle cx="100" cy="100" r="100" fill="#80dbff" />
                {/* Колёса */}
                <rect x="44" y="140" width="18" height="25" rx="4" fill="#2c3e50" />
                <rect x="138" y="140" width="18" height="25" rx="4" fill="#2c3e50" />
                {/* Бампер */}
                <rect x="30" y="124" width="140" height="12" fill="#34495e" />
                {/* Основной корпус */}
                <path d="M50 124h100v-30c0-10-6-16-16-16H66c-10 0-16 6-16 16v30z" fill="#ff6b57" />
                {/* Кабина и рамка лобового */}
                <path d="M56 78h88l-6-35H62l-6 35z" fill="#ff6b57" />
                {/* Лобовое стекло */}
                <polygon points="65,48 135,48 139,72 61,72" fill="#e6e9ed" />
                <rect x="92" y="54" width="16" height="6" fill="#ccd1d9" />
                {/* Радиаторная решётка */}
                <rect x="80" y="92" width="5" height="24" rx="2" fill="#2c3e50" />
                <rect x="89" y="92" width="5" height="24" rx="2" fill="#2c3e50" />
                <rect x="98" y="92" width="5" height="24" rx="2" fill="#2c3e50" />
                <rect x="107" y="92" width="5" height="24" rx="2" fill="#2c3e50" />
                <rect x="115" y="92" width="5" height="24" rx="2" fill="#2c3e50" />
                {/* Фары */}
                <circle cx="66" cy="104" r="8" fill="#ffd54f" />
                <circle cx="134" cy="104" r="8" fill="#ffd54f" />
                {/* Зеркала заднего вида */}
                <path d="M50 84h-10v-12h14v4z" fill="#34495e" />
                <path d="M150 84h10v-12h-14v4z" fill="#34495e" />
            </svg>
        );
    }

    // 2. ЭКОНОМ / ЖУК (car-svgrepo-com.svg)
    if (cat === 'economy') {
        return (
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                {/* Зелёный фон-круг */}
                <circle cx="100" cy="100" r="100" fill="#6ec94d" />
                {/* Колёса */}
                <rect x="42" y="144" width="16" height="30" rx="5" fill="#333745" />
                <rect x="142" y="144" width="16" height="30" rx="5" fill="#333745" />
                {/* Крыша и верх кабины */}
                <path d="M54 90c0-45 92-45 92 0z" fill="#e34b26" />
                {/* Лобовое стекло */}
                <path d="M58 84c4-36 80-36 84 0z" fill="#008eff" />
                {/* Нижняя часть кузова */}
                <path d="M37 136c0-30 126-30 126 0z" fill="#e34b26" />
                {/* Капот */}
                <path d="M58 90c0 0 10 52 42 52s42-52 42-52z" fill="#f05537" />
                {/* Бампер */}
                <path d="M35 138q65 14 130 0" stroke="#dbdbdb" strokeWidth="11" strokeLinecap="round" fill="none" />
                {/* Круглые фары жука */}
                <circle cx="58" cy="114" r="12" fill="#ffd600" />
                <circle cx="142" cy="114" r="12" fill="#ffd600" />
            </svg>
        );
    }

    // 3. ДЕФОЛТ / ЛЮКС / БИЗНЕС / СТАНДАРТ (car-svgrepo-com (1).svg)
    return (
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
            {/* Оранжевый фон-круг */}
            <circle cx="100" cy="100" r="100" fill="#f05423" />
            {/* Нижние колеса */}
            <rect x="38" y="132" width="22" height="28" rx="6" fill="#000000" />
            <rect x="140" y="132" width="22" height="28" rx="6" fill="#000000" />
            {/* Кабина */}
            <path d="M60 84l10-38c2-6 8-10 15-10h30c7 0 13 4 15 10l10 38z" fill="#7fa2a6" />
            {/* Тёмное стекло */}
            <path d="M64 80l8-32c1-4 5-7 9-7h38c4 0 8 3 9 7l8 32z" fill="#2d3238" />
            {/* Боковые крылья и капот */}
            <path d="M30 116c0-25 24-36 70-36s70 11 70 36z" fill="#7fa2a6" />
            {/* Передняя решётка бампера */}
            <path d="M32 116h136v20c0 8-6 14-14 14H46c-8 0-14-6-14-14v-20z" fill="#586375" />
            {/* Хромированная решётка радиатора */}
            <rect x="64" y="108" width="72" height="24" rx="12" fill="#d0d5dd" stroke="#586375" strokeWidth="2" />
            <line x1="64" y1="114" x2="136" y2="114" stroke="#586375" strokeWidth="2" />
            <line x1="64" y1="120" x2="136" y2="120" stroke="#586375" strokeWidth="2" />
            <line x1="64" y1="126" x2="136" y2="126" stroke="#586375" strokeWidth="2" />
            {/* Поворотники (желтые полоски) */}
            <rect x="42" y="122" width="16" height="8" rx="3" fill="#ffb300" />
            <rect x="142" y="122" width="16" height="8" rx="3" fill="#ffb300" />
            {/* Белые круглые фары */}
            <circle cx="50" cy="102" r="12" fill="#ffffff" stroke="#586375" strokeWidth="3" />
            <circle cx="150" cy="102" r="12" fill="#ffffff" stroke="#586375" strokeWidth="3" />
            {/* Вертикальные клыки батели */}
            <rect x="58" y="112" width="5" height="24" fill="#ffffff" />
            <rect x="137" y="112" width="5" height="24" fill="#ffffff" />
        </svg>
    );
};

export default CarPlaceholder;
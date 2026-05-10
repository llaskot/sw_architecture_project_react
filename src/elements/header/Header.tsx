//
// import React from 'react';
// import { useTranslation } from 'react-i18next';
//
// // Описываем, что хедер принимает функцию для открытия окна
// interface HeaderProps {
//     onSignInClick: () => void;
// }
//
// const Header: React.FC<HeaderProps> = ({ onSignInClick }) => {
//     const { t, i18n } = useTranslation();
//
//     const changeLanguage = (lng: string) => {
//         i18n.changeLanguage(lng);
//     };
//
//     return (
//         <header style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: '1rem',
//             borderBottom: '1px solid #ccc'
//         }}>
//             <div>
//                 <h1>{t('header.projectName')}</h1>
//             </div>
//             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
//                 <div style={{ display: 'flex', gap: '5px' }}>
//                     <button onClick={() => changeLanguage('en')}>EN</button>
//                     <button onClick={() => changeLanguage('uk')}>UK</button>
//                 </div>
//
//                 {/* Вызываем переданную функцию при клике */}
//                 <button onClick={onSignInClick}>{t('header.signIn')}</button>
//                 <button>{t('header.signUp')}</button>
//                 <span>{t('header.username')}: {t('guest')}</span>
//             </div>
//         </header>
//     );
// };
//
// export default Header;


import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { openModal } from '../../slices/authSlice';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch(); // Инструмент для отправки команд в Redux

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            borderBottom: '1px solid #ccc'
        }}>
            <div>
                <h1>{t('header.projectName')}</h1>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => changeLanguage('en')}>EN</button>
                    <button onClick={() => changeLanguage('uk')}>UK</button>
                </div>

                {/* Теперь кнопка сама отправляет экшен в Redux */}
                <button onClick={() => dispatch(openModal('signIn'))}>
                    {t('header.signIn')}
                </button>

                <button>{t('header.signUp')}</button>
                <span>{t('header.username')}: {t('guest')}</span>
            </div>
        </header>
    );
};

export default Header;
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux'; // Добавь useSelector
import {openModal, logoutUser} from '../../slices/authSlice'; // Добавь logout
import {type RootState} from '../../app/store'; // Импорт типа состояния
import {Link} from 'react-router-dom';
import {type AppDispatch} from '../../app/store';

const Header: React.FC = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    // Достаем данные пользователя из Redux
    const {user} = useSelector((state: RootState) => state.auth);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('appLanguage', lng);
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
            <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '5px'}}>
                    <button
                        onClick={() => changeLanguage('en')}
                        style={{
                            fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                            backgroundColor: i18n.language === 'en' ? '#007bff' : '#f8f9fa',
                            color: i18n.language === 'en' ? '#fff' : '#000',
                            border: '1px solid #ccc',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => changeLanguage('uk')}
                        style={{
                            fontWeight: i18n.language === 'uk' ? 'bold' : 'normal',
                            backgroundColor: i18n.language === 'uk' ? '#007bff' : '#f8f9fa',
                            color: i18n.language === 'uk' ? '#fff' : '#000',
                            border: '1px solid #ccc',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        UK
                    </button>
                </div>
                {user ? (
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <span>
                            {t('header.username')}:
                            {/* Оборачиваем логин в Link */}
                            <Link to="/profile" style={{
                                marginLeft: '5px',
                                fontWeight: 'bold',
                                color: '#007bff',
                                textDecoration: 'none'
                            }}>
                                {user.first_name}
                            </Link>
                        </span>


                        {/* Link to the user rental history page */}
                        <Link to="/my-rents" style={{color: '#007bff', textDecoration: 'none'}}>
                            {t('header.myRents', 'My Rentals')}
                        </Link>


                        <button
                            onClick={() => dispatch(logoutUser())}
                            style={{cursor: 'pointer', color: '#d9534f'}}
                        >
                            {t('logout')}
                        </button>

                    </div>
                ) : (
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <button onClick={() => dispatch(openModal('signIn'))}>
                            {t('header.signIn')}
                        </button>
                        <button onClick={() => dispatch(openModal('signUp'))}>
                            {t('header.signUp')}
                        </button>
                        <span>{t('header.username')}: {t('guest')}</span>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
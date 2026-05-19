import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, logoutUser } from '../../slices/authSlice';
import { type RootState } from '../../app/store';
import { Link } from 'react-router-dom';
import { type AppDispatch } from '../../app/store';
import './Header.css';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    // Get user data from Redux state
    const { user } = useSelector((state: RootState) => state.auth);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('appLanguage', lng);
    };

    return (
        <header className="site-header">
            <div className="header-logo">
                <h1>{t('header.projectName')}</h1>
            </div>
            <div className="header-actions">
                <div className="lang-switcher">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`lang-btn ${i18n.language === 'en' ? 'lang-btn--active' : ''}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => changeLanguage('uk')}
                        className={`lang-btn ${i18n.language === 'uk' ? 'lang-btn--active' : ''}`}
                    >
                        UK
                    </button>
                </div>
                {user ? (
                    <div className="user-menu">
                        <span>
                            {t('header.username')}:
                            {/* Wrap username in a Link */}
                            <Link to="/profile" className="profile-link">
                                {user.first_name}
                            </Link>
                        </span>

                        {/* Link to the user rental history page */}
                        <Link to="/my-rents" className="my-rents-link">
                            {t('header.myRents', 'My Rentals')}
                        </Link>

                        <button
                            onClick={() => dispatch(logoutUser())}
                            className="logout-btn"
                        >
                            {t('logout')}
                        </button>
                    </div>
                ) : (
                    <div className="guest-menu">
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
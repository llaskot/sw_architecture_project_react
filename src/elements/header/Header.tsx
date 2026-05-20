import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {openModal, logoutUser} from '../../slices/authSlice';
import {type RootState} from '../../app/store';
import {Link} from 'react-router-dom';
import {type AppDispatch} from '../../app/store';
import './Header.css';

const Header: React.FC = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();


    // Get user data from Redux state
    const {user} = useSelector((state: RootState) => state.auth);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('appLanguage', lng);
    };

    return (
        <header className="site-header">
            <div className="header-logo">
                <Link to="/" className="logo-link">
                    <h1>{t('header.projectName')}</h1>
                </Link>

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
                    <div>
                        {/* Link to the user rental history page */}
                        <div className={'right-side'}>
                            <div className='additional'><span><
                                Link to="/my-rents" className="my-rents-link">
                            {t('header.myRents', 'My Rentals')}
                            </Link>
                        </span>
                                <span>
                        {(user.is_admin || user.is_manager) && (
                            <Link to={user.is_admin ? '/admin' : '/manager'} className="dashboard-link">
                                {user.is_admin ? t('header.adminPanel', 'Admin Panel') : t('header.managerPanel', 'Manager Panel')}
                            </Link>
                        )}
                        </span></div>
                            <div className="user-menu">
                                <button
                                    onClick={() => dispatch(logoutUser())}
                                    className="logout-btn"
                                >
                                    {t('logout')}
                                </button>
                                <span>
                            {t('header.username')}:
                                    {/* Wrap username in a Link */}
                                    <Link to="/profile" className="profile-link">
                                {user.first_name}
                            </Link>
                            </span>
                            </div>
                        </div>


                    </div>
                ) : (
                    <div className="user-menu">
                        <div className="guest-menu">
                            <button onClick={() => dispatch(openModal('signIn'))}>
                                {t('header.signIn')}
                            </button>
                            <button onClick={() => dispatch(openModal('signUp'))}>
                                {t('header.signUp')}
                            </button>
                        </div>
                        <span>{t('header.username')}: {t('guest')}</span>
                    </div>
                )}

            </div>


        </header>
    );
};

export default Header;
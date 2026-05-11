import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux'; // Добавь useSelector
import {openModal, logout} from '../../slices/authSlice'; // Добавь logout
import {type RootState} from '../../app/store'; // Импорт типа состояния

const Header: React.FC = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    // Достаем данные пользователя из Redux
    const {user} = useSelector((state: RootState) => state.auth);

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
            <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '5px'}}>
                    <button onClick={() => changeLanguage('en')}>EN</button>
                    <button onClick={() => changeLanguage('uk')}>UK</button>
                </div>
                {user ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span>{t('header.username')}: <strong>{user.login}</strong></span>
                        <button onClick={() => dispatch(logout())}>
                            {i18n.language === 'uk' ? 'Вийти' : 'Logout'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
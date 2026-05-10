import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../app/store';
import { closeModal, openModal } from '../../slices/authSlice';
import Modal from './Modal';
import SignInForm from './SignInForm';

const ModalManager: React.FC = () => {
    const dispatch = useDispatch();
    const activeModal = useSelector((state: RootState) => state.auth.activeModal);

    if (!activeModal) return null;

    return (
        <Modal onClose={() => dispatch(closeModal())}>
            {activeModal === 'signIn' && (
                <SignInForm
                    onRegisterClick={() => dispatch(openModal('signUp'))}
                    onForgotPassClick={() => dispatch(openModal('forgotPassword'))}
                    onSuccess={(data) => console.log('Logged in:', data)}
                />
            )}
            {activeModal === 'signUp' && <div>Форма регистрации (в разработке)</div>}
            {activeModal === 'forgotPassword' && <div>Восстановление пароля (в разработке)</div>}
        </Modal>
    );
};

export default ModalManager;
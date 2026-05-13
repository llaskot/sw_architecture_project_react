import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../app/store';
import { closeModal, openModal } from '../../slices/authSlice';
import Modal from './Modal';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const ModalManager: React.FC = () => {
    const dispatch = useDispatch();
    const activeModal = useSelector((state: RootState) => state.auth.activeModal);

    if (!activeModal) return null;

    return (
        <Modal
            onClose={() => dispatch(closeModal())}
            closeOnBackdropClick={activeModal !== 'signUp'}
        >
            {activeModal === 'signIn' && (
                <SignInForm
                    onRegisterClick={() => dispatch(openModal('signUp'))}
                    onForgotPassClick={() => dispatch(openModal('forgotPassword'))}
                    onSuccess={(data) => console.log('Logged in:', data)}
                />
            )}
            {activeModal === 'signUp' && <SignUpForm />}
            {activeModal === 'forgotPassword' && <div>Восстановление пароля (в разработке)</div>}
        </Modal>
    );
};

export default ModalManager;
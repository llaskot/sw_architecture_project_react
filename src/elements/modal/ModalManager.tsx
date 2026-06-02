import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {type RootState} from '../../app/store';
import {closeModal, openModal} from '../../slices/authSlice';
import Modal from './Modal';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ConfirmRegistrationForm from "./ConfirmRegistrationForm.tsx";
import ForgotPasswordForm from "./ForgotPasswordForm.tsx";
import ConfirmForgotPasswordForm from "./ConfirmForgotPasswordForm.tsx";

const ModalManager: React.FC = () => {
    const dispatch = useDispatch();
    const activeModal = useSelector((state: RootState) => state.auth.activeModal);

    if (!activeModal) return null;

    return (
        <Modal
            onClose={() => dispatch(closeModal())}
            closeOnBackdropClick={
                activeModal !== 'signUp' &&
                activeModal !== 'confirmRegistration' &&
                activeModal !== 'forgotPassword' &&
                activeModal !== 'confirmForgotPassword'}
        >
            {activeModal === 'signIn' && (
                <SignInForm
                    onRegisterClick={() => dispatch(openModal('signUp'))}
                    onForgotPassClick={() => dispatch(openModal('forgotPassword'))}
                />
            )}
            {activeModal === 'confirmRegistration' && <ConfirmRegistrationForm/>}
            {activeModal === 'signUp' && <SignUpForm/>}
            {activeModal === 'forgotPassword' && <ForgotPasswordForm/>}
            {activeModal === 'confirmForgotPassword' && <ConfirmForgotPasswordForm/>}
        </Modal>
    );
};

export default ModalManager;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../../app/store';
import { closeModal } from '../../../slices/authSlice';
import Button from '../../button/Button';
import styles from './RentAgreementModal.module.css';

const RentAgreementModal: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Достаем данные аренды, которые мы только что научились сохранять
    const currentRent = useSelector((state: RootState) => state.cars.currentRent);

    if (!currentRent) return null;

    // НАША ИДЕАЛЬНАЯ ФУНКЦИЯ ПЕЧАТИ
    const handlePrint = () => {
        const printElement = document.getElementById('printable-rent-agreement');
        if (!printElement) return;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        document.body.appendChild(iframe);

        const stylesStr = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(tag => tag.outerHTML)
            .join('\n');

        const printHTML = printElement.outerHTML;

        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) return;

        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="">
                <head>
                    <title>Rental Agreement</title>
                    ${stylesStr}
                    <style>
                        @page { 
                            size: A4 portrait; 
                            margin: 0; 
                        }
                        body { 
                            background: white !important; 
                            margin: 0; 
                            padding: 0; 
                        }
                        .print-wrapper {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        #printable-rent-agreement {
                            padding: 0 20mm !important;
                            box-sizing: border-box !important;
                            box-shadow: none !important;
                            margin: 0 !important;
                            max-height: none !important;
                            height: auto !important;
                            
                            /* ДОБАВЬ ЭТУ СТРОКУ: */
                            min-height: auto !important; 
                            
                            width: 100% !important;
                            display: block !important;
                        }   
                        .section, .signatures {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        .noPrint { display: none !important; }
                    </style>
                </head>
                <body>
                    <table class="print-wrapper">
                        <thead><tr><td style="height: 20mm;"></td></tr></thead>
                        <tbody><tr><td>${printHTML}</td></tr></tbody>
                        <tfoot><tr><td style="height: 20mm;"></td></tr></tfoot>
                    </table>
                </body>
            </html>
        `);
        iframeDoc.close();

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
    };

    const createdDate = new Date(currentRent.created_at || Date.now()).toLocaleDateString();
    const startDate = currentRent.start_date ? new Date(currentRent.start_date).toLocaleDateString() : '';
    const client = currentRent.client;
    const car = currentRent.car;
    const computedPrice = (car?.price_per_day || 0) * (currentRent.days_qty || 1);

    return (
        <div className={styles.container}>
            {/* Панель кнопок */}
            <div className={`${styles.actions} ${styles.noPrint}`}>
                <Button onClick={handlePrint} className="btn-action print-btn">
                    🖨️ {t('rent.printBtn', 'Print Agreement')}
                </Button>
                {/* Кнопка закрытия модалки */}
                <Button onClick={() => dispatch(closeModal())} className="btn-nav">
                    {t('common.close', 'Close')}
                </Button>
            </div>

            {/* Изолированный лист для печати */}
            <div id="printable-rent-agreement" className={styles.a4Page}>
                <h2 className={styles.title}>{t('rent.agreementTitle', 'Rental Agreement')}</h2>
                <div className={styles.date}>
                    <strong>{t('common.date', 'Date:')}</strong> {createdDate}
                </div>

                <div className={styles.section}>
                    <h3>1. {t('rent.parties', 'Parties')}</h3>
                    <p><strong>{t('rent.lessor', 'Lessor (Company):')}</strong> RENT-A-CAR LLC</p>
                    <p><strong>{t('rent.lessee', 'Lessee (Client):')}</strong> {client?.first_name} {client?.last_name}</p>
                    <p><strong>{t('profile.email', 'Email:')}</strong> {client?.email}</p>
                    <p><strong>{t('rent.passport', 'Passport / ID:')}</strong> {currentRent.user_dock || '___________________'}</p>
                </div>

                <div className={styles.section}>
                    <h3>2. {t('rent.subject', 'Subject of the Agreement')}</h3>
                    <p><strong>{t('admin.filters.vehicle', 'Vehicle:')}</strong> {car?.model?.brand?.name} {car?.model?.name}</p>
                    <p><strong>{t('car.plate_number', 'Plate Number:')}</strong> {car?.plate_number}</p>
                    <p><strong>{t('car.vin', 'VIN:')}</strong> {car?.vin}</p>
                    <p><strong>{t('car.year', 'Year:')}</strong> {car?.year}</p>
                </div>

                <div className={styles.section}>
                    <h3>3. {t('rent.terms', 'Terms and Conditions')}</h3>
                    <p><strong>{t('rent.startDateLabel', 'Start Date:')}</strong> {startDate}</p>
                    <p><strong>{t('rent.daysQtyLabel', 'Duration:')}</strong> {currentRent.days_qty} {t('common.days', 'days')}</p>
                    <p><strong>{t('rent.driverLabel', 'Driver Included:')}</strong> {currentRent.driver ? t('common.yes', 'Yes') : t('common.no', 'No')}</p>
                    <p><strong>{t('rent.totalPriceLabel', 'Total Price:')}</strong> ${computedPrice}</p>
                </div>

                <div className={styles.section}>
                    <h3>4. {t('rent.responsibilities', 'Responsibilities')}</h3>
                    <p>{t('rent.respText1', 'The Lessee assumes full responsibility for the vehicle during the rental period.')}</p>
                    <p>{t('rent.respText2', 'The vehicle must be returned in the same condition as it was provided.')}</p>
                </div>

                <div className={styles.signatures}>
                    <div className={styles.signsRow}>
                        <span className={styles.signPlace}><strong>{t('rent.signLessor', 'Lessor:')}</strong> ______________</span>
                        <span className={styles.signPlace}><strong>{t('rent.signLessee', 'Lessee:')}</strong> ______________</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentAgreementModal;
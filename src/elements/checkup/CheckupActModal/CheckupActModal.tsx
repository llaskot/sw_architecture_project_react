import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../app/store';
import Button from '../../button/Button';
import styles from './CheckupActModal.module.css';

const CheckupActModal: React.FC = () => {
    const { t } = useTranslation();

    const currentCheckup = useSelector((state: RootState) => state.cars.currentCheckup);

    if (!currentCheckup) return null;


    const handlePrint = () => {
        const printElement = document.getElementById('printable-a4-act');
        if (!printElement) return;

        // 1. Создаем невидимый iframe за пределами экрана
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        document.body.appendChild(iframe);

        // 2. Собираем все родные стили твоего сайта (CSS Modules)
        const stylesStr = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(tag => tag.outerHTML)
            .join('\n');

        // 3. Берем весь HTML твоего акта
        const printHTML = printElement.outerHTML;

        // 4. Записываем это всё в iframe
        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) return;

        iframeDoc.open();

        iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="">
                <head>
                    <title>Печать акта</title>
                    ${stylesStr}
                    <style>
                        /* 1. Убиваем колонтитулы браузера */
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
                    
                        /* 2. Левые и правые поля задаем тут */
                        #printable-a4-act {
                            padding-left: 20mm !important;   /* Отступ слева */
                            padding-right: 20mm !important;  /* Отступ справа */
                            padding-top: 0 !important;       /* Верх/низ контролирует таблица */
                            padding-bottom: 0 !important;
                            
                            box-sizing: border-box !important;
                            box-shadow: none !important;
                            margin: 0 !important;
                            max-height: none !important;
                            overflow: visible !important;
                            height: auto !important;
                            width: 100% !important;
                            display: block !important;
                        }
                    
                        .section, .requisites, .signatures {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    
                        .noPrint { display: none !important; }
                </style>
                </head>
                <body>
                    <table class="print-wrapper">
                        <thead>
                            <tr><td style="height: 20mm;"></td></tr>
                        </thead>
                        
                        <tbody>
                            <tr><td>
                                ${printHTML}
                            </td></tr>
                        </tbody>
                        
                        <tfoot>
                            <tr><td style="height: 20mm;"></td></tr>
                        </tfoot>
                    </table>
                </body>
            </html>
        `);

        iframeDoc.close();

        // 5. Ждем полсекунды (чтобы стили прогрузились) и вызываем печать
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            // 6. Удаляем iframe после печати
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    };




    const createdDate = new Date(currentCheckup.created_at).toLocaleDateString();
    const client = currentCheckup.rent?.client;
    const car = currentCheckup.rent?.car;
    const brand = car?.model?.brand;

    return (
        <div className={styles.container}>
            {/* Кнопка печати */}
            <div className={`${styles.actions} ${styles.noPrint}`}>
                <Button onClick={handlePrint} className="btn-action print-btn">
                    🖨️ {t('checkupAct.printBtn', 'Print / Save PDF')}
                </Button>
            </div>

            {/* Визуальный лист А4 */}
            <div id="printable-a4-act" className={styles.a4Page}>
                <h2 className={styles.title}>{t('checkupAct.title', 'Vehicle Handover (Return) Certificate')}</h2>
                <div className={styles.date}>
                    <strong>{t('checkupAct.date', 'Date:')}</strong> {createdDate}
                </div>

                <div className={styles.section}>
                    <h3>{t('checkupAct.rentInfo', 'Rental Agreement Info')}</h3>
                    <p><strong>{t('checkupAct.rentId', 'Agreement ID:')}</strong> {currentCheckup.rent_id}</p>
                </div>

                <div className={styles.section}>
                    <h3>{t('checkupAct.clientInfo', 'Client Information')}</h3>
                    <p><strong>{t('checkupAct.clientName', 'Full Name:')}</strong> {client?.first_name} {client?.last_name}</p>
                    <p><strong>{t('checkupAct.clientEmail', 'Email:')}</strong> {client?.email}</p>
                </div>

                <div className={styles.section}>
                    <h3>{t('checkupAct.carInfo', 'Vehicle Details')}</h3>
                    <p><strong>{t('checkupAct.carModel', 'Make & Model:')}</strong> {brand?.name} {car?.model?.name}</p>
                    <p><strong>{t('checkupAct.carYear', 'Year:')}</strong> {car?.year}</p>
                    <p><strong>{t('checkupAct.carVin', 'VIN:')}</strong> {car?.vin}</p>
                    <p><strong>{t('checkupAct.carPlate', 'Plate Number:')}</strong> {car?.plate_number}</p>
                    <p><strong>{t('checkupAct.carMileage', 'Mileage:')}</strong> {car?.mileage} km</p>
                </div>

                <div className={styles.section}>
                    <h3>{t('checkupAct.checkupResult', 'Checkup Results')}</h3>
                    <p><strong>{t('checkupAct.summary', 'General Condition:')}</strong> {currentCheckup.summary}</p>

                    <p>
                        <strong>{t('checkupAct.notes', 'Notes / Damages:')}</strong>{' '}
                        <span className={styles.multilineText}>{currentCheckup.notis}</span>
                    </p>

                    <p><strong>{t('checkupAct.price', 'Additional Charges:')}</strong> ${currentCheckup.price}</p>
                </div>

                <div className={styles.section}>
                    {/* Блок с реквизитами показываем только если есть доп. начисления */}
                    {currentCheckup.price > 0 && (
                        <div className={`${styles.section} ${styles.requisites}`}>
                            <h3>{t('checkupAct.requisites', 'Payment Requisites')}</h3>
                            <p><strong>{t('checkupAct.bank', 'Bank:')}</strong> PRIVATBANK</p>
                            <p><strong>{t('checkupAct.iban', 'IBAN:')}</strong> UA123456789000000000000000000</p>
                        </div>
                    )}

                    <div className={styles.signatures}>
                        <h3>{t('checkupAct.signatures', 'Signatures')}</h3>
                        <div className={styles.signsRow}>
                            <span
                                className={styles.signPlace}><strong>{t('checkupAct.signManager', 'Manager:')}</strong> ______________</span>
                            <span className={styles.signPlace}><strong>{t('checkupAct.signClient', 'Client:')}</strong> ______________</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckupActModal;
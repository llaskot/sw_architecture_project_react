import Header from "./elements/header/Header";
import { useTranslation } from 'react-i18next';
import ModalManager from "./elements/modal/ModalManager.tsx";

function App() {
    const { t } = useTranslation();

    return (
        <>
            {/* Ошибка исчезнет, так как Header больше не требует пропсов */}
            <Header />

            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>{t('header.projectName')}</h2>
            </main>

            <ModalManager />
        </>
    );
}

export default App;


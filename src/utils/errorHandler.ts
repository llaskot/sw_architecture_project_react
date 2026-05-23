export const parseApiError = (err: any, fallbackMessage: string): string => {

    const payload = err?.response?.data || err;

    if (payload && payload.detail) {
        if (typeof payload.detail === 'string') {
            return payload.detail;
        }
        if (typeof payload.detail === 'object' && payload.detail.message) {
            return payload.detail.message;
        }
    }

    if (payload && payload.message && typeof payload.message === 'string') {
        return payload.message;
    }

    return fallbackMessage;
};
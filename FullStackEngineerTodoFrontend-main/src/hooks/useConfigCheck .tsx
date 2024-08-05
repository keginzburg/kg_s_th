import { useEffect, useState } from 'react';

export const useConfigCheck = () => {
    const [configError, setConfigError] = useState<string | null>(null);

    useEffect(() => {
        const apiUrl = process.env.TODO_BACKEND_API_URL;
        const authorName = process.env.TODO_AUTHOR_NAME;

        if (!apiUrl || apiUrl.trim() === '') {
            setConfigError('Configuration error: TODO_BACKEND_API_URL is missing or empty.');
        } else if (!authorName || authorName.trim() === '') {
            setConfigError('Configuration error: TODO_AUTHOR_NAME is missing or empty.');
        } else {
            setConfigError(null); // No error if all environment variables are set and not empty
        }
    }, []);

    return configError;
};

import { useMemo } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import useSystemURLCon from './useSystemURLCon';
import useGetToken from './useGetToken';

window.Pusher = Pusher;

const useEchoBroadcast = () => {
    const { url } = useSystemURLCon();
    const { getToken } = useGetToken();
    const pusherStatus = process.env.REACT_APP_ENABLE_PUSHER;

    const echoInstance = useMemo(() => {
        const token = getToken('csrf-token');

        const isEnabled = pusherStatus && pusherStatus.toLowerCase() !== 'false';

        if (!isEnabled) {
            console.log("Pusher/Echo is disabled by config (REACT_APP_ENABLE_PUSHER=false).");
            return false;
        }

        return new Echo({
            broadcaster: 'pusher',
            key: "77327870f1b4de528ed0",
            cluster: "us2",
            forceTLS: true,
            authEndpoint: `${url}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            },
        });
    }, [url, getToken]);

    return { echoInstance };
};

export default useEchoBroadcast;
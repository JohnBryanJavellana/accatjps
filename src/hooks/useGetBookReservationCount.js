import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetCurrentUser from './useGetCurrentUser';
import useGetToken from './useGetToken';
import useSystemURLCon from './useSystemURLCon';

const useGetBookReservationCount = (useCurrentUser = false, customUrl, prefix = '', useNow = true) => {
    const { getToken, removeToken } = useGetToken();
    const navigate = useNavigate();
    const { userData } = useGetCurrentUser();
    const { url } = useSystemURLCon();
    const [reservationCount, setReservationCount] = useState([]);

    const GetBookReservationCount = async () => {
        try {
            const token = getToken('csrf-token');
            const response = await axios.post(`${url}${prefix}/${customUrl}`, {
                userId: useCurrentUser ? userData?.id : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReservationCount(response.data.reservationCount);
        } catch (error) {
            removeToken('csrf-token');
            navigate('/access-denied');
        }
    };

    useEffect(() => {
        if (userData && customUrl) {
            useNow && GetBookReservationCount();
        }
    }, [useCurrentUser, customUrl, userData, useNow]);

    return { reservationCount, refreshCount: GetBookReservationCount };
}

export default useGetBookReservationCount;
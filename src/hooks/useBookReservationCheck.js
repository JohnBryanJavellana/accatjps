import { useEffect, useState } from 'react';
import useSystemURLCon from './useSystemURLCon';
import axios from 'axios';
import useGetToken from './useGetToken';
import { useNavigate } from 'react-router-dom';

const useBookReservationCheck = (customUrl, mainData) => {
    const { getToken, removeToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [bookReservationCheck, setBookReservationCheck] = useState(null);

    const BookReservationCheck = async () => {
        try {
            const token = getToken('csrf-token');
            const response = await axios.post(`${url}/${customUrl}`, {
                userId: mainData.userId,
                libraryId: mainData.libraryId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log(response.data.bookReservationCheck);
            setBookReservationCheck(response.data.bookReservationCheck);
        } catch (error) {
            removeToken('csrf-token');
            navigate('/access-denied');
        }
    };

    useEffect(() => {
        if(mainData !== null) {
            BookReservationCheck();
        }    
    }, [mainData, customUrl]);

    return { bookReservationCheck, refreshCheck: BookReservationCheck };
}

export default useBookReservationCheck;
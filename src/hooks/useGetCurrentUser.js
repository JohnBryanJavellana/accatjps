import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetToken from './useGetToken';
import useSystemURLCon from './useSystemURLCon';

const useGetCurrentUser = () => {
    const [userData, setUserData] = useState(null);
    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const GetCurrentUser = useCallback(async () => {
        try {
            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/get-current-user/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(response.data.user_info);
            return response.data.user_info;
        } catch (error) {
            removeToken('access_token');
            removeToken('refresh_token');
            navigate('/access-denied');
        }
    }, []);

    useEffect(() => {
        GetCurrentUser();
    }, []);

    return { userData, refreshUser: GetCurrentUser };
};

export default useGetCurrentUser;
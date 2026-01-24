import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetToken from './useGetToken';
import useSystemURLCon from './useSystemURLCon';

const useGetCourses = () => {
    const [isFetchingCourses, setIsFetchingCourses] = useState(true);
    const [courses, setCourses] = useState([]);
    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const GetCourses = useCallback(async () => {
        try {
            setIsFetchingCourses(isFetchingCourses);

            const headers = {};
            const atoken = getToken('access_token');
            if (atoken) {
                headers['Authorization'] = `Bearer ${atoken}`;
            }

            const response = await axios.get(`${url}/authenticated/get-courses/`, {
                headers: headers
            });

            setCourses(response.data.courses);
            return response.data.courses;
        } catch (error) {
            setCourses([]);

            removeToken('access_token');
            removeToken('refresh_token');
            navigate('/access-denied');
        } finally {
            setIsFetchingCourses(false);
        }
    }, []);

    useEffect(() => {
        GetCourses();
    }, []);

    return { courses, isFetchingCourses, setIsFetchingCourses, refreshCourses: GetCourses };
};

export default useGetCourses;
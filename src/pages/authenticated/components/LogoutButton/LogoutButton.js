import axios from 'axios';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import useGetToken from '../../../../hooks/useGetToken';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className }) => {
    const { url } = useSystemURLCon();
    const { getToken, removeToken } = useGetToken();
    const [isProcessingLogout, setIsProcessingLogout] = useState(false);
    const { setShowLoader, SubmitLoadingAnim, setMethod } = useShowSubmitLoader();
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            const ask = window.confirm("Are you sure you want to logout?");
            if (!ask) return;

            setIsProcessingLogout(true);
            setShowLoader(true);
            setMethod('PROCESSING...');

            const atoken = getToken('access_token');
            const rtoken = getToken('refresh_token');

            await axios.post(`${url}/authenticated/logout`, {
                refresh_token: rtoken
            }, {
                headers: {
                    Authorization: `Bearer ${atoken}`,
                },
            });

            removeToken('access_token');
            removeToken('refresh_token');
            navigate('/');
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsProcessingLogout(false);
            setShowLoader(false);
        }
    }

    return (
        <>
            {
                (isProcessingLogout) &&
                <SubmitLoadingAnim cls={'loader'} place='OUT' />
            }

            <button onClick={() => logoutUser()} className={`btn btn-light elevation-1 btn-sm mt-1 ${className}`}>
                <i className="fas fa-sign-out-alt text-danger mr-1"></i> Logout
            </button>
        </>
    )
}

export default LogoutButton
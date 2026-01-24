import { Navigate, Outlet } from 'react-router-dom';
import useGetToken from '../hooks/useGetToken';

const GuestRoute = () => {
    const { getToken } = useGetToken();
    const isGuest = getToken('access_token');
    return !isGuest ? <Outlet /> : <Navigate to="/access-denied" />
}

export default GuestRoute;
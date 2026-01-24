import { Navigate, Outlet } from 'react-router-dom';
import useGetToken from '../hooks/useGetToken';

const PrivateRoute = () => {
    const { getToken } = useGetToken();
    const isPrivate = getToken('access_token');

    return isPrivate ? <Outlet /> : <Navigate to="/access-denied" />
}

export default PrivateRoute;
import { Navigate, Outlet } from 'react-router-dom';
import useGetToken from '../hooks/useGetToken';
import RoleAccess from '../hooks/RoleAccess';

const GuestRoute = () => {
    const { getToken } = useGetToken();
    const isGuest = getToken('csrf-token');
    const roleAccess = RoleAccess();

    return !isGuest ? <Outlet /> : <Navigate to={`/welcome/${roleAccess}/`} />
}

export default GuestRoute;  
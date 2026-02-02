import { useEffect, useState } from 'react';
import useGetToken from '../hooks/useGetToken';

const RoleAccess = () => {
    const { getToken } = useGetToken();
    const [role, setRole] = useState('');

    const GenerateRole = async () => {
        const roleAccess = getToken('role-access');

        if (['SUPERADMIN', 'ADMIN-DORMITORY', 'ADMIN-LIBRARY', 'CASHIER', 'ADMIN-ENROLLMENT'].includes(roleAccess)) {
            setRole('admin');
        } else if (['TRAINEE'].includes(roleAccess)) {
            setRole('trainee');
        } else if (['TRAINER'].includes(roleAccess)) {
            setRole('trainer');
        } else { }
    }

    useEffect(() => {
        GenerateRole();
        return () => { };
    }, [getToken]);

    return role;
}

export default RoleAccess;
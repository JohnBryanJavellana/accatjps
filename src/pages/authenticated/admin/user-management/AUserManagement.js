import React, { useEffect, useState } from 'react'
import useGetToken from '../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import CustomDataTable from '../../components/CustomDataTable/CustomDataTable';
import DropdownMenu from '../../components/DropdowMenu';
import { Chip } from '@mui/material';
import ViewUser from './components/ViewUser';
import UpdateUserActivation from './components/UpdateUserActivation';

const AUserManagement = () => {
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [users, setUsers] = useState([]);

    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        GetUsers(true);
        return () => { };
    }, []);

    const GetUsers = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/administrator/user-management/get-users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setUsers(response.data.users);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const tableColumns = [
        {
            name: "ID#",
            selector: row => row.id,
            sortable: true,
            width: "130px",
            style: { whiteSpace: "nowrap" },
        },
        {
            name: "Full Name",
            selector: row => `${row.first_name} ${row.middle_name} ${row.last_name} ${row.suffix}`,
            sortable: true,
            width: '350px'
        },
        {
            name: "Type",
            selector: row => row.role,
            sortable: true
        },
        {
            name: "Status",
            selector: row => row.account_status,
            cell: row => {
                const status = row.account_status;
                return <>
                    <Chip label={status} size='small' color={status === "APPROVED" ? 'success' : status === "VERIFICATION" ? 'warning' : 'error'} className='elevation-1 rounded' />
                </>
            },
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#view_user_info_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'onClick': () => {
                            setIsModalOpen('YES');
                            setModalData(row);
                            setModalOpenId(row.id);
                            setModalIndex(0);
                        },
                        'label': 'View User'
                    }
                ];

                if (!row.is_staff) {
                    menuItems.push({
                        'icon': 'create',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#update_account_approval_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'onClick': () => {
                            setIsModalOpen('YES');
                            setModalData(row);
                            setModalOpenId(row.id);
                            setModalIndex(1);
                        },
                        'label': 'Update Account Approval'
                    });
                }

                return <>
                    <DropdownMenu id={row.id} menuItems={menuItems} />
                </>
            },
            ignoreRowClick: true
        },
    ];

    return (
        <>
            {
                modalIndex === 0 &&
                <ViewUser
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`View User Information`}
                    callbackFunction={(e) => {
                        GetUsers(false);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                modalIndex === 1 &&
                <UpdateUserActivation
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Update Account Approval`}
                    callbackFunction={(e) => {
                        GetUsers(false);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            <div className="card">
                <div className="card-body">
                    {
                        isFetching
                            ? <SkeletonLoader onViewMode="update" />
                            : users.length > 0
                                ? <CustomDataTable
                                    progressPending={isFetching}
                                    columns={tableColumns}
                                    data={users}
                                    selectableRows={false}
                                    selectedRows={null}
                                /> : <div className='text-muted'>No Users Found.</div>
                    }
                </div>
            </div>
        </>
    )
}

export default AUserManagement;
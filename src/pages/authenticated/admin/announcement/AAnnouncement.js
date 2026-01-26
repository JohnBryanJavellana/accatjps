import React, { useEffect, useState } from 'react'
import useGetToken from '../../../../hooks/useGetToken';
import { Link, useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import axios from 'axios';
import ModalCUAnnouncement from './components/ModalCUAnnouncement';
import CustomDataTable from '../../components/CustomDataTable/CustomDataTable';
import useDateFormat from '../../../../hooks/useDateFormat';
import DropdownMenu from '../../components/DropdowMenu';
import ModalAnnouncement from './components/ModalAnnouncement';

const AAnnouncement = () => {
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url, urlWithoutToken } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const { formatDateToReadable } = useDateFormat();
    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        GetAnnouncements(true);
        return () => { };
    }, []);

    const DeleteDocument = async (id) => {
        try {
            let ask = window.confirm(`Are you sure you want to remove this announcement? This cannot be undone`);
            if (ask === false) return;

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('documentId', id);

            const response = await axios.post(`${url}/authenticated/administrator/announcement/remove-announcement`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                alert(response.data.message);
            }
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            GetAnnouncements(false);
        }
    }

    const GetAnnouncements = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.post(`${url}/authenticated/administrator/announcement/get-announcements/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setAnnouncements(response.data.announcements);
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
            name: "Attachment",
            cell: row => {
                return row.attachment ? <Link to={`${urlWithoutToken}${row.attachment}`} target='_blank'>
                    <img src={`${urlWithoutToken}${row.attachment}`} className='img-fluid' />
                </Link> : <>--</>
            },
            sortable: true,
            width: '130px'
        },
        {
            name: "Title",
            selector: row => row.title,
            sortable: true,
            width: '200px'
        },
        {
            name: "Description",
            selector: row => row.content,
            sortable: true,
            width: '350px'
        },
        {
            name: "Created at",
            selector: row => formatDateToReadable(row.created_at),
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => {
                const menuItems = [
                    {
                        'icon': 'visibility',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#announcement_info_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'onClick': () => {
                            setIsModalOpen('YES');
                            setModalData(row);
                            setModalOpenId(row.id);
                            setModalIndex(1);
                        },
                        'label': 'View Announcement'
                    },
                    {
                        'icon': 'create',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#announcement_cu_info_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'onClick': () => {
                            setIsModalOpen('YES');
                            setModalData(row);
                            setModalOpenId(row.id);
                            setModalIndex(0);
                        },
                        'label': 'Update Announcement'
                    },
                    {
                        'icon': 'delete',
                        'url': '#',
                        'data-toggle': '',
                        'data-target': ``,
                        'id': 'f',
                        'textColor': 'danger',
                        'onClick': () => {
                            DeleteDocument(row.id);
                        },
                        'label': 'Remove Announcement'
                    }
                ];

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
                !isFetching &&
                <div className="text-right mb-3">
                    <button data-toggle="modal" data-target={`#announcement_cu_info_0`} onClick={() => {
                        setIsModalOpen('YES');
                        setModalOpenId(0);
                        setModalIndex(0);
                        setModalData(null);
                    }} className="btn btn-success btn-sm elevation-1">
                        <i className="fas fa-plus mr-1"></i> Create Announcement
                    </button>
                </div>
            }

            <div className="card">
                <div className="card-body">
                    {
                        isFetching
                            ? <SkeletonLoader onViewMode={'update'} />
                            : <>
                                {
                                    modalIndex === 0 &&
                                    <ModalCUAnnouncement
                                        data={modalData}
                                        id={modalOpenId}
                                        modalTitle={`${modalData ? 'Update' : 'Create'} Announcement`}
                                        callbackFunction={(e) => {
                                            GetAnnouncements(false);
                                            setIsModalOpen('NO');
                                            setModalData(null);
                                            setModalIndex(null);
                                        }}
                                    />
                                }

                                {
                                    modalIndex === 1 &&
                                    <ModalAnnouncement
                                        data={modalData}
                                        id={modalOpenId}
                                        modalTitle={`View Announcement`}
                                        callbackFunction={(e) => {
                                            GetAnnouncements(false);
                                            setIsModalOpen('NO');
                                            setModalData(null);
                                            setModalIndex(null);
                                        }}
                                    />
                                }

                                {
                                    announcements.length > 0
                                        ? <CustomDataTable
                                            progressPending={isFetching}
                                            columns={tableColumns}
                                            data={announcements}
                                            selectableRows={false}
                                            selectedRows={null}
                                        /> : <div className='text-muted'>No Announcement Found.</div>
                                }
                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default AAnnouncement;
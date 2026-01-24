import React, { useState } from 'react'
import useGetToken from '../../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../../../hooks/useSystemURLCon';
import useGetCourses from '../../../../../../hooks/useGetCourses';
import DropdownMenu from '../../../../components/DropdowMenu';
import SkeletonLoader from '../../../../components/SkeletonLoader/SkeletonLoader';
import CustomDataTable from '../../../../components/CustomDataTable/CustomDataTable';
import axios from 'axios';
import ModalCourse from './components/ModalCourse';

const Courses = () => {
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [users, setUsers] = useState([]);

    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);
    const { courses, isFetchingCourses, setIsFetchingCourses, refreshCourses } = useGetCourses();

    const DeleteDocument = async (id, message, type) => {
        try {
            let ask = window.confirm(`Are you sure you want to remove this ${type} -- ${message}? This cannot be undone`);
            if (ask === false) return;

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('documentId', id);

            await axios.post(`${url}/authenticated/administrator/system-settings/remove-course`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetchingCourses(false);
            refreshCourses();
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
            name: "Course Name",
            selector: row => row.course_name,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#course_info_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'onClick': () => {
                            setIsModalOpen('YES');
                            setModalData(row);
                            setModalOpenId(row.id);
                            setModalIndex(0);
                        },
                        'label': 'Update Course'
                    }
                ];

                if (!row.is_used) {
                    menuItems.push({
                        'icon': 'delete',
                        'url': '#',
                        'id': 'f',
                        'textColor': 'danger',
                        'onClick': () => DeleteDocument(row.id, row.course_name, 'course'),
                        'label': 'Remove Course'
                    })
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
                <ModalCourse
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? 'Update' : 'Create'} Course`}
                    callbackFunction={(e) => {
                        setIsFetchingCourses(false);
                        refreshCourses();
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            <div className="card m-0 border-0 elevation- shadow-sm">
                <div className="card-header border border-light d-flex align-items-center justify-content-end">
                    <button className="btn btn-success btn-sm elevation-1" data-toggle="modal" data-target={`#course_info_0`} onClick={() => {
                        setIsModalOpen('YES');
                        setModalOpenId(0);
                        setModalIndex(0);
                        setModalData(null);
                    }}>
                        <i className="fas fa-plus mr-1"></i> Add Course
                    </button>
                </div>
                <div className="card-body">
                    {
                        isFetchingCourses
                            ? <SkeletonLoader onViewMode="update" />
                            : courses.length > 0
                                ? <CustomDataTable
                                    progressPending={isFetchingCourses}
                                    columns={tableColumns}
                                    data={courses}
                                    selectableRows={false}
                                    selectedRows={null}
                                /> : <div className='text-muted text-center'>No Courses Found.</div>
                    }
                </div>
            </div>
        </>
    )
}

export default Courses
import React, { useEffect, useMemo, useState } from 'react'
import useGetToken from '../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import TablePaginationTemplate from '../../components/TablePaginationTemplate';
import { Badge, Chip, FormControl, IconButton, InputLabel, OutlinedInput, Stack, Tooltip } from '@mui/material';
import useDateFormat from '../../../../hooks/useDateFormat';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import TimeAgo from 'react-timeago';
import './AJobPosts.css';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import AViewJobPost from './components/AViewJobPost';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import LaunchIcon from '@mui/icons-material/Launch';
import ChatIcon from '@mui/icons-material/Chat';
import AViewJobStatus from './components/AViewJobStatus';
import useGetApplicationStatusColor from '../../../../hooks/useGetApplicationStatusColor';
import AJobChat from './components/AJobChat';
import useGetCurrentUser from '../../../../hooks/useGetCurrentUser';

const AppliedJobs = () => {
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [applicableJobs, setApplicableJobs] = useState([]);
    const { formatDateToReadable } = useDateFormat();
    const { FormatNumber } = useFormatNumber();
    const [searchText, setSearchText] = useState('');
    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);
    const { getStatusColor } = useGetApplicationStatusColor();
    const [page, setPage] = useState(0);
    const { userData } = useGetCurrentUser();
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        if (userData) {
            GetAppliedJobs(true);
            return () => { };
        }
    }, [userData]);

    const GetAppliedJobs = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/job-seeker/get-applied-jobs/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setApplicableJobs(response.data.jobpost);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const filteredApplicableJobs = useMemo(() => {
        if (!searchText.trim()) return applicableJobs;
        const term = searchText.toLowerCase();

        return applicableJobs.filter(job => {
            return job?.title.toLowerCase().includes(term) ||
                job?.summary.toLowerCase().includes(term);
        });
    }, [searchText, applicableJobs]);

    return (
        <>
            {
                isFetching
                    ? <SkeletonLoader />
                    : applicableJobs.length > 0
                        ? <>
                            <FormControl fullWidth size='small' variant="outlined">
                                <InputLabel htmlFor="searchText">Search</InputLabel>
                                <OutlinedInput
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    id="searchText"
                                    type="search"
                                    label="Search"
                                />
                            </FormControl>

                            {
                                modalIndex === 0 &&
                                <AViewJobPost
                                    data={modalData}
                                    id={modalOpenId}
                                    modalTitle={`Job Post Details`}
                                    callbackFunction={() => {
                                        GetAppliedJobs(false);
                                        setIsModalOpen('NO');
                                        setModalData(null);
                                        setModalIndex(null);
                                    }}
                                    isViewOnly={true}
                                />
                            }

                            {
                                modalIndex === 1 &&
                                <AViewJobStatus
                                    data={modalData}
                                    id={modalOpenId}
                                    modalTitle={`Job Post Status`}
                                    callbackFunction={() => {
                                        GetAppliedJobs(false);
                                        setIsModalOpen('NO');
                                        setModalData(null);
                                        setModalIndex(null);
                                    }}
                                />
                            }

                            {
                                modalIndex === 2 &&
                                <AJobChat
                                    data={modalData}
                                    id={modalOpenId}
                                    modalTitle={`Job Post Chat`}
                                    callbackFunction={() => {
                                        GetAppliedJobs(false);
                                        setIsModalOpen('NO');
                                        setModalData(null);
                                        setModalIndex(null);
                                    }}
                                    fromSenderId={userData?.id}
                                    toSenderId={modalData?.posted_by.id}
                                />
                            }

                            {
                                filteredApplicableJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                                    <>
                                        <div className='card mt-3 job_container' key={index}>
                                            <div className="card-header py-1 border border-light d-flex align-items-center justify-content-end">
                                                <Stack spacing={2} direction="row">
                                                    <Tooltip title="View Job Post">
                                                        <IconButton data-toggle="modal" data-target={`#view_job_post_${job.id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalOpenId(job.id);
                                                            setModalIndex(0);
                                                            setModalData(job);
                                                        }} color="success">
                                                            <InfoOutlineIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Chat">
                                                        <IconButton data-toggle="modal" data-target={`#job_chat_info_${job.id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalOpenId(job.id);
                                                            setModalIndex(2);
                                                            setModalData(job);
                                                        }} color="warning">
                                                            <ChatIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="View Applied Job">
                                                        <IconButton color="primary" data-toggle="modal" data-target={`#view_job_status_${job.id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalOpenId(job.id);
                                                            setModalIndex(1);
                                                            setModalData(job);
                                                        }}>
                                                            <LaunchIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </div>

                                            <div className="card-body text-sm">
                                                <div className="row">
                                                    <div className="col-9">
                                                        <div className="row">
                                                            <div className="col-xl-12 text-bold h5">
                                                                {job?.title}
                                                            </div>

                                                            <div className="col-xl-12 text-muted">
                                                                {job?.posted_by.business_details?.business_name || '--'}
                                                            </div>

                                                            <div className="col-xl-12 text-muted">
                                                                {job?.work_type}
                                                            </div>

                                                            <div className="col-xl-12 text-muted">
                                                                {job?.location}
                                                            </div>

                                                            <div className="col-xl-12 text-muted">
                                                                {`${job?.pay_range_details?.currency}${FormatNumber(job?.pay_range_details?.from_amount)} - ${job?.pay_range_details?.currency}${FormatNumber(job?.pay_range_details?.to_amount)}`}
                                                            </div>

                                                            <div className="col-xl-12 text-muted mt-2">
                                                                <Chip label={job?.application_status} size='small' color={getStatusColor(job?.application_status)} className='elevation-1 rounded' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 mb-2 text-center" style={{ height: 100, overflow: 'hidden' }}>
                                                        <img
                                                            src={job?.posted_by?.profile_picture}
                                                            alt="Profile"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }

                            <TablePaginationTemplate
                                dataset={filteredApplicableJobs}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[12, 24, 36, 50]}
                                page={page}
                                labelRowsPerPage={"Job Posts per page:"}
                                callbackFunction={(e) => {
                                    setRowsPerPage(e.rows);
                                    setPage(e.page);
                                }}
                            />
                        </> : <div className='text-center text-muted mt-3'>
                            There is no applied jobs for you right now.
                        </div>
            }
        </>
    )
}

export default AppliedJobs;
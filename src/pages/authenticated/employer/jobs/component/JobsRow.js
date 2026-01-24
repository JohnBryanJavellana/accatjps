import React, { useEffect, useMemo, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import useGetToken from '../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TablePaginationTemplate from '../../../components/TablePaginationTemplate';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { FormControl, IconButton, InputLabel, OutlinedInput, Stack, Tooltip } from '@mui/material';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import useDateFormat from '../../../../../hooks/useDateFormat';
import UpdateJobPost from './UpdateJobPost';

const JobsRow = ({ statusses, userData }) => {
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [jobAds, setJobAds] = useState([]);
    const { formatDateToReadable } = useDateFormat();
    const [searchText, setSearchText] = useState('');

    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    const GetJobPosts = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const formData = new FormData();
            formData.append('statusses', statusses);

            const response = await axios.post(`${url}/authenticated/employer/jobs`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setJobAds(response.data.jobpost);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const DeleteDocument = async (id) => {
        try {
            let ask = window.confirm(`Are you sure you want to remove this job post? This cannot be undone`);
            if (ask === false) return;

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('documentId', id);

            const response = await axios.post(`${url}/authenticated/employer/jobs/remove`, formData, {
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
            GetJobPosts(false);
        }
    }

    useEffect(() => {
        if (userData) {
            GetJobPosts(true);
            return () => { };
        }
    }, [userData, statusses]);

    const filteredJobAds = useMemo(() => {
        if (!searchText.trim()) return jobAds;
        const term = searchText.toLowerCase();

        return jobAds.filter(penalty => {
            return penalty?.title.toLowerCase().includes(term) ||
                penalty?.summary.toLowerCase().includes(term);
        });
    }, [searchText, jobAds]);

    return (
        <>
            {
                modalIndex === 0 &&
                <UpdateJobPost
                    id={modalOpenId}
                    data={modalData}
                    modalTitle={"Update Job Post"}
                    callbackFunction={() => {
                        GetJobPosts(false);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                isFetching
                    ? <SkeletonLoader />
                    : jobAds.length > 0
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
                                filteredJobAds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                                    <>
                                        <div className='card mt-3' key={index}>
                                            <div className="card-header py-1 border border-light d-flex align-items-center justify-content-end">
                                                <Stack spacing={2} direction="row">
                                                    {
                                                        !job.has_alumni_connection && <>
                                                            <Tooltip title="Remove Job Post">
                                                                <IconButton onClick={() => DeleteDocument(job.id)} color="error">
                                                                    <DeleteIcon fontSize="inherit" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    }

                                                    <Tooltip title="Update Job Post">
                                                        <IconButton data-toggle="modal" data-target={`#update_job_post_${job.id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalIndex(0);
                                                            setModalOpenId(job.id);
                                                            setModalData(job);
                                                        }} color="warning">
                                                            <EditIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="View Job Post">
                                                        <IconButton color="success" onClick={() => navigate(`/welcome/employer/jobs/${job?.id}`)}>
                                                            <LaunchIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </div>

                                            <div className="card-body text-sm">
                                                <div className="row">
                                                    <div className="col-xl-12 text-bold">
                                                        {job?.title}
                                                    </div>

                                                    <div className="col-xl-12">
                                                        {job?.summary}
                                                    </div>

                                                    <div className="col-xl-12 mt-2 text-muted">
                                                        Created {formatDateToReadable(job?.created_at)}
                                                    </div>

                                                    <div className="col-xl-12">
                                                        With Candidates: {job?.has_alumni_connection ? 'YES' : 'NO'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }

                            <TablePaginationTemplate
                                dataset={filteredJobAds}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[12, 24, 36, 50]}
                                page={page}
                                labelRowsPerPage={"Job Posts per page:"}
                                callbackFunction={(e) => {
                                    setRowsPerPage(e.rows);
                                    setPage(e.page);
                                }}
                            />
                        </> : <div className='text-center text-muted'>
                            You haven't created a {String(statusses).toLowerCase()} job post yet.
                        </div>
            }
        </>
    )
}

export default JobsRow;
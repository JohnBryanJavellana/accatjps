import React, { useEffect, useMemo, useState } from 'react'
import useGetToken from '../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import TablePaginationTemplate from '../../components/TablePaginationTemplate';
import { Badge, Chip, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import useDateFormat from '../../../../hooks/useDateFormat';
import axios from 'axios';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import TimeAgo from 'react-timeago';
import './AJobPosts.css';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import AViewJobPost from './components/AViewJobPost';

const AJobSavedPosts = () => {
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

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        GetApplicableJobs(true);
        return () => { };
    }, []);

    const GetApplicableJobs = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/job-seeker/get-saved-jobs/`, {
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
                                        GetApplicableJobs(false);
                                        setIsModalOpen('NO');
                                        setModalData(null);
                                        setModalIndex(null);
                                    }}
                                />
                            }

                            {
                                filteredApplicableJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                                    <>
                                        <div className='card mt-3 job_container' key={index} data-toggle="modal" data-target={`#view_job_post_${job.id}`} onClick={() => {
                                            setIsModalOpen('YES');
                                            setModalOpenId(job.id);
                                            setModalIndex(0);
                                            setModalData(job);
                                        }}>
                                            <div className="card-body text-sm">
                                                <div className="row">
                                                    <div className="col-xl-10">
                                                        <div className="row">
                                                            <div className="col-xl-12 text-bold h5">
                                                                {job?.title}
                                                            </div>

                                                            {
                                                                job.is_highly_recommended && <>
                                                                    <div className="col-xl-12 mb-3 d-flex align-items-center">
                                                                        <Chip label="Recommended for you" size='small' color='success' className='elevation-1 rounded' />
                                                                        <span className="material-icons-outlined ml-1">{job.is_bookmarked ? 'bookmark' : 'bookmark_border'}</span>
                                                                    </div>
                                                                </>
                                                            }

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
                                                                <TimeAgo date={job.created_at} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-2 text-center">
                                                        <img src={job?.posted_by.profile_picture} className='shadow-sm' height={80} />
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
                            There is no saved job posts for you right now.
                        </div>
            }
        </>
    )
}

export default AJobSavedPosts;
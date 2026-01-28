import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useGetToken from '../../../hooks/useGetToken';
import useSystemURLCon from '../../../hooks/useSystemURLCon';
import useFormatNumber from '../../../hooks/useFormatNumber';
import SkeletonLoader from '../../authenticated/components/SkeletonLoader/SkeletonLoader';
import GoogleMapLocationPicker from '../../authenticated/components/GoogleMapLocationPicker/GoogleMapLocationPicker';
import { Chip, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import AViewJobPost from '../../authenticated/alumni/jobs/components/AViewJobPost';
import TablePaginationTemplate from '../../authenticated/components/TablePaginationTemplate';
import TimeAgo from 'react-timeago';
import { locale } from 'dayjs';

const Jobs = () => {
    const navigate = useNavigate();
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [applicableJobs, setApplicableJobs] = useState([]);
    const { FormatNumber } = useFormatNumber();
    const [searchText, setSearchText] = useState('');
    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);

    const [location, setLocation] = useState("");
    const [locationCoordinates, setLocationCoordinates] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        GetApplicableJobs(true);
        return () => { };
    }, []);

    const GetApplicableJobs = async (isInitialLoad, forcedLocation = null) => {
        try {
            setIsFetching(isInitialLoad);
            const locationToPass = forcedLocation !== null ? forcedLocation : location;

            const response = await axios.post(`${url}/authenticated/job-seeker/get-applicable-jobs`, {
                location_coordinates: locationToPass
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
            <div className="guest-bg">
                <div className="container">
                    {
                        isFetching
                            ? <SkeletonLoader onViewMode={'update'} />
                            : <>
                                <div className="row">
                                    <div className="col-xl-5 mb-2">
                                        <GoogleMapLocationPicker defaultValue={{
                                            location: location,
                                            coordinates: locationCoordinates
                                        }} size={'small'} margin='' callbackFunction={(e) => {
                                            if (e.coordinates) {
                                                setLocation(e.location);
                                                setLocationCoordinates(e.coordinates);
                                            }
                                        }} />
                                    </div>

                                    <div className="col-xl-4 mb-2">
                                        <button onClick={() => {
                                            setLocation("");
                                            setLocationCoordinates("");
                                            GetApplicableJobs(true, "");
                                        }} className="btn btn-md elevation-1 btn-default mr-1">
                                            <div className="d-flex align-items-center">
                                                <span className="material-icons-outlined mr-1">restart_alt</span> Reset
                                            </div>
                                        </button>

                                        <button onClick={() => GetApplicableJobs(true)} className="btn btn-md elevation-1 btn-success" disabled={!location || !locationCoordinates}>
                                            <div className="d-flex align-items-center">
                                                <span className="material-icons-outlined mr-1">filter_alt</span> Filter
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {
                                    applicableJobs.length > 0
                                        ? <>
                                            <div className="row">
                                                <div className="col-xl-12">
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
                                                </div>
                                            </div>

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
                                                    isViewOnly={true}
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
                                                            <div className="card-body text-sm pb-2">
                                                                <div className="row">
                                                                    <div className="col-xl-10 mb-2">
                                                                        <div className="row">
                                                                            <div className="col-xl-12 text-bold text-dark h5">
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
                                                                                <TimeAgo locale="en" date={job.created_at} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xl-2 text-center mb-2">
                                                                        <img src={job?.posted_by.profile_picture} className='elevation-1' height={80} />
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
                                            There is no job posts for you right now.
                                        </div>
                                }
                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default Jobs
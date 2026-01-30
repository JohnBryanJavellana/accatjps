/* global $ */
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import TablePaginationTemplate from '../../../components/TablePaginationTemplate';
import { FormControl, IconButton, InputLabel, OutlinedInput, Stack, Tooltip } from '@mui/material';
import ViewUser from '../../../admin/user-management/components/ViewUser';
import ChatIcon from '@mui/icons-material/Chat';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import EditIcon from '@mui/icons-material/Edit';
import UpdateCandidateApplication from './components/UpdateCandidateApplication';
import useGetCurrentUser from '../../../../../hooks/useGetCurrentUser';
import AJobChat from '../../../alumni/jobs/components/AJobChat';

const Candidates = ({ jobId, callbackFunction, modalDefaultOpenId = null }) => {
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState(true);
    const [candidates, setCandidates] = useState(null);
    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [searchText, setSearchText] = useState('');

    const GetJobCandidates = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/employer/jobs/${jobId}/get-candidates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setCandidates(response.data.jobCandidates);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (jobId && userData) {
            GetJobCandidates(true);
            return () => { };
        }

        return () => {
            setCandidates([]);
        };
    }, [jobId, userData]);

    useEffect(() => {
        if (modalDefaultOpenId) {
            setSearchText(String(modalDefaultOpenId));
        }
    }, [modalDefaultOpenId]);

    const filteredCandidates = useMemo(() => {
        if (!searchText.trim()) return candidates;
        const term = searchText.toLowerCase();

        return candidates.filter(candidate => {
            return candidate?.first_name.toLowerCase().includes(term) ||
                candidate?.middle_name.toLowerCase().includes(term) ||
                candidate?.last_name.toLowerCase().includes(term) ||
                candidate?.suffix.toLowerCase().includes(term) ||
                String(candidate?.application_id).toLowerCase().includes(term) ||
                candidate?.ai_prediction.toLowerCase().includes(term) ||
                candidate?.application_status.toLowerCase().includes(term);
        });
    }, [searchText, candidates]);

    return (
        <>
            {
                isFetching || !userData
                    ? <SkeletonLoader onViewMode={'update'} />
                    : candidates.length > 0
                        ? <>
                            {
                                modalIndex === 0 &&
                                <ViewUser
                                    data={modalData}
                                    id={modalOpenId}
                                    modalTitle={`View Candidate Information`}
                                    callbackFunction={(e) => {
                                        GetJobCandidates(false);
                                        setIsModalOpen('NO');
                                        setModalData(null);
                                        setModalIndex(null);
                                    }}
                                />
                            }

                            {
                                modalIndex === 1 &&
                                <UpdateCandidateApplication
                                    data={modalData}
                                    id={modalOpenId}
                                    modalTitle={`View Candidate Information`}
                                    callbackFunction={(e) => {
                                        GetJobCandidates(false);
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
                                        GetJobCandidates(false);
                                        setIsModalOpen('NO');
                                        setModalData(null);
                                        setModalIndex(null);
                                    }}
                                    fromSenderId={userData?.id}
                                    toSenderId={modalData?.id}
                                />
                            }

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
                                filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                                    <>
                                        <div className='card mt-3' key={index}>
                                            <div className="card-header py-1 border border-light d-flex align-items-center justify-content-end">
                                                <Stack spacing={2} direction="row">
                                                    <Tooltip title="Update Job Post">
                                                        <IconButton data-toggle="modal" data-target={`#view_user_info_${job.application_id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalIndex(0);
                                                            setModalOpenId(job.application_id);
                                                            setModalData(job);
                                                        }} color="warning">
                                                            <AccessibilityIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Chat">
                                                        <IconButton data-toggle="modal" id={`job_chat_info_btn_${job.application_id}`} data-target={`#job_chat_info_${job.application_id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalOpenId(job.application_id);
                                                            setModalIndex(2);
                                                            setModalData(job);
                                                        }} color="warning">
                                                            <ChatIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Update Candidate Application Status">
                                                        <IconButton color="success" data-toggle="modal" data-target={`#update_application_status_${job.application_id}`} onClick={() => {
                                                            setIsModalOpen('YES');
                                                            setModalIndex(1);
                                                            setModalOpenId(job.application_id);
                                                            setModalData(job);
                                                        }}>
                                                            <EditIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </div>

                                            <div className="card-body text-sm">
                                                <div className="row">
                                                    <div className="col-md-3 mb-2 text-center border-right">
                                                        <img
                                                            src={job.profile_picture}
                                                            alt="User"
                                                            className="img-circle elevation-1 mb-2"
                                                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                                        />
                                                        <div className="text-bold">{job.first_name} {job.last_name}</div>
                                                        <div className="text-muted text-xs">{job.email}</div>
                                                    </div>

                                                    <div className="col-md-7 px-4">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="text-bold mr-2">AI Screening:</span>
                                                            {job.is_ai_recommended ? (
                                                                <span className="badge badge-success elevation-1">
                                                                    <i className="fas fa-robot mr-1"></i> {job.ai_prediction}
                                                                </span>
                                                            ) : (
                                                                <span className="badge badge-secondary">{job.ai_prediction}</span>
                                                            )}
                                                            <span className="ml-auto text-muted text-xs">
                                                                <i className="far fa-clock mr-1"></i> Applied on: {job.applied_on}
                                                            </span>
                                                        </div>

                                                        <div className="row mt-3">
                                                            <div className="col-6">
                                                                <ul className="list-unstyled text-xs">
                                                                    <li><strong>Communication:</strong> {job.scale_profile?.communication_skills}/5</li>
                                                                    <li><strong>Mental Alertness:</strong> {job.scale_profile?.mental_alertness}/5</li>
                                                                    <li><strong>Appearance:</strong> {job.scale_profile?.general_appearance}/5</li>
                                                                </ul>
                                                            </div>
                                                            <div className="col-6">
                                                                <ul className="list-unstyled text-xs">
                                                                    <li><strong>Confidence:</strong> {job.scale_profile?.self_confidence}/5</li>
                                                                    <li><strong>Ability to Present:</strong> {job.scale_profile?.ability_to_present_ideas}/5</li>
                                                                    <li><strong>Performance:</strong> {job.scale_profile?.student_performance_rating}/5</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-2 text-right">
                                                        <div className="mb-2">
                                                            <span className={`badge ${job.application_status === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>
                                                                {job.application_status}
                                                            </span>
                                                        </div>

                                                        <div className="btn-group-vertical w-100">
                                                            {job.resume_url && (
                                                                <a href={job.resume_url} target="_blank" rel="noreferrer" className="btn btn-outline-danger btn-xs mb-1">
                                                                    <i className="fas fa-file-pdf mr-1"></i> View Resume
                                                                </a>
                                                            )}
                                                            {job.cover_letter_url && (
                                                                <a href={job.cover_letter_url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-xs">
                                                                    <i className="fas fa-envelope mr-1"></i> Cover Letter
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }

                            <TablePaginationTemplate
                                dataset={filteredCandidates}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[12, 24, 36, 50]}
                                page={page}
                                labelRowsPerPage={"Job Candidates per page:"}
                                callbackFunction={(e) => {
                                    setRowsPerPage(e.rows);
                                    setPage(e.page);
                                }}
                            />
                        </> : <div className='text-center text-muted'>
                            You do not have job candidates right now.
                        </div>
            }
        </>
    )
}

export default Candidates;
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import useDateFormat from '../../../../../hooks/useDateFormat';
import useFormatNumber from '../../../../../hooks/useFormatNumber';

const JobDetails = ({ jobId, callbackFunction }) => {
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [jobDetails, setJobDetails] = useState(null);
    const { formatDateToReadable } = useDateFormat();
    const { FormatNumber } = useFormatNumber();

    const GetJob = async () => {
        try {
            setIsFetching(true);

            const token = getToken('access_token');

            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.get(`${url}/authenticated/employer/jobs/${jobId}`, {
                headers: headers
            });

            console.log(response.data.job);
            setJobDetails(response.data.job);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        GetJob();
        return () => { };
    }, [jobId]);

    return (
        <>
            {
                isFetching
                    ? <SkeletonLoader onViewMode={'update'} />
                    : <div className="container-fluid">
                        <div className="row mb-3 bg-light p-3 border-rounded">
                            <div className="col-md-8">
                                <h5 className="text-success mb-1"><strong>{jobDetails?.title}</strong></h5>
                                <div className="text-muted">
                                    <i className="fas fa-building mr-1"></i> {jobDetails?.company_name} |
                                    <i className="fas fa-map-marker-alt mx-1"></i> {jobDetails?.location}
                                </div>
                                <div className="text-muted">For: {jobDetails?.course_name}</div>
                            </div>
                            <div className="col-md-4 text-right">
                                {jobDetails?.is_highly_recommended && (
                                    <span className="badge badge-success px-3 py-2 mb-2">
                                        <i className="fas fa-star mr-1"></i> {jobDetails?.match_percentage}% Match - Highly Recommended
                                    </span>
                                )}
                                <div>
                                    <span className="badge px-2 py-1 badge-info mr-1">{jobDetails?.work_type}</span>
                                    <span className="badge px-2 py-1 badge-secondary">{jobDetails?.workplace_option}</span>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-8">
                                <h6 className="text-bold border-bottom pb-3">Job Summary</h6>
                                <p>{jobDetails?.summary}</p>

                                <h6 className="text-bold border-bottom pb-3 mt-4">Full Description</h6>
                                <div className="text-justify" style={{ whiteSpace: 'pre-line' }}>
                                    {jobDetails?.description}
                                </div>

                                <h6 className="text-bold border-bottom pb-3 mt-4">Minimum Requirements (Scale)</h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li><span className='text-bold'>Appearance:</span> {jobDetails?.min_general_appearance}/5</li>
                                            <li><span className='text-bold'>Speaking:</span> {jobDetails?.min_manner_of_speaking}/5</li>
                                            <li><span className='text-bold'>Physical:</span> {jobDetails?.min_physical_condition}/5</li>
                                            <li><span className='text-bold'>Mental Alertness:</span> {jobDetails?.min_mental_alertness}/5</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li><span className='text-bold'>Self Confidence:</span> {jobDetails?.min_self_confidence}/5</li>
                                            <li><span className='text-bold'>Presenting Ideas:</span> {jobDetails?.min_ability_to_present_ideas}/5</li>
                                            <li><span className='text-bold'>Communication:</span> {jobDetails?.min_communication_skills}/5</li>
                                            <li><span className='text-bold'>Performance:</span> {jobDetails?.min_student_performance_rating}/5</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 bg-light p-5">
                                <h6 className="text-bold">Salary & Pay</h6>
                                <p className="text-success text-md mb-0">
                                    <strong>{jobDetails?.pay_range_details?.currency}{FormatNumber(jobDetails?.pay_range_details?.from_amount)} - {jobDetails?.pay_range_details?.currency}{FormatNumber(jobDetails?.pay_range_details?.to_amount)}</strong>
                                </p>
                                <p className="text-muted small">Pay Cycle: {jobDetails?.pay_type}</p>

                                <hr />

                                <h6 className="text-bold">Posted By</h6>
                                <div className="d-flex align-items-center mt-3">
                                    <img
                                        src={jobDetails?.posted_by?.profile_picture}
                                        className="img-circle elevation-1 mr-3"
                                        alt="User"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <p className="mb-0 text-bold">{jobDetails?.posted_by?.first_name} {jobDetails?.posted_by?.last_name}</p>
                                        <p className="text-muted small mb-0">{jobDetails?.posted_by?.business_details?.business_name}</p>
                                    </div>
                                </div>
                                <div className="mt-3 small">
                                    <p className="mb-1"><i className="fas fa-envelope mr-2"></i> {jobDetails?.posted_by?.email}</p>
                                    <p className="mb-1"><i className="fas fa-phone mr-2"></i> {jobDetails?.posted_by?.contact_number}</p>
                                    <p className="mb-1"><i className="fas fa-globe mr-2"></i> {jobDetails?.posted_by?.business_details?.country}</p>
                                </div>

                                <hr />

                                <div className="text-muted small italic text-center">
                                    Posted on {formatDateToReadable(jobDetails?.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default JobDetails;
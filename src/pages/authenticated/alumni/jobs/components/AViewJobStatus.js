/* global $ */
import { useEffect, useState } from 'react';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';

const AViewJobStatus = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [preStatus, setPreStatus] = useState("");
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");

    const handleClose = () => {
        callbackFunction(false);
        $(`#view_job_status_${id}`).modal('hide');
    }

    const STATUS_ORDER = {
        "PENDING": 1,
        "IN REVIEW": 2,
        "INTERVIEW": 3,
        "HIRED": 4,
        "REJECTED": 4,
        "FINISHED": 5
    };

    const statusOptions = [
        { label: "Pending", value: "PENDING" },
        { label: "In Review", value: "IN REVIEW" },
        { label: "Interview", value: "INTERVIEW" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Hired", value: "HIRED" },
        { label: "Finished", value: "FINISHED" },
    ];

    const UpdateApplicationStatus = async () => {
        try {
            const ask = window.confirm("Are you sure you want to withdraw application? This cannot be undone.");
            if (!ask) return;

            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('applicationId', data.application_id);
            formData.append('status', "WITHDRAWN");

            const response = await axios.post(`${url}/authenticated/application/update-status`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                if (response.data.reloggin) {
                    alert(response.data.message);

                    removeToken('access_token');
                    removeToken('refresh_token');
                    navigate('/');
                }
            }
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            handleClose();
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        console.log("data: ... ", data);

        if (data) {
            setPreStatus(data?.application_status);
            setStatus(data?.application_status);
        }
    }, [data]);


    return (
        <>
            <ModalTemplate
                id={`view_job_status_${id}`}
                size={'md'}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pb-2 text-sm'}
                body={
                    isSubmitting
                        ? <SkeletonLoader onViewMode={'update'} />
                        : <div className="container-fluid py-2">
                            <div className="row mb-4">
                                <div className="col-12">
                                    <label className="text-muted"><i className="fas fa-info-circle mr-1"></i> Current Application Status</label>
                                    <div className="p-3 border rounded bg-light d-flex align-items-center">
                                        <div className="mr-3">
                                            <i className={`fas fa-circle fa-2x ${data.application_status === 'REJECTED' ? 'text-danger' :
                                                data.application_status === 'HIRED' ? 'text-success' : 'text-primary'
                                                } pulse-animation`}></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-bold">{data.application_status}</h6>
                                            <small className="text-muted">Last updated: {data.created_at}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="form-group mb-0">
                                        <label className="text-muted"><i className="fas fa-comment-dots mr-1"></i> Employer Remarks / Instructions</label>
                                        <div className="p-3 border rounded shadow-none" style={{ backgroundColor: '#fffbe6', minHeight: '80px', borderLeft: '4px solid #ffe58f !important' }}>
                                            {data.remarks ? (
                                                <span className="text-dark">{data.remarks}</span>
                                            ) : (
                                                <span className="text-muted italic">No remarks provided by the employer yet.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12">
                                    <label className="text-muted"><i className="fas fa-tasks mr-1"></i> Manage Application</label>
                                    <div className="p-2 border rounded border-dashed text-center">
                                        {['PENDING', 'IN REVIEW', 'INTERVIEW'].includes(data.application_status) ? (
                                            <div className="py-2">
                                                <p className="text-xs text-muted mb-2">Changed your mind? You can withdraw your application before a final decision is made.</p>
                                                <button
                                                    className="btn btn-outline-danger btn-sm px-4"
                                                    onClick={() => UpdateApplicationStatus()}
                                                >
                                                    <i className="fas fa-user-times mr-1"></i> Withdraw Application
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-2">
                                                <i className="fas fa-lock text-muted mb-2"></i>
                                                <p className="mb-0 text-sm text-bold">This application is now {data.application_status.toLowerCase()}.</p>
                                                <p className="text-xs text-muted">Status updates are disabled for completed applications.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-12">
                                    <small className="text-muted text-xs uppercase">Posted By</small>
                                    <div className="d-flex align-items-center mt-1">
                                        <img src={data.posted_by.profile_picture} className="img-circle mr-2" style={{ width: '25px', height: '25px', objectFit: 'cover' }} alt="Employer" />
                                        <span className="text-sm">{data.posted_by.business_details.business_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                footer={
                    <>
                        <button type='button' className='btn-sm btn btn-default elevation-1' disabled={isSubmitting} onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>
                    </>
                }
            />
        </>
    )
}

export default AViewJobStatus;
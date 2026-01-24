/* global $ */
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useGetToken from '../../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../../hooks/useSystemURLCon';
import ModalTemplate from '../../../../components/ModalTemplate/ModalTemplate';

const UpdateCandidateApplication = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preStatus, setPreStatus] = useState("");
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const handleClose = () => {
        callbackFunction(false);
        $(`#update_application_status_${id}`).modal('hide');
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
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('applicationId', data.application_id);
            formData.append('status', status);
            formData.append('remarks', remarks);

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
        if (data) {
            setPreStatus(data?.application_status);
            setStatus(data?.application_status);
        }
    }, [data]);

    return (
        <>
            <ModalTemplate
                id={`update_application_status_${id}`}
                isModalCentered={true}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pt-1 pb-2'}
                body={
                    <>
                        <FormControl fullWidth margin='dense'>
                            <InputLabel id="demo-simple-status-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-status-label"
                                id="demo-simple-status"
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                                MenuProps={{
                                    disableScrollLock: true,
                                    container: () => document.getElementById(`update_application_status_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Select Status</em>
                                </MenuItem>
                                {statusOptions
                                    .filter(opt => {
                                        const currentRank = STATUS_ORDER[data.application_status] || 0;
                                        const optionRank = STATUS_ORDER[opt.value];

                                        return optionRank > currentRank;
                                    })
                                    .map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            <span className={`badge badge-${opt.value === 'REJECTED' ? 'danger' :
                                                opt.value === 'HIRED' ? 'success' :
                                                    opt.value === 'INTERVIEW' ? 'primary' :
                                                        opt.value === 'IN REVIEW' ? 'info' : 'secondary'
                                                } mr-2`} style={{ width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
                                            {opt.label}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => UpdateApplicationStatus()} disabled={
                            !status || preStatus === status || isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default UpdateCandidateApplication;
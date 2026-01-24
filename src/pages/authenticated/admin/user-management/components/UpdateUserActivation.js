/* global $ */
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateUserActivation = ({ id, data, modalTitle, callbackFunction }) => {
    const [preStatus, setPreStatus] = useState('');
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const handleClose = () => {
        callbackFunction(false);
        $(`#update_account_approval_${id}`).modal('hide');
    }

    const SaveUserProfileChanges = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('status', status);
            formData.append('remarks', remarks);
            formData.append('userId', id);

            await axios.post(`${url}/authenticated/administrator/user-management/account-activation`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });
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
            setPreStatus(data?.account_status);
            setStatus(data?.account_status);
            setRemarks(data?.declined_remarks);
        }
    }, [data]);

    return (
        <>
            <ModalTemplate
                id={`update_account_approval_${id}`}
                isModalCentered={true}
                headerClassName={'bg-success'}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pt-2 pb-2'}
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
                                    container: () => document.getElementById(`update_account_approval_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
                            >
                                {
                                    ["VERIFICATION"].includes(preStatus) && [
                                        <MenuItem disabled={preStatus === "VERIFICATION"} value="VERIFICATION">VERIFICATION</MenuItem>,
                                        <MenuItem disabled={preStatus === "APPROVED"} value="APPROVED">APPROVE</MenuItem>,
                                        <MenuItem disabled={preStatus === "DECLINED"} value="DECLINED">DECLINE</MenuItem>
                                    ]
                                }

                                {
                                    ["APPROVED"].includes(preStatus) && [
                                        <MenuItem disabled={preStatus === "APPROVED"} value="APPROVED">APPROVE</MenuItem>,
                                        <MenuItem disabled={preStatus === "ON-HOLD"} value="ON-HOLD">HOLD</MenuItem>
                                    ]
                                }

                                {
                                    ["ON-HOLD"].includes(preStatus) && [
                                        <MenuItem disabled={preStatus === "ON-HOLD"} value="ON-HOLD">HOLD</MenuItem>,
                                        <MenuItem disabled={preStatus === "APPROVED"} value="APPROVED">APPROVE</MenuItem>
                                    ]
                                }
                            </Select>
                        </FormControl>

                        {
                            ["DECLINED", "ON-HOLD"].includes(status) &&
                            <TextField
                                margin='dense'
                                fullWidth
                                id="outlined-description"
                                label={<><span>Remarks</span></>}
                                multiline
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                rows={4}
                            />
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SaveUserProfileChanges()} disabled={
                            !status ||
                            status === preStatus ||
                            (["DECLINED", "ON-HOLD"].includes(status) && !remarks) ||
                            isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default UpdateUserActivation
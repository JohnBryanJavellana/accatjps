/* global $ */
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';

const UpdateDocStatus = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");

    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const handleClose = () => {
        callbackFunction(false);
        $(`#document_info_${id}`).modal('hide');
    }

    const SubmitDocumentUpdate = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('documentId', data.id);
            formData.append('status', status);
            formData.append('remarks', remarks);
            formData.append('index', data?.index);

            await axios.post(`${url}/authenticated/administrator/user-management/update-doc-status`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            callbackFunction(true);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            $(`#document_info_${id}`).modal('hide');
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <ModalTemplate
                id={`document_info_${id}`}
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
                                    container: () => document.getElementById(`document_info_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
                            >
                                <MenuItem value="REJECTED">REJECT</MenuItem>
                                <MenuItem value="VERIFIED">VERIFIED</MenuItem>
                            </Select>
                        </FormControl>

                        {
                            status === "REJECTED" &&
                            <TextField
                                margin='dense'
                                fullWidth
                                id="outlined-remarks"
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

                        <button type="button" onClick={() => SubmitDocumentUpdate()} disabled={
                            !status || (status === "REJECTED" && !remarks) || isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default UpdateDocStatus;
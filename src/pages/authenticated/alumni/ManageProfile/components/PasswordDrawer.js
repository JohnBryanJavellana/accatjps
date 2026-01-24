/* global $ */
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import ReactPasswordChecklist from 'react-password-checklist';
import useToggleShowHidePass from '../../../../../hooks/useToggleShowHidePass';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';

const PasswordDrawer = ({ id, data, modalTitle, callbackFunction }) => {
    const { EndAdornment, inputType } = useToggleShowHidePass();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [isPasswordRuleValid, setIsPasswordRuleValid] = useState(false);

    const handleClose = () => {
        callbackFunction(false);
        $(`#password_info_${id}`).modal('hide');
    }

    const SubmitCertificationOrLicense = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('currentPassword', currentPassword);
            formData.append('password', password);
            formData.append('passwordConfirmation', passwordConfirmation);

            const response = await axios.post(`${url}/authenticated/update-password`, formData, {
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

    return (
        <>
            <ModalTemplate
                id={`password_info_${id}`}
                isModalCentered={true}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pt-1 pb-2'}
                body={
                    <>
                        <FormControl fullWidth margin='dense' variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Enter Current Password <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                id="outlined-adornment-password"
                                type={inputType}
                                endAdornment={<EndAdornment />}
                                label="Enter Current Password"
                            />
                        </FormControl>

                        <ReactPasswordChecklist
                            rules={["minLength", "specialChar", "number", "capital", "match"]}
                            minLength={6}
                            value={password}
                            valueAgain={passwordConfirmation}
                            iconSize={8}
                            onChange={(isValid) => {
                                setIsPasswordRuleValid(isValid);
                            }}
                            className="alert alert-light px-3 py-1 text-sm mt-2 mb-0 text-dark"
                        />

                        <FormControl fullWidth margin='dense' variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="outlined-adornment-password"
                                type={inputType}
                                endAdornment={<EndAdornment />}
                                label="Password"
                            />
                        </FormControl>

                        <FormControl fullWidth margin='dense' variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                id="outlined-adornment-confirm-password"
                                type={inputType}
                                endAdornment={<EndAdornment />}
                                label="Confirm Password"
                            />
                        </FormControl>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SubmitCertificationOrLicense()} disabled={
                            !currentPassword || !password || !passwordConfirmation || !isPasswordRuleValid || isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default PasswordDrawer;
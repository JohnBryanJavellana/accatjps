import { Divider, FormControl, InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../Login/Login.css';
import axios from 'axios';
import useShowToaster from '../../../../hooks/useShowToaster';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import ReactPasswordChecklist from 'react-password-checklist';
import useToggleShowHidePass from '../../../../hooks/useToggleShowHidePass';

const ResetPassword = () => {
    const { uid, token } = useParams();
    const isTouch = useMediaQuery('(pointer: coarse)');
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [isPasswordRuleValid, setIsPasswordRuleValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { url } = useSystemURLCon();
    const { EndAdornment, inputType } = useToggleShowHidePass();
    const navigate = useNavigate();
    const { setOpenToast, Toast, setToastMessage, setToastStatus, toastStatus } = useShowToaster();
    const { SubmitLoadingAnim, setShowLoader, setProgress, setMethod } = useShowSubmitLoader();

    const ResetPasswordFunc = async () => {
        try {
            setIsSubmitting(true);
            setShowLoader(true);
            setProgress(0);
            setOpenToast(false);
            setToastMessage("");
            setMethod('PROCESSING...');

            const formData = new FormData();
            formData.append('password', password);
            formData.append('confirm_password', confirm_password);

            const response = await axios.post(`${url}/password-reset-confirm/${uid}/${token}/`, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            });

            setOpenToast(true);
            setToastStatus('success');
            setToastMessage(response.data.message);
        } catch (error) {
            console.log(error);

            setOpenToast(true);
            setToastStatus('danger');
            setToastMessage(error.response.data.message);
        } finally {
            setIsSubmitting(false);
            setShowLoader(false);
        }
    }

    return (
        <>
            <SubmitLoadingAnim place='OUT' cls="loader" />
            <Toast callbackFunction={toastStatus === 'success' ? () => navigate('/account-login') : () => { }} />

            <div className={`guest-bg`}>
                <div className="container p-0">
                    <div className='row d-flex align-items-center justify-content-center'>
                        <div className='col-xl-5'>
                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-body px-5 py-4 text--fontPos13--xW8hS">
                                    <div className="row">
                                        <div className="col-xl-12 pb-3">
                                            <div className="text-center py-3 text-bold h4 pt-4">
                                                Reset Password
                                            </div>

                                            <ReactPasswordChecklist
                                                rules={["minLength", "specialChar", "number", "capital", "match"]}
                                                minLength={6}
                                                value={password}
                                                valueAgain={confirm_password}
                                                iconSize={isTouch ? 8 : 10}
                                                onChange={(isValid) => {
                                                    setIsPasswordRuleValid(isValid);
                                                }}
                                                className="alert alert-light px-3 py-1 mt-2 mb-0 text-dark"
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
                                                    value={confirm_password}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    id="outlined-adornment-confirm-password"
                                                    type={inputType}
                                                    endAdornment={<EndAdornment />}
                                                    label="Confirm Password"
                                                />
                                            </FormControl>

                                            <div className="row mt-3">
                                                <div className="col-xl-12 mb-2">
                                                    <button type="submit" disabled={
                                                        !password ||
                                                        !isPasswordRuleValid ||
                                                        isSubmitting
                                                    } onClick={() => ResetPasswordFunc()} className="text--fontPos13--xW8hS btn btn-success btn-block elevation-1">
                                                        {isSubmitting ? 'PLEASE WAIT..' : 'SUBMIT'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;
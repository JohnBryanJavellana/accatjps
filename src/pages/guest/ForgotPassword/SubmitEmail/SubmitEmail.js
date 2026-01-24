import { Divider, FormControl, InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../../Login/Login.css';
import axios from 'axios';
import useShowToaster from '../../../../hooks/useShowToaster';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';

const SubmitEmail = () => {
    const isTouch = useMediaQuery('(pointer: coarse)');
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { url } = useSystemURLCon();
    const { setOpenToast, Toast, setToastMessage, setToastStatus, toastStatus } = useShowToaster();
    const { SubmitLoadingAnim, setShowLoader, setProgress, setMethod } = useShowSubmitLoader();

    const SubmitEmailFunc = async () => {
        try {
            setIsSubmitting(true);
            setShowLoader(true);
            setProgress(0);
            setOpenToast(false);
            setToastMessage("");
            setMethod('PROCESSING...');

            const formData = new FormData();
            formData.append('email', String(email).toLocaleLowerCase());

            const response = await axios.post(`${url}/password-reset`, formData, {
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
                                            <div className="py-3 text-bold h4 pt-4">
                                                Forgot Password
                                            </div>

                                            Enter your email address below and we will send you a link to reset your password.
                                            <FormControl fullWidth margin='dense' variant="outlined">
                                                <InputLabel htmlFor="email">Email <span className='text-danger'>*</span></InputLabel>
                                                <OutlinedInput
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    id="email"
                                                    type="email"
                                                    label="Email"
                                                />
                                            </FormControl>

                                            <div className="row mt-3">
                                                <div className="col-xl-12 mb-2">
                                                    <button type="submit" disabled={
                                                        !email ||
                                                        isSubmitting
                                                    } onClick={() => SubmitEmailFunc()} className="text--fontPos13--xW8hS btn btn-success btn-block elevation-1">
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

export default SubmitEmail;
import { Divider, FormControl, InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';
import useToggleShowHidePass from '../../../../hooks/useToggleShowHidePass';
import useShowToaster from '../../../../hooks/useShowToaster';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import axios from 'axios';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import useGetToken from '../../../../hooks/useGetToken';

const EmployerLogin = () => {
    const isTouch = useMediaQuery('(pointer: coarse)');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { EndAdornment, inputType } = useToggleShowHidePass();
    const { url } = useSystemURLCon();
    const { setOpenToast, Toast, setToastMessage, setToastStatus, toastStatus } = useShowToaster();
    const { SubmitLoadingAnim, setShowLoader, setProgress, setMethod } = useShowSubmitLoader();
    const { setToken } = useGetToken();
    const navigate = useNavigate();

    const LoginUser = async () => {
        try {
            setIsSubmitting(true);
            setShowLoader(true);
            setProgress(0);
            setOpenToast(false);
            setToastMessage("");
            setMethod('PROCESSING...');

            const formData = new FormData();
            formData.append('email', String(email).toLocaleLowerCase());
            formData.append('password', password);
            formData.append('type', "EMPLOYER");

            const response = await axios.post(`${url}/login-user`, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            });

            if (response.data.success) {
                const tokens = response.data.token;
                const role = response.data.role;
                setToken('access_token', tokens.access);
                setToken('refresh_token', tokens.refresh);

                const pathPrefix = String(role).toLowerCase();
                navigate(`/welcome/${pathPrefix}/`);
            }
        } catch (error) {
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
            <Toast callbackFunction={() => { }} />

            <div className={`guest-bg`}>
                <div className="container p-0">
                    <div className='row d-flex align-items-center justify-content-center'>
                        <div className='col-xl-5'>
                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-body px-5 py-4 text--fontPos13--xW8hS">
                                    <div className="row">
                                        <div className="col-xl-12 pb-3">
                                            <div className="text-center py-3 text-bold h5 pt-4">
                                                Employer Login
                                            </div>

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

                                            <div className="row mt-2">
                                                <div className='col-xl-12'>
                                                    <Link to="/forgot-password" className="text-muted">
                                                        Forgot Password? <span className="text-bold">Click here</span>
                                                    </Link>
                                                </div>

                                                <div className="col-xl-12 my-2">
                                                    <button type="submit" disabled={
                                                        !email ||
                                                        !password ||
                                                        isSubmitting
                                                    } onClick={() => LoginUser()} className="text--fontPos13--xW8hS btn btn-success btn-block elevation-1">
                                                        {isSubmitting ? 'PLEASE WAIT..' : 'LOGIN'}
                                                    </button>
                                                </div>

                                                <div className='col-xl-12 mt-2 text-center'>
                                                    <Divider sx={{ opacity: '0.6', borderStyle: 'dashed' }}>or</Divider>
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className='col-xl-12 text-center'>
                                                    <Link to="/employer/create-account" className="text--fontPos13--xW8hS btn btn-default btn-block">
                                                        Create Employer Account
                                                    </Link>
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

export default EmployerLogin;
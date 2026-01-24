import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, useMediaQuery } from '@mui/material';
import { useState } from 'react'
import '../Login/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useToggleShowHidePass from '../../../hooks/useToggleShowHidePass';
import ReactPasswordChecklist from 'react-password-checklist';
import useShowSubmitLoader from '../../../hooks/useShowSubmitLoader';
import useShowToaster from '../../../hooks/useShowToaster';
import useSystemURLCon from '../../../hooks/useSystemURLCon';

const Registration = () => {
    const isTouch = useMediaQuery('(pointer: coarse)');
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const [suffix, setSuffix] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [isPasswordRuleValid, setIsPasswordRuleValid] = useState(false);
    const [role, setRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { EndAdornment, inputType } = useToggleShowHidePass();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const { setOpenToast, Toast, setToastMessage, setToastStatus, toastStatus } = useShowToaster();
    const { SubmitLoadingAnim, setShowLoader, setProgress, setMethod } = useShowSubmitLoader();

    const RegisterUser = async () => {
        try {
            setIsSubmitting(true);
            setShowLoader(true);
            setProgress(0);
            setOpenToast(false);
            setToastMessage("");
            setMethod('PROCESSING...');

            const formData = new FormData();
            formData.append('fname', fname);
            formData.append('mname', mname);
            formData.append('lname', lname);
            formData.append('suffix', suffix);
            formData.append('role', role);
            formData.append('email', String(email).toLocaleLowerCase());
            formData.append('password', password);
            formData.append('password_confirmation', confirm_password);

            const response = await axios.post(`${url}/register-user`, formData, {
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
            <Toast callbackFunction={toastStatus === "success" ? () => navigate('/account-login') : () => { }} />

            <div className={`guest-bg`}>
                <div className="container p-0">
                    <div className='row d-flex align-items-center justify-content-center'>
                        <div className='col-xl-5'>
                            <div className="card text-dark fade-up">
                                <div className="card-body py-0 text--fontPos13--xW8hS">
                                    <div className="row">
                                        <div className="col-xl-12 pb-3">
                                            <div className="text-center py-3 text-bold h4 pt-4">
                                                Create Your Account
                                            </div>

                                            <FormControl fullWidth margin='dense' variant="outlined">
                                                <InputLabel htmlFor="fname">First name <span className='text-danger'>*</span></InputLabel>
                                                <OutlinedInput
                                                    required
                                                    value={fname}
                                                    onChange={(e) => setFname(e.target.value)}
                                                    id="fname"
                                                    type="text"
                                                    label="First name"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin='dense' variant="outlined">
                                                <InputLabel htmlFor="mname">Middle name</InputLabel>
                                                <OutlinedInput
                                                    value={mname}
                                                    onChange={(e) => setMname(e.target.value)}
                                                    id="mname"
                                                    type="text"
                                                    label="Middle name"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin='dense' variant="outlined">
                                                <InputLabel htmlFor="lname">Last name <span className='text-danger'>*</span></InputLabel>
                                                <OutlinedInput
                                                    required
                                                    value={lname}
                                                    onChange={(e) => setLname(e.target.value)}
                                                    id="lname"
                                                    type="text"
                                                    label="Last name"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin='dense'>
                                                <InputLabel id="demo-simple-select-label">Suffix</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={suffix}
                                                    label="Suffix"
                                                    onChange={(e) => setSuffix(e.target.value)}
                                                >
                                                    <MenuItem value="">NOT APPLICABLE</MenuItem>
                                                    <MenuItem value="JR.">JR.</MenuItem>
                                                    <MenuItem value="SR.">SR.</MenuItem>
                                                    <MenuItem value="I">I</MenuItem>
                                                    <MenuItem value="II">II</MenuItem>
                                                    <MenuItem value="III">III</MenuItem>
                                                    <MenuItem value="IV">IV</MenuItem>
                                                    <MenuItem value="V">V</MenuItem>
                                                </Select>
                                            </FormControl>

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

                                            <FormControl fullWidth margin="dense">
                                                <InputLabel id="demo-simple-select-label">Role <span className='text-danger'>*</span></InputLabel>
                                                <Select
                                                    required
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={role}
                                                    label="Role"
                                                    onChange={(e) => setRole(e.target.value)}
                                                >
                                                    <MenuItem value="job-seeker">JOB SEEKER</MenuItem>
                                                    <MenuItem value="employer">EMPLOYER</MenuItem>
                                                </Select>
                                            </FormControl>

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
                                                        !fname ||
                                                        !mname ||
                                                        !lname ||
                                                        !email ||
                                                        !password ||
                                                        !isPasswordRuleValid ||
                                                        !role ||
                                                        isSubmitting
                                                    } onClick={() => RegisterUser()} className="text--fontPos13--xW8hS btn btn-success btn-block elevation-1">
                                                        {isSubmitting ? 'PLEASE WAIT..' : 'SIGN UP'}
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

export default Registration;
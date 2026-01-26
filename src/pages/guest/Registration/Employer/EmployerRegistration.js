import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, TextField, useMediaQuery } from '@mui/material';
import { useState } from 'react'
import '../../Login/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useToggleShowHidePass from '../../../../hooks/useToggleShowHidePass';
import ReactPasswordChecklist from 'react-password-checklist';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import useShowToaster from '../../../../hooks/useShowToaster';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import CustomFileUpload from '../../../authenticated/components/CustomFileUpload/CustomFileUpload';

const EmployerRegistration = () => {
    const isTouch = useMediaQuery('(pointer: coarse)');
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const [suffix, setSuffix] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [isPasswordRuleValid, setIsPasswordRuleValid] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { EndAdornment, inputType } = useToggleShowHidePass();
    const [permitFile, setPermitFile] = useState(null);
    const [birFile, setBirFile] = useState(null);
    const [secFile, setSecFile] = useState(null);
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
            formData.append('phoneNumber', phoneNumber);
            formData.append('businessName', businessName);
            formData.append('country', country);
            formData.append('business_type', businessType);
            formData.append('role', "EMPLOYER");
            formData.append('email', String(email).toLocaleLowerCase());
            formData.append('password', password);
            formData.append('password_confirmation', confirm_password);
            formData.append('permit_document', permitFile);
            formData.append('bir_document', birFile);
            formData.append('sec_document', secFile)

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

            setFname("");
            setMname("");
            setLname("");
            setSuffix("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setBusinessName("");
            setPhoneNumber("");
            setCountry("");
            setPermitFile(null);
            setBirFile(null);
            setSecFile(null);
        } catch (error) {
            setOpenToast(true);
            setToastStatus('danger');
            setToastMessage(error.response.data.message);
        } finally {
            setIsSubmitting(false);
            setShowLoader(false);
        }
    }

    const countries = [
        "PHILIPPINES",
        "SINGAPORE",
        "USA",
        "CANADA",
        "AUSTRALIA",
        "JAPAN",
        "UNITED KINGDOM"
    ];

    return (
        <>
            <SubmitLoadingAnim place='OUT' cls="loader" />
            <Toast callbackFunction={toastStatus === "success" ? () => navigate('/employer/login') : () => { }} />

            <div className={`guest-bg`}>
                <div className="container p-0">
                    <div className='row d-flex align-items-center justify-content-center'>
                        <div className='col-xl-5'>
                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-body px-5 py-4 text--fontPos13--xW8hS">
                                    <div className="row">
                                        <div className="col-xl-12 pb-3">
                                            <div className="text-center py-3 text-bold h4 pt-4">
                                                Create Employer Account
                                            </div>

                                            <div className="row">
                                                <div className="col-xl-12">
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
                                                        <InputLabel htmlFor="mname">Middle name <span className='text-danger'>*</span></InputLabel>
                                                        <OutlinedInput
                                                            required
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
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="alert alert-light mt-3">
                                                        We need some details about your business to verify your account. We won’t share your details with anyone.
                                                    </div>

                                                    <label className="form-label">Business Details</label>

                                                    <FormControl fullWidth sx={{ ml: 0 }}>
                                                        <FormHelperText
                                                            sx={{
                                                                ml: 0,
                                                                mb: 1,
                                                                fontWeight: '500',
                                                                color: 'text.secondary'
                                                            }}
                                                        >
                                                            We need your registered business name to verify your account.
                                                        </FormHelperText>

                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            id="businessName"
                                                            label={<><span>Business name <span className="text-danger">*</span></span></>}
                                                            value={businessName}
                                                            onChange={(e) => setBusinessName(e.target.value)}
                                                            type="text"
                                                        />
                                                    </FormControl>

                                                    <FormControl fullWidth margin='dense'>
                                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={businessType}
                                                            label="Type"
                                                            onChange={(e) => setBusinessType(e.target.value)}
                                                        >
                                                            <MenuItem value="GOVERNMENT">GOVERNMENT</MenuItem>
                                                            <MenuItem value="PRIVATE">PRIVATE</MenuItem>
                                                            <MenuItem value="NGO">NGO</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl fullWidth margin='dense'>
                                                        <InputLabel id="demo-simple-select-label">Country <span className="text-danger">*</span></InputLabel>
                                                        <Select
                                                            required
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={country}
                                                            label="Country"
                                                            onChange={(e) => setCountry(e.target.value)}
                                                        >
                                                            {countries.map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl fullWidth margin='dense' variant="outlined">
                                                        <InputLabel htmlFor="Phone#">Phone# <span className='text-danger'>*</span></InputLabel>
                                                        <OutlinedInput
                                                            required
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                            id="Phone#"
                                                            type="text"
                                                            label="Phone#"
                                                        />
                                                    </FormControl>

                                                </div>

                                                <div className="row mt-3">
                                                    <CustomFileUpload
                                                        id="permit"
                                                        label="Business Permit"
                                                        description="Current Mayor's/Business Permit from your local LGU."
                                                        icon="fas fa-building"
                                                        color="#0d6efd"
                                                        file={permitFile}
                                                        setFile={setPermitFile}
                                                    />

                                                    <CustomFileUpload
                                                        id="bir"
                                                        label="BIR Form 2303"
                                                        description="Certificate of Registration (COR) for tax verification."
                                                        icon="fas fa-file-invoice-dollar"
                                                        color="#6610f2"
                                                        file={birFile}
                                                        setFile={setBirFile}
                                                    />

                                                    <CustomFileUpload
                                                        id="sec"
                                                        label="SEC / DTI Reg."
                                                        description="SEC Certificate (Corporation) or DTI (Sole Proprietorship)."
                                                        icon="fas fa-id-card"
                                                        color="#fd7e14"
                                                        file={secFile}
                                                        setFile={setSecFile}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-xl-12 mb-2">
                                                    <button type="submit" disabled={
                                                        !fname ||
                                                        !mname ||
                                                        !lname ||
                                                        !email ||
                                                        !password ||
                                                        !isPasswordRuleValid ||
                                                        !businessName ||
                                                        !country ||
                                                        !phoneNumber ||
                                                        !birFile ||
                                                        !permitFile ||
                                                        !secFile ||
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

export default EmployerRegistration;
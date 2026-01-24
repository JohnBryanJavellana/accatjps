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

    const FileUploadSlot = ({ id, label, description, file, setFile, icon, color, required = false }) => {
        const [isDragging, setIsDragging] = useState(false);
        const isUploaded = !!file;

        // Helper to handle file selection with basic validation
        const handleFileChange = (selectedFile) => {
            if (!selectedFile) return;

            // Example: Limit to 5MB
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("File is too large. Please upload a file smaller than 5MB.");
                return;
            }
            setFile(selectedFile);
        };

        const onDrop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
            }
        };

        return (
            <div className="col-xl-12 mb-3">
                <div
                    className={`h-100 border-0 shadow-sm transition-all ${isUploaded ? 'bg-white' : 'bg-light'} ${isDragging ? 'border-primary' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    style={{
                        borderRadius: '16px',
                        transition: 'all 0.2s ease-in-out',
                        border: isDragging
                            ? `2px dashed ${color}`
                            : (isUploaded ? `1px solid ${color}40` : '1px solid #eef2f6'),
                        position: 'relative',
                        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                        backgroundColor: isDragging ? `${color}05` : undefined
                    }}
                >
                    {/* Required Tag */}
                    {required && !isUploaded && (
                        <div style={{
                            position: 'absolute', top: '12px', right: '15px',
                            fontSize: '9px', fontWeight: 'bold', color: '#dc3545',
                            textTransform: 'uppercase'
                        }}>
                            * Required
                        </div>
                    )}

                    <div className="p-3 d-flex flex-column h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    width: '40px', height: '40px',
                                    backgroundColor: isUploaded ? '#E8F5E9' : 'white',
                                    color: isUploaded ? '#2E7D32' : color
                                }}
                            >
                                <i className={isUploaded ? 'fas fa-check' : (isDragging ? 'fas fa-arrow-down' : icon)}></i>
                            </div>
                            {isUploaded && (
                                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: '10px' }}>
                                    READY TO SEND
                                </span>
                            )}
                        </div>

                        <div className="mb-3">
                            <h6 className="fw-bold mb-0" style={{ fontSize: '14px', color: '#334155' }}>{label}</h6>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{description}</p>
                        </div>

                        {/* Interaction Area */}
                        <div className="mt-auto">
                            {!isUploaded ? (
                                <button
                                    type="button"
                                    className={`btn w-100 py-2 shadow-sm ${isDragging ? 'btn-primary' : 'btn-white border'}`}
                                    style={{ borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}
                                    onClick={() => document.getElementById(id).click()}
                                >
                                    <i className="fa-solid fa-cloud-arrow-up me-2"></i>
                                    {isDragging ? 'Drop File Now' : 'Select or Drag File'}
                                </button>
                            ) : (
                                <div className="bg-light rounded-3 p-2 border border-light-subtle d-flex align-items-center">
                                    {/* Clickable area to change file */}
                                    <div
                                        className="flex-grow-1 overflow-hidden me-2"
                                        role="button"
                                        onClick={() => document.getElementById(id).click()}
                                        style={{ cursor: 'pointer' }}
                                        title="Click to change file"
                                    >
                                        <div className="text-dark fw-bold text-truncate" style={{ fontSize: '11px' }}>
                                            {file.name}
                                        </div>
                                        <div className="text-primary" style={{ fontSize: '9px', fontWeight: '600' }}>
                                            <i className="fas fa-sync-alt mr-1"></i> Replace File
                                        </div>
                                    </div>

                                    {/* Delete button stays separate for safety */}
                                    <button
                                        className="btn btn-link text-danger p-1"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents triggering the file input
                                            setFile(null);
                                        }}
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <input
                            type="file" id={id} hidden
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                    </div>
                </div>
            </div>
        );
    };

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
                                                    <FileUploadSlot
                                                        id="permit"
                                                        label="Business Permit"
                                                        description="Current Mayor's/Business Permit from your local LGU."
                                                        icon="fas fa-building"
                                                        color="#0d6efd"
                                                        file={permitFile}
                                                        setFile={setPermitFile}
                                                    />

                                                    <FileUploadSlot
                                                        id="bir"
                                                        label="BIR Form 2303"
                                                        description="Certificate of Registration (COR) for tax verification."
                                                        icon="fas fa-file-invoice-dollar"
                                                        color="#6610f2"
                                                        file={birFile}
                                                        setFile={setBirFile}
                                                    />

                                                    <FileUploadSlot
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
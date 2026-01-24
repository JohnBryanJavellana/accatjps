import { Divider, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, Tooltip, useMediaQuery } from '@mui/material';
import { useState } from 'react'
import '../../Login/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useToggleShowHidePass from '../../../../hooks/useToggleShowHidePass';
import ReactPasswordChecklist from 'react-password-checklist';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import useShowToaster from '../../../../hooks/useShowToaster';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import LanguagesDrawer from '../../../authenticated/alumni/ManageProfile/components/LanguagesDrawer';
import LicenseAndCertificationsDrawer from '../../../authenticated/alumni/ManageProfile/components/LicenseAndCertificationsDrawer';
import SkillDrawer from '../../../authenticated/alumni/ManageProfile/components/SkillDrawer';
import EducationDrawer from '../../../authenticated/alumni/ManageProfile/components/EducationDrawer';
import PersonalScaleDrawer from '../../../authenticated/alumni/ManageProfile/components/PersonalScaleDrawer';
import useDateFormat from '../../../../hooks/useDateFormat';
import dayjs from 'dayjs';

const AlumniRegistration = () => {
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
    const { formatDateToReadable } = useDateFormat();

    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [certificates, setCertificate] = useState([]);
    const [generalAppearance, setGeneralAppearance] = useState(0);
    const [mannerOfSpeaking, setMannerOfSpeaking] = useState(0);
    const [physicalCondition, setPhysicalCondition] = useState(0);
    const [mentalAlertness, setMentalAlertness] = useState(0);
    const [selfConfidence, setSelfConfidence] = useState(0);
    const [abilityToPresentIdeas, setAbilityToPresentIdeas] = useState(0);
    const [communicationSkills, setCommunicationSkills] = useState(0);
    const [studentPerformanceRating, setStudentPerformanceRating] = useState(0);

    const [course, setCourse] = useState(null);
    const [courseHighlights, setCourseHighlights] = useState("");
    const [yearGraduated, setYearGraduated] = useState("");

    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);

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
            formData.append('role', "ALUMNI");
            formData.append('email', String(email).toLocaleLowerCase());
            formData.append('password', password);
            formData.append('password_confirmation', confirm_password);

            languages.forEach((l, _) => formData.append('language[]', l));
            skills.forEach((s, _) => formData.append('skill[]', s));

            formData.append('certificates', JSON.stringify(certificates));
            formData.append('course', course?.id);
            formData.append('courseHighlights', courseHighlights);
            formData.append('yearGraduated', yearGraduated);
            formData.append('general_appearance', generalAppearance);
            formData.append('manner_of_speaking', mannerOfSpeaking);
            formData.append('physical_condition', physicalCondition);
            formData.append('mental_alertness', mentalAlertness);
            formData.append('self_confidence', selfConfidence);
            formData.append('ability_to_present_ideas', abilityToPresentIdeas);
            formData.append('communication_skills', communicationSkills);
            formData.append('student_performance_rating', studentPerformanceRating);

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

            setSkills([]);
            setLanguages([]);
            setCertificate([]);
            setGeneralAppearance(0);
            setMannerOfSpeaking(0);
            setPhysicalCondition(0);
            setMentalAlertness(0);
            setSelfConfidence(0);
            setAbilityToPresentIdeas(0);
            setCommunicationSkills(0);
            setStudentPerformanceRating(0);
            setCourse(null);
            setCourseHighlights("");
            setYearGraduated("");
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
            <Toast callbackFunction={toastStatus === "success" ? () => navigate('/alumni/login') : () => { }} />

            {
                modalIndex === 1 &&
                <LanguagesDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Add Language`}
                    callbackFunction={(e) => {
                        setLanguages(r => [...r, e.language]);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    isFromGuest
                />
            }

            {
                modalIndex === 2 &&
                <LicenseAndCertificationsDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? 'Update' : 'Create'} License or Certifications`}
                    callbackFunction={(e) => {
                        setCertificate(certificates.filter((_, i) => i !== e.index));

                        setCertificate(r => [...r, {
                            certificate: e.certificate,
                            certificate_description: e.certificateDescription,
                            expiry_date: e.expiryDate
                        }]);

                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    isFromGuest
                />
            }

            {
                modalIndex === 3 &&
                <SkillDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Add Skill`}
                    callbackFunction={(e) => {
                        setSkills(r => [...r, e.skill]);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    isFromGuest
                />
            }

            {
                modalIndex === 4 &&
                <EducationDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? 'Update' : 'Create'} Education`}
                    callbackFunction={(e) => {
                        setCourse(e.course);
                        setCourseHighlights(e.courseHighlights);
                        setYearGraduated(e.yearGraduated);

                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    isFromGuest
                />
            }

            {
                modalIndex === 6 &&
                <PersonalScaleDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? "Update" : "Create"} Personal Scale`}
                    callbackFunction={(e) => {
                        setGeneralAppearance(e.generalAppearance);
                        setMannerOfSpeaking(e.mannerOfSpeaking);
                        setPhysicalCondition(e.physicalCondition);
                        setMentalAlertness(e.mentalAlertness);
                        setSelfConfidence(e.selfConfidence);
                        setAbilityToPresentIdeas(e.abilityToPresentIdeas);
                        setCommunicationSkills(e.communicationSkills);
                        setStudentPerformanceRating(e.studentPerformanceRating);

                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    isFromGuest
                />
            }

            <div className={`guest-bg`}>
                <div className="container p-0">
                    <div className='row d-flex align-items-center justify-content-center'>
                        <div className='col-xl-5'>
                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-body px-5 py-4 text--fontPos13--xW8hS">
                                    <div className="row">
                                        <div className="col-xl-12 pb-3">
                                            <div className="text-center py-3 text-bold h4 pt-4">
                                                Create Alumni Account
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
                                    </div>
                                </div>
                            </div>

                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-header pl-4 text-sm border border-light">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div>Languages</div>
                                        <div>
                                            <Tooltip title="Add Language">
                                                <IconButton size='small' color='success' data-toggle="modal" data-target={`#language_info_1`} onClick={() => {
                                                    setIsModalOpen('YES');
                                                    setModalOpenId(1);
                                                    setModalIndex(1);
                                                    setModalData(null);
                                                }}>
                                                    <span className="material-icons-outlined">add</span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0 text--fontPos13--xW8hS">
                                    {
                                        languages.length <= 0
                                            ? <div className='p-4 text-center text-muted'>
                                                Add languages to your profile to make it easier for employers to find and hire you.
                                            </div> : <div className="row">
                                                <div className="col-xl-12">
                                                    {
                                                        languages.map((language, index) => (
                                                            <div key={index}>
                                                                <div className="row py-2 px-4">
                                                                    <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                        {language}
                                                                        <div className='ml-5'>
                                                                            <Tooltip title="Remove Language">
                                                                                <IconButton size='small' color='error' onClick={() => {
                                                                                    setLanguages(languages.filter((r, i) => i !== index));
                                                                                }}>
                                                                                    <span className="material-icons-outlined" style={{ fontSize: '17px' }}>clear</span>
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {(index < languages - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>

                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-header pl-4 text-sm border border-light">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div>Certifications & Licenses</div>
                                        <div>
                                            <Tooltip title="Add Certifications or Licenses">
                                                <IconButton size='small' color='success' data-toggle="modal" data-target={`#lc_info_0`} onClick={() => {
                                                    setIsModalOpen('YES');
                                                    setModalOpenId(0);
                                                    setModalIndex(2);
                                                    setModalData(null);
                                                }}>
                                                    <span className="material-icons-outlined">add</span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0 text--fontPos13--xW8hS">
                                    {
                                        certificates.length <= 0
                                            ? <div className='p-4 text-center text-muted'>
                                                Add certifications & licenses to your profile to make it easier for employers to find and hire you.
                                            </div> : <div className="row">
                                                <div className="col-xl-12">
                                                    {
                                                        certificates.map((certificate, index) => (
                                                            <div key={index}>
                                                                <div className="row py-2 px-4">
                                                                    <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                        <div>
                                                                            <div className='text-bold'>{certificate.certificate}</div>
                                                                            <div>{certificate.certificate_description}</div>
                                                                            <div className='text-muted'>Expiry Date: {formatDateToReadable(certificate.expiry_date)}</div>
                                                                        </div>

                                                                        <div className='ml-5'>
                                                                            <Tooltip title="Remove Certificate or License">
                                                                                <IconButton size='small' color='error' onClick={() => {
                                                                                    setCertificate(certificates.filter((r, i) => i !== index));
                                                                                }}>
                                                                                    <span className="material-icons-outlined" style={{ fontSize: '17px' }}>clear</span>
                                                                                </IconButton>
                                                                            </Tooltip>

                                                                            <Tooltip title="Update Certificate or License">
                                                                                <IconButton size='small' color='warning' data-toggle="modal" data-target={`#lc_info_${certificate.id}`} onClick={() => {
                                                                                    setIsModalOpen('YES');
                                                                                    setModalOpenId(certificate.id);
                                                                                    setModalIndex(2);
                                                                                    setModalData({
                                                                                        certificate: certificate.certificate,
                                                                                        expiry_date: certificate.expiry_date,
                                                                                        certificate_description: certificate.certificate_description,
                                                                                        index: index
                                                                                    });
                                                                                }}>
                                                                                    <span className="material-icons-outlined" style={{ fontSize: '17px' }}>edit</span>
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {(index < languages.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>

                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-header pl-4 text-sm border border-light">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div>Skills</div>
                                        <div>
                                            <Tooltip title="Add Skill">
                                                <IconButton size='small' color='success' data-toggle="modal" data-target={`#skill_info_3`} onClick={() => {
                                                    setIsModalOpen('YES');
                                                    setModalOpenId(3);
                                                    setModalIndex(3);
                                                    setModalData(null);
                                                }}>
                                                    <span className="material-icons-outlined">add</span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0 text--fontPos13--xW8hS">
                                    {
                                        skills.length <= 0
                                            ? <div className='p-4 text-center text-muted'>
                                                Add skills to your profile to make it easier for employers to find and hire you.
                                            </div> : <div className="row">
                                                <div className="col-xl-12">
                                                    {
                                                        skills.map((skill, index) => (
                                                            <div key={index}>
                                                                <div className="row py-2 px-4">
                                                                    <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                        <div>
                                                                            <div>{skill}</div>
                                                                        </div>

                                                                        <div className='ml-5'>
                                                                            <Tooltip title="Remove Skill">
                                                                                <IconButton size='small' color='error' onClick={() => {
                                                                                    setSkills(skills.filter((r, i) => i !== index));
                                                                                }}>
                                                                                    <span className="material-icons-outlined" style={{ fontSize: '17px' }}>clear</span>
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {(index < skills.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>

                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-header pl-4 text-sm border border-light">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div>Education <span className="text-danger">*</span></div>
                                        <div>
                                            <Tooltip title="Add Skill">
                                                <IconButton size='small' color='success' data-toggle="modal" data-target={`#education_info_0`} onClick={() => {
                                                    setIsModalOpen('YES');
                                                    setModalOpenId(0);
                                                    setModalIndex(4);
                                                    setModalData({
                                                        course: course?.id,
                                                        course_highlights: courseHighlights,
                                                        year_graduated: yearGraduated
                                                    });
                                                }}>
                                                    <span className="material-icons-outlined">edit</span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0 text--fontPos13--xW8hS">
                                    {
                                        !course || !courseHighlights || !yearGraduated
                                            ? <div className='p-4 text-center text-muted'>
                                                Update your education to make it easier for employers to find and hire you.
                                            </div> : <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Course:</div>
                                                        <div className="col-xl-7">{course.course_name}</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Course Highlights:</div>
                                                        <div className="col-xl-7">{courseHighlights}</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Year Graduated:</div>
                                                        <div className="col-xl-7">{yearGraduated}</div>
                                                    </div>
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>

                            <div className="card text-dark fade-up elevation-0 bg-white">
                                <div className="card-header pl-4 text-sm border border-light">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div>Personal Scale Meter <span className="text-danger">*</span></div>
                                        <div>
                                            <Tooltip title="Personal Scale Meter">
                                                <IconButton size='small' color='success' data-toggle="modal" data-target={`#personal_scale_info_0`} onClick={() => {
                                                    setIsModalOpen('YES');
                                                    setModalOpenId(0);
                                                    setModalIndex(6);
                                                    setModalData({
                                                        general_appearance: generalAppearance,
                                                        manner_of_speaking: mannerOfSpeaking,
                                                        physical_condition: physicalCondition,
                                                        mental_alertness: mentalAlertness,
                                                        self_confidence: selfConfidence,
                                                        ability_to_present_ideas: abilityToPresentIdeas,
                                                        communication_skills: communicationSkills,
                                                        student_performance_rating: studentPerformanceRating
                                                    });
                                                }}>
                                                    <span className="material-icons-outlined">edit</span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0 text--fontPos13--xW8hS">
                                    {
                                        generalAppearance === 0 ||
                                            mannerOfSpeaking === 0 ||
                                            physicalCondition === 0 ||
                                            mentalAlertness === 0 ||
                                            selfConfidence === 0 ||
                                            abilityToPresentIdeas === 0 ||
                                            communicationSkills === 0 ||
                                            studentPerformanceRating === 0
                                            ? <div className='p-4 text-center text-muted'>
                                                Update your personal assessment scale to make it easier for you to find jobs.
                                            </div> : <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">General Appearance:</div>
                                                        <div className="col-xl-7">{generalAppearance} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Manner of Speaking:</div>
                                                        <div className="col-xl-7">{mannerOfSpeaking} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Mental Alertness:</div>
                                                        <div className="col-xl-7">{mentalAlertness} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Physical Condition:</div>
                                                        <div className="col-xl-7">{physicalCondition} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Self-Confidence:</div>
                                                        <div className="col-xl-7">{selfConfidence} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Presentation of Ideas:</div>
                                                        <div className="col-xl-7">{abilityToPresentIdeas} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Communication Skills:</div>
                                                        <div className="col-xl-7">{communicationSkills} / 5</div>
                                                    </div>
                                                    <Divider sx={{ opacity: '0.3' }} />

                                                    <div className="row py-2 px-4">
                                                        <div className="col-xl-5 text-bold">Performance Rating:</div>
                                                        <div className="col-xl-7">{studentPerformanceRating} / 5</div>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>

                            <div className="card mb-3 text-dark fade-up elevation-0 bg-white">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <button type="submit" disabled={
                                                !fname ||
                                                !mname ||
                                                !lname ||
                                                !email ||
                                                !password ||
                                                !course ||
                                                !courseHighlights ||
                                                !yearGraduated ||
                                                !isPasswordRuleValid ||
                                                generalAppearance === 0 ||
                                                mannerOfSpeaking === 0 ||
                                                physicalCondition === 0 ||
                                                mentalAlertness === 0 ||
                                                selfConfidence === 0 ||
                                                abilityToPresentIdeas === 0 ||
                                                communicationSkills === 0 ||
                                                studentPerformanceRating === 0 ||
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
        </>
    )
}

export default AlumniRegistration;
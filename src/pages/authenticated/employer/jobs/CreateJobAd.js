/* global $ */
/* global Wizard */
import { Autocomplete, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useGetToken from "../../../../hooks/useGetToken";
import useSystemURLCon from "../../../../hooks/useSystemURLCon";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGetCurrentUser from "../../../../hooks/useGetCurrentUser";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import CloseIcon from '@mui/icons-material/Close';
import useGetCourses from "../../../../hooks/useGetCourses";
import GoogleMapLocationPicker from "../../components/GoogleMapLocationPicker/GoogleMapLocationPicker";
import './CreateJobAd.css';

const CreateJobAd = ({ data = null, callbackFunction = null, modalId = null }) => {
    // 1
    const [companyName, setCompanyName] = useState("");
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [workplaceOption, setWorkplaceOption] = useState("");
    const [workType, setWorkType] = useState("");
    const [course, setCourse] = useState([]);
    const [locationCoordinates, setLocationCoordinates] = useState("");
    // 2
    const [payType, setPayType] = useState("");
    const [currency, setCurrency] = useState("");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    // 3
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    // 4
    const [minGeneralAppearance, setMinGeneralAppearance] = useState(0);
    const [minMannerOfSpeaking, setMinMannerOfSpeaking] = useState(0);
    const [minPhysicalCondition, setMinPhysicalCondition] = useState(0);
    const [minMentalAlertness, setMinMentalAlertness] = useState(0);
    const [minSelfConfidence, setMinSelfConfidence] = useState(0);
    const [minAbilityToPresentIdeas, setMinAbilityToPresentIdeas] = useState(0);
    const [minCommunicationSkills, setMinCommunicationSkills] = useState(0);
    const [minStudentPerformanceRating, setMinStudentPerformanceRating] = useState(0);
    // 5
    const [status, setStatus] = useState("");

    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isFetching, setIsFetching] = useState(true);
    const { courses, isFetchingCourses } = useGetCourses();
    const { userData } = useGetCurrentUser();

    const SaveUserProfileChanges = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('company_name', companyName);
            formData.append('title', title);
            course.forEach((c, _) => formData.append(`course[]`, c));
            formData.append('location', location);
            formData.append('location_coordinates', locationCoordinates);
            formData.append('workplace_option', workplaceOption);
            formData.append('work_type', workType);
            formData.append('pay_type', payType);
            formData.append('summary', summary);
            formData.append('description', description);
            formData.append('status', status);
            formData.append('currency', currency);
            formData.append('from_amount', fromAmount);
            formData.append('to_amount', toAmount);
            formData.append('min_general_appearance', minGeneralAppearance);
            formData.append('min_manner_of_speaking', minMannerOfSpeaking);
            formData.append('min_physical_condition', minPhysicalCondition);
            formData.append('min_mental_alertness', minMentalAlertness);
            formData.append('min_self_confidence', minSelfConfidence);
            formData.append('min_ability_to_present_ideas', minAbilityToPresentIdeas);
            formData.append('min_communication_skills', minCommunicationSkills);
            formData.append('min_student_performance_rating', minStudentPerformanceRating);

            if (data) formData.append('documentId', data.id);

            const response = await axios.post(`${url}/authenticated/employer/jobs/create`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                alert(response.data.message);

                if (!callbackFunction) {
                    navigate('/welcome/employer/jobs');
                } else {
                    callbackFunction();
                }
            }
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        console.log(data);


        if (data || userData) {
            setCompanyName(data?.company_name || "");
            setTitle(data?.title || "");
            setLocation(data?.location || "");
            setLocationCoordinates(data?.location_coordinates || "");
            setCourse(data?.course || "");

            data?.courses?.forEach(r => setCourse(w => [...w, r.id]));

            setWorkplaceOption(data?.workplace_option || "");
            setWorkType(data?.work_type || "");
            setPayType(data?.pay_type || "");
            setSummary(data?.summary || "");
            setDescription(data?.description || "");
            setStatus(data?.status || "ACTIVE");

            if (data?.pay_range_details) {
                setCurrency(data?.pay_range_details.currency || "PHP");
                setFromAmount(data?.pay_range_details.from_amount || 0);
                setToAmount(data?.pay_range_details.to_amount || 0);
            }

            setMinGeneralAppearance(data?.min_general_appearance || 0);
            setMinMannerOfSpeaking(data?.min_manner_of_speaking || 0);
            setMinPhysicalCondition(data?.min_physical_condition || 0);
            setMinMentalAlertness(data?.min_mental_alertness || 0);
            setMinSelfConfidence(data?.min_self_confidence || 0);
            setMinAbilityToPresentIdeas(data?.min_ability_to_present_ideas || 0);
            setMinCommunicationSkills(data?.min_communication_skills || 0);
            setMinStudentPerformanceRating(data?.min_student_performance_rating || 0);

            setIsFetching(false);
        }

        if ($(".basicwizard").length > 0) {
            new Wizard(".basicwizard", {
                validate: true,
                progress: true
            });
        }
    }, [data, userData]);

    useEffect(() => {
        console.log("Course Added: ", course);
    }, [course]);

    return (
        <>
            <div className={`d-flex align-items-center ${data ? 'px-3' : 'mb-3'} justify-content-between`}>
                <h3 className="text-bold text-muted">{data ? 'Update' : 'Create'} Job Post</h3>

                {
                    data && <>
                        <IconButton onClick={() => callbackFunction()} color="error">
                            <CloseIcon />
                        </IconButton>
                    </>
                }
            </div>


            {
                isFetching || isFetchingCourses
                    ? <SkeletonLoader onViewMode={data ? 'update' : ''} />
                    : <>
                        {
                            ["APPROVED"].includes(userData?.account_status)
                                ? <div className={`card card-outline card-outline-tabs card-success basicwizard ${data && 'border-0 m-0 elevation-0 shadow-0'}`}>
                                    <div className="card-header border-0 p-0">
                                        <ul className="nav nav-tabs small sr-only" id="custom-tabs-header-tab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active rounded-0" id="custom-tabs-1-tab" data-toggle="pill" href="#custom-tabs-1" role="tab" aria-controls="custom-tabs-1" aria-selected="true">
                                                    I. Basic Details
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link rounded-0" id="custom-tabs-2-tab" data-toggle="pill" href="#custom-tabs-2" role="tab" aria-controls="custom-tabs-2" aria-selected="true">
                                                    II. Payment
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link rounded-0" id="custom-tabs-3-tab" data-toggle="pill" href="#custom-tabs-3" role="tab" aria-controls="custom-tabs-3" aria-selected="true">
                                                    III. Additional Job Details
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link rounded-0" id="custom-tabs-4-tab" data-toggle="pill" href="#custom-tabs-4" role="tab" aria-controls="custom-tabs-4" aria-selected="true">
                                                    IV. Specific Scale Requirement
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link rounded-0" id="custom-tabs-5-tab" data-toggle="pill" href="#custom-tabs-5" role="tab" aria-controls="custom-tabs-5" aria-selected="true">
                                                    V. Job Availability
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="card-body">
                                        <div className="tab-content" id="custom-tabs-four-tabContent">
                                            <div className="tab-pane fade show active" id="custom-tabs-1" role="tabpanel" aria-labelledby="custom-tabs-1-tab">
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <label className="form-label text-sm mb-3">Basic Details</label>

                                                        <FormControl fullWidth margin='dense' variant="outlined">
                                                            <InputLabel htmlFor="companyName">Company Name <span className='text-danger'>*</span></InputLabel>
                                                            <OutlinedInput
                                                                required
                                                                value={companyName}
                                                                onChange={(e) => setCompanyName(e.target.value)}
                                                                id="companyName"
                                                                type="text"
                                                                label="Company Name"
                                                            />
                                                        </FormControl>

                                                        <FormControl fullWidth margin='dense' variant="outlined">
                                                            <InputLabel htmlFor="title">Title <span className='text-danger'>*</span></InputLabel>
                                                            <OutlinedInput
                                                                required
                                                                value={title}
                                                                onChange={(e) => setTitle(e.target.value)}
                                                                id="title"
                                                                type="text"
                                                                label="Title"
                                                            />
                                                        </FormControl>

                                                        <FormControl fullWidth margin='dense' variant="outlined">
                                                            <Autocomplete
                                                                multiple
                                                                limitTags={2}
                                                                options={courses}
                                                                defaultValue={courses?.filter((g) => course.includes(g.id))}
                                                                getOptionLabel={(option) => option.course_name}
                                                                onChange={(e, value) => setCourse(value.map((item) => item.id))}
                                                                fullWidth
                                                                renderInput={(params) => <TextField {...params} label="Course or qualification" />}
                                                                slotProps={{
                                                                    popper: {
                                                                        sx: { zIndex: 9999 }
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>

                                                        <GoogleMapLocationPicker defaultValue={{
                                                            location: location,
                                                            coordinates: locationCoordinates
                                                        }} callbackFunction={(e) => {
                                                            if (e.coordinates) {
                                                                setLocation(e.location);
                                                                setLocationCoordinates(e.coordinates);
                                                            } else {
                                                                setLocation('');
                                                                setLocationCoordinates('');
                                                            }
                                                        }} />

                                                        <FormControl fullWidth margin='dense'>
                                                            <InputLabel id="demo-simple-workplaceOption-label">Workplace <span className='text-danger'>*</span></InputLabel>
                                                            <Select
                                                                required
                                                                labelId="demo-simple-workplaceOption-label"
                                                                id="demo-simple-workplaceOption"
                                                                value={workplaceOption}
                                                                label="Workplace"
                                                                onChange={(e) => setWorkplaceOption(e.target.value)}
                                                            >
                                                                <MenuItem value="ON-SITE">ON-SITE</MenuItem>
                                                                <MenuItem value="HYBRID">HYBRID</MenuItem>
                                                                <MenuItem value="REMOTE">REMOTE</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        <FormControl fullWidth margin='dense'>
                                                            <InputLabel id="demo-simple-workType-label">Work Type <span className='text-danger'>*</span></InputLabel>
                                                            <Select
                                                                required
                                                                labelId="demo-simple-workType-label"
                                                                id="demo-simple-workType"
                                                                value={workType}
                                                                label="Work Type"
                                                                onChange={(e) => setWorkType(e.target.value)}
                                                            >
                                                                <MenuItem value="FULL-TIME">FULL-TIME</MenuItem>
                                                                <MenuItem value="PART-TIME">PART-TIME</MenuItem>
                                                                <MenuItem value="CONTRACT">CONTRACT</MenuItem>
                                                                <MenuItem value="CASUAL">CASUAL</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="custom-tabs-2" role="tabpanel" aria-labelledby="custom-tabs-2-tab">
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <label className="form-label text-sm mb-3">Payment</label>

                                                        <FormControl fullWidth margin='dense'>
                                                            <InputLabel id="demo-simple-payType-label">Pay Type <span className='text-danger'>*</span></InputLabel>
                                                            <Select
                                                                required
                                                                labelId="demo-simple-payType-label"
                                                                id="demo-simple-payType"
                                                                value={payType}
                                                                label="Pay Type"
                                                                onChange={(e) => setPayType(e.target.value)}
                                                            >
                                                                <MenuItem value="HOURLY">HOURLY</MenuItem>
                                                                <MenuItem value="MONTHLY">MONTHLY</MenuItem>
                                                                <MenuItem value="ANNUALLY">ANNUALLY</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        <FormControl fullWidth margin='dense'>
                                                            <InputLabel id="demo-simple-currency-label">Currency <span className='text-danger'>*</span></InputLabel>
                                                            <Select
                                                                required
                                                                labelId="demo-simple-currency-label"
                                                                id="demo-simple-currency"
                                                                value={currency}
                                                                label="Currency"
                                                                onChange={(e) => setCurrency(e.target.value)}
                                                            >
                                                                <MenuItem value="PHP">PHP - Philippine Peso</MenuItem>
                                                                <MenuItem value="USD">USD - US Dollar</MenuItem>
                                                                <MenuItem value="EUR">EUR - Euro</MenuItem>
                                                                <MenuItem value="GBP">GBP - British Pound</MenuItem>
                                                                <MenuItem value="SGD">SGD - Singapore Dollar</MenuItem>
                                                                <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                                                                <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        <FormControl fullWidth margin='dense' variant="outlined">
                                                            <InputLabel htmlFor="fromAmount">From Amount <span className='text-danger'>*</span></InputLabel>
                                                            <OutlinedInput
                                                                required
                                                                value={fromAmount}
                                                                onChange={(e) => setFromAmount(e.target.value)}
                                                                id="fromAmount"
                                                                type="number"
                                                                label="From Amount"
                                                            />
                                                        </FormControl>

                                                        <FormControl fullWidth margin='dense' variant="outlined">
                                                            <InputLabel htmlFor="toAmount">To Amount <span className='text-danger'>*</span></InputLabel>
                                                            <OutlinedInput
                                                                required
                                                                value={toAmount}
                                                                onChange={(e) => setToAmount(e.target.value)}
                                                                id="toAmount"
                                                                type="number"
                                                                label="To Amount"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="custom-tabs-3" role="tabpanel" aria-labelledby="custom-tabs-3-tab">
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <label className="form-label text-sm mb-3">Additional Job Details</label>

                                                        <TextField
                                                            margin='dense'
                                                            fullWidth
                                                            id="outlined-description"
                                                            label={<><span>Job Summary <span className='text-danger'>*</span></span></>}
                                                            multiline
                                                            value={summary}
                                                            onChange={(e) => setSummary(e.target.value)}
                                                            rows={2}
                                                        />

                                                        <TextField
                                                            margin='dense'
                                                            fullWidth
                                                            id="outlined-description"
                                                            label={<><span>Jod Description <span className='text-danger'>*</span></span></>}
                                                            multiline
                                                            value={description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            rows={6}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="custom-tabs-4" role="tabpanel" aria-labelledby="custom-tabs-4-tab">
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <label className="form-label text-sm mb-3">Specific Scale Requirement</label>

                                                        <div className="row">
                                                            {/* General Appearance */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">General Appearance</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    Evaluates the candidate's professional grooming, neatness, and the appropriateness of their attire for a corporate environment.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minGeneralAppearance}
                                                                    onChange={(e, val) => setMinGeneralAppearance(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Manner of Speaking */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Manner of Speaking</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    Assesses the candidate's ability to speak fluently, with proper diction, and maintaining a polite, professional tone during interaction.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minMannerOfSpeaking}
                                                                    onChange={(e, val) => setMinMannerOfSpeaking(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Physical Condition */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Physical Condition</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    Refers to the candidate's apparent health, vitality, and posture, indicating their readiness for the physical demands of the job.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minPhysicalCondition}
                                                                    onChange={(e, val) => setMinPhysicalCondition(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Mental Alertness */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Mental Alertness</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    Measures the candidate's ability to grasp instructions quickly and their capacity to respond intelligently to complex questions.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minMentalAlertness}
                                                                    onChange={(e, val) => setMinMentalAlertness(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Self-Confidence */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Self-Confidence</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    Observes the candidate's poise and composure, looking for a lack of hesitation or nervousness when presenting themselves.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minSelfConfidence}
                                                                    onChange={(e, val) => setMinSelfConfidence(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Ability to Present Ideas */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Ability to Present Ideas</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    Evaluates the logical organization of thoughts and the effectiveness of the candidate's explanations or arguments.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minAbilityToPresentIdeas}
                                                                    onChange={(e, val) => setMinAbilityToPresentIdeas(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Communication Skills */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Communication Skills</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    The overall proficiency in using the English language to convey messages clearly and effectively in a workplace setting.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minCommunicationSkills}
                                                                    onChange={(e, val) => setMinCommunicationSkills(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>

                                                            {/* Student Performance Rating */}
                                                            <div className="col-xl-6 px-3 mb-4">
                                                                <Typography variant="subtitle1" className="fw-bold">Student Performance Rating</Typography>
                                                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                                                    The final weighted average or overall score based on both academic performance and behavioral appraisal results.
                                                                </Typography>
                                                                <Slider
                                                                    color="success"
                                                                    value={minStudentPerformanceRating}
                                                                    onChange={(e, val) => setMinStudentPerformanceRating(val)}
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={5}
                                                                    valueLabelDisplay="auto"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="custom-tabs-5" role="tabpanel" aria-labelledby="custom-tabs-5-tab">
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <label className="form-label text-sm mb-3">Job Availability</label>

                                                        <FormControl fullWidth margin='dense'>
                                                            <InputLabel id="demo-simple-status-label">Status <span className='text-danger'>*</span></InputLabel>
                                                            <Select
                                                                required
                                                                labelId="demo-simple-status-label"
                                                                id="demo-simple-status"
                                                                value={status}
                                                                label="Status"
                                                                onChange={(e) => setStatus(e.target.value)}
                                                                MenuProps={{
                                                                    disableScrollLock: true,
                                                                    container: () => document.getElementById(modalId),
                                                                    PaperProps: { sx: { zIndex: 999999 } }
                                                                }}
                                                            >
                                                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                                                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                                                                <MenuItem value="DRAFT">DRAFT</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer bg-white border-top pt-0">
                                        <div id="bar" className="progress my-3" style={{ height: '7px' }}>
                                            <div className="bar progress-bar progress-bar-striped progress-bar-animated bg-success"></div>
                                        </div>

                                        <div className="row">
                                            <div className="text-left col-4 text-sm pt-1 counter"></div>

                                            <div className="col-8 text-right">
                                                <button type='button' className="previous-wizard btn btn-default btn-sm">
                                                    <i className="fas fa-arrow-left mr-1"></i> Back
                                                </button>

                                                <button type='button' className="next-wizard btn btn-success btn-sm elevation-1 mx-1">
                                                    Next <i className="fas fa-arrow-right ml-1"></i>
                                                </button>

                                                <button type='button' onClick={() => SaveUserProfileChanges()} disabled={
                                                    // !companyName ||
                                                    // !title ||
                                                    // !location ||
                                                    // !locationCoordinates ||
                                                    // !workplaceOption ||
                                                    // !workType ||
                                                    // !payType ||
                                                    // !course ||
                                                    // !summary ||
                                                    // !description ||
                                                    // !status ||
                                                    isSubmitting
                                                } className={`submitRegistration ml-1 finish btn btn-success btn-sm elevation-1 sr-only`}>
                                                    <i className="fas fa-save mr-1"></i> Save Job Post
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <>
                                    <div className="alert alert-warning">
                                        You can’t post a job right now. Your account is still awaiting approval from the admin.
                                    </div>
                                </>
                        }
                    </>
            }
        </>
    )
}

export default CreateJobAd;
/* global $ */
import { Autocomplete, FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useGetCourses from '../../../../../hooks/useGetCourses';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';

const EducationDrawer = ({ id, data, modalTitle, callbackFunction, isFromGuest = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [course, setCourse] = useState("");
    const [courseHighlights, setCourseHighlights] = useState("");
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [yearGraduated, setYearGraduated] = useState(null);
    const { courses, isFetchingCourses } = useGetCourses();

    const handleClose = () => {
        if (isFromGuest) {
            const formattedYear = yearGraduated ? yearGraduated.format("YYYY") : null;

            callbackFunction({
                course: courses?.find((g) => g.id === course),
                courseHighlights,
                yearGraduated: formattedYear
            });
        } else {
            callbackFunction(false);
        }

        $(`#education_info_${id}`).modal('hide');
    }

    useEffect(() => {
        if (data) {
            setCourse(data?.course);
            setCourseHighlights(data?.course_highlights);
            setYearGraduated(dayjs().year(data?.year_graduated));
        }
    }, [data]);

    const SubmitCertificationOrLicense = async () => {
        try {
            setIsSubmitting(true);

            if (isFromGuest) {
                return;
            }

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('course', course);
            formData.append('courseHighlights', courseHighlights);
            formData.append('yearGraduated', yearGraduated.format('YYYY'));
            if (data) formData.append('documentId', data.id);

            await axios.post(`${url}/authenticated/job-seeker/manage-account/create-or-update-education`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });
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
                id={`education_info_${id}`}
                isModalCentered={true}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pt-1 pb-2'}
                body={
                    <>
                        {
                            isFetchingCourses
                                ? <SkeletonLoader onViewMode={'update'} />
                                : <>
                                    <FormControl fullWidth margin='dense' variant="outlined">
                                        <Autocomplete
                                            options={courses}
                                            defaultValue={courses?.find((g) => g.id === course)}
                                            getOptionLabel={(option) => option.course_name}
                                            onChange={(e, value) => setCourse(value ? value.id : '')}
                                            fullWidth
                                            renderInput={(params) => <TextField {...params} label="Course or qualification" />}
                                            slotProps={{
                                                popper: {
                                                    container: () => document.getElementById(`education_info_${id}`),
                                                    sx: { zIndex: 10000000 }
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <TextField
                                        margin='dense'
                                        fullWidth
                                        id="outlined-description"
                                        label={<><span>Course highlights</span></>}
                                        multiline
                                        value={courseHighlights}
                                        onChange={(e) => setCourseHighlights(e.target.value)}
                                        rows={4}
                                    />

                                    <FormControl fullWidth margin='dense'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                views={['year']}
                                                value={yearGraduated}
                                                maxDate={dayjs()}
                                                onChange={(e) => setYearGraduated(e)}
                                                label={<p>Year Graduated <span className='text-danger'>*</span></p>}
                                                sx={{ width: '100%' }}
                                                slotProps={{
                                                    popper: {
                                                        container: () => document.getElementById(`education_info_${id}`),
                                                        disablePortal: false,
                                                        sx: { zIndex: 10000000 }
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SubmitCertificationOrLicense()} disabled={
                            !course || !yearGraduated || isSubmitting || isFetchingCourses
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default EducationDrawer;
/* global $ */
import { Autocomplete, FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useGetToken from '../../../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../../../hooks/useSystemURLCon';
import ModalTemplate from '../../../../../components/ModalTemplate/ModalTemplate';

const ModalCourse = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [course, setCourse] = useState("");
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const handleClose = () => {
        callbackFunction(false);
        $(`#course_info_${id}`).modal('hide');
    }

    useEffect(() => {
        if (data) {
            setCourse(data?.course_name);
        }
    }, [data]);

    const SubmitCourse = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('course', course);
            if (data) formData.append('documentId', data.id);

            await axios.post(`${url}/authenticated/administrator/system-settings/create-or-update-course`, formData, {
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
                id={`course_info_${id}`}
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
                            <InputLabel htmlFor="course">Course Name</InputLabel>
                            <OutlinedInput
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                id="course"
                                type="text"
                                label="Course Name"
                            />
                        </FormControl>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SubmitCourse()} disabled={!course || isSubmitting} className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default ModalCourse;
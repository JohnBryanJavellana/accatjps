/* global $ */
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import axios from 'axios';
import { useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';

const LanguagesDrawer = ({ id, data, modalTitle, callbackFunction, isFromGuest = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [language, setLanguage] = useState("");
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const handleClose = () => {
        if (isFromGuest) {
            callbackFunction({
                language
            });
        } else {
            callbackFunction(false);
        }
        $(`#language_info_${id}`).modal('hide');
    }

    const SubmitLanguage = async () => {
        try {
            setIsSubmitting(true);

            if (isFromGuest) {
                return;
            }

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('language', language);

            const response = await axios.post(`${url}/authenticated/job-seeker/manage-account/new-language`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                handleClose();
            }
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
                id={`language_info_${id}`}
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
                            <InputLabel htmlFor="language">Language <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
                                disabled={isSubmitting}
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                id="language"
                                type="text"
                                label="Language"
                            />
                        </FormControl>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SubmitLanguage()} disabled={
                            !language ||
                            isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default LanguagesDrawer;
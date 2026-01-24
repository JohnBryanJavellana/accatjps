/* global $ */
import { useState } from 'react';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDateFormat from '../../../../../hooks/useDateFormat';
import useFormatNumber from '../../../../../hooks/useFormatNumber';
import AttachFileRequirements from './AttachFileRequirements';
import JobDetails from '../../../employer/jobs/component/JobDetails';

const AViewJobPost = ({ id, data, modalTitle, callbackFunction, isViewOnly = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const handleClose = () => {
        callbackFunction(false);
        $(`#view_job_post_${id}`).modal('hide');
    }

    console.log("DATAAAA: ", data);

    const SaveJobPost = async (status) => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('status', status);
            formData.append('documentId', data.id);

            const response = await axios.post(`${url}/authenticated/job-seeker/get-applicable-jobs/save-job-post`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                alert(response.data.message);
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
                id={`view_job_post_${id}`}
                size={'xl'}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pb-2 text-sm'}
                body={
                    <>
                        <AttachFileRequirements
                            id={data.id}
                            data={{
                                id: data.id
                            }}
                            modalTitle="Attach Documents"
                            callbackFunction={handleClose}
                        />

                        <JobDetails jobId={data?.id} />
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn-sm btn btn-default elevation-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        {
                            !isViewOnly && <>
                                {
                                    !data?.is_bookmarked ?
                                        <button type="button" onClick={() => SaveJobPost('SAVE')} disabled={isSubmitting} className={`btn-sm btn btn-default elevation-1 mx-1`}>
                                            <i className='far fa-bookmark mr-1'></i> Save
                                        </button> : <button type="button" onClick={() => SaveJobPost('REMOVE')} disabled={isSubmitting} className={`btn-sm btn btn-default elevation-1 mx-1`}>
                                            <i className='fas fa-trash mr-1'></i> Remove in Saved Jobs
                                        </button>
                                }

                                <button type="button" data-toggle="modal" data-target={`#apply_job_${id}`} className={`btn-sm btn btn-success elevation-1`}>
                                    <i className='fas fa-briefcase mr-2'></i> Apply Now
                                </button>
                            </>
                        }
                    </>
                }
            />
        </>
    )
}

export default AViewJobPost;
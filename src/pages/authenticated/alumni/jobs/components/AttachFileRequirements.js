/* global $ */
import { useState } from 'react';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AttachFileRequirements = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);

    const handleClose = () => {
        $(`#apply_job_${id}`).modal('hide');
    }

    const ApplyJob = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('documentId', data.id);
            formData.append('resume', resume);
            formData.append('cover_letter', coverLetter);

            const response = await axios.post(`${url}/authenticated/job-seeker/get-applicable-jobs/apply-job`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                alert(response.data.message);
                handleClose();
                callbackFunction();
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
                id={`apply_job_${id}`}
                isModalCentered
                modalParentStyle={'bg-stack'}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pb-2 text-sm'}
                body={
                    <div className="container-fluid pt-2">
                        <div className="callout callout-success mb-4">
                            <h6 className='text-bold'><i className="fas fa-info mr-2"></i> Application for {data?.title}</h6>
                            <p className="mb-0 text-sm">Please upload your latest documents. PDF format is preferred.</p>
                        </div>

                        <div className="row">
                            {/* Resume Upload */}
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="resume_upload">
                                        <i className="fas fa-file-pdf mr-1 text-danger"></i> Resume / CV <span className="text-danger">*</span>
                                    </label>
                                    <div className="custom-file text-truncate">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="resume_upload"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const val = e.target.files[0];

                                                if (val.size > 5 * 1024 * 1024) {
                                                    alert("File is too large. Please upload a file smaller than 5MB.");
                                                    return;
                                                }

                                                setResume(val);
                                            }}
                                        />
                                        <label className="custom-file-label" htmlFor="resume_upload">
                                            {resume ? resume.name : 'Choose file...'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Letter Upload */}
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="cover_letter_upload">
                                        <i className="fas fa-envelope-open-text mr-1 text-primary"></i> Cover Letter (Optional)
                                    </label>
                                    <div className="custom-file text-truncate">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="cover_letter_upload"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const val = e.target.files[0];

                                                if (val.size > 5 * 1024 * 1024) {
                                                    alert("File is too large. Please upload a file smaller than 5MB.");
                                                    return;
                                                }

                                                setCoverLetter(val);
                                            }}
                                        />
                                        <label className="custom-file-label" htmlFor="cover_letter_upload">
                                            {coverLetter ? coverLetter.name : 'Choose file...'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Files Preview */}
                        {(resume || coverLetter) && (
                            <div className="mt-3 p-4 bg-light border rounded">
                                <p className="mb-1 text-bold text-xs uppercase text-muted">Ready to upload:</p>
                                {resume && <div className="text-sm text-success"><i className="fas fa-check-circle mr-1"></i> Resume: {resume.name}</div>}
                                {coverLetter && <div className="text-sm text-success"><i className="fas fa-check-circle mr-1"></i> Cover Letter: {coverLetter.name}</div>}
                            </div>
                        )}
                    </div>
                }
                footer={
                    <>
                        <button type='button' className='btn-sm btn btn-default elevation-1' disabled={isSubmitting} onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => ApplyJob()} disabled={isSubmitting} className={`btn-sm btn btn-success elevation-1`}>
                            <i className='fas fa-paper-plane mr-2'></i> {isSubmitting ? 'Submitting' : 'Submit'} Application
                        </button>
                    </>
                }
            />
        </>
    )
}

export default AttachFileRequirements;
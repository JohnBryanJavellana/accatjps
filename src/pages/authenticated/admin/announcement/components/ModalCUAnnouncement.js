/* global $ */
import { FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useEffect, useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import CustomFileUpload from '../../../components/CustomFileUpload/CustomFileUpload';

const ModalCUAnnouncement = ({ id, data, modalTitle, callbackFunction, canMessage = "0" }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        setTitle(data?.title);
        setContent(data?.content);
    }, [data]);

    const SaveAnnouncement = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('can_message', canMessage);
            formData.append('attachment', attachment);
            if (data) formData.append('documentId', data?.id);

            await axios.post(`${url}/authenticated/administrator/announcement/create-or-update-announcement`, formData, {
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

    const handleClose = () => {
        callbackFunction(false);
        $(`#announcement_cu_info_${id}`).modal('hide');
    }

    return (
        <>
            <ModalTemplate
                id={`announcement_cu_info_${id}`}
                headerClassName={'bg-success'}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pt-1 pb-2'}
                body={
                    <>
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

                        <TextField
                            margin='dense'
                            fullWidth
                            id="outlined-description"
                            label={<><span>Content <span className='text-danger'>*</span></span></>}
                            multiline
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                        />

                        <CustomFileUpload
                            id="sec"
                            label={`${data ? 'Update' : 'Add'} Photo`}
                            description={`${data ? 'Update' : 'Add'} photo to your post or announcement`}
                            icon="fas fa-file"
                            color="#14a8fd"
                            file={attachment}
                            setFile={setAttachment}
                        />
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SaveAnnouncement()} disabled={
                            !title ||
                            !content ||
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

export default ModalCUAnnouncement;
/* global $ */
import { FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
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

const LicenseAndCertificationsDrawer = ({ id, data, modalTitle, callbackFunction, isFromGuest = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [certificate, setCetificate] = useState("");
    const [certificateDescription, setCertificateDescription] = useState("");
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const [expiryDate, setExpiryDate] = useState(null);

    const handleClose = () => {
        if (isFromGuest) {
            const formattedDate = expiryDate ? expiryDate.format("YYYY-MM-DD") : null;

            callbackFunction({
                certificate,
                certificateDescription,
                expiryDate: formattedDate,
                index: data?.index
            });
        } else {
            callbackFunction(false);
        }
        $(`#lc_info_${id}`).modal('hide');
    }

    useEffect(() => {
        if (data) {
            setCetificate(data?.certificate);
            setExpiryDate(dayjs(data?.expiry_date));
            setCertificateDescription(data?.certificate_description);
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
            formData.append('certificate', certificate);
            formData.append('expiryDate', expiryDate.format('YYYY-MM-DD'));
            formData.append('certificateDescription', certificateDescription);
            if (data) formData.append('documentId', data.id);

            await axios.post(`${url}/authenticated/job-seeker/manage-account/create-or-update-license-and-certification`, formData, {
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
                id={`lc_info_${id}`}
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
                            <InputLabel htmlFor="certificate">Licence or certification name <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
                                value={certificate}
                                onChange={(e) => setCetificate(e.target.value)}
                                id="certificate"
                                type="text"
                                label="Licence or certification name"
                            />
                        </FormControl>

                        <TextField
                            margin='dense'
                            fullWidth
                            id="outlined-description"
                            label={<><span>Details</span></>}
                            multiline
                            value={certificateDescription}
                            onChange={(e) => setCertificateDescription(e.target.value)}
                            rows={4}
                        />

                        <FormControl fullWidth margin='dense'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e)}
                                    label={<p>Expiry Date</p>}
                                    sx={{ width: '100%' }}
                                    slotProps={{
                                        popper: {
                                            sx: { zIndex: 3000 }
                                        },
                                        dialog: {
                                            sx: { zIndex: 3000 }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SubmitCertificationOrLicense()} disabled={
                            !certificateDescription || !certificate || !expiryDate || isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default LicenseAndCertificationsDrawer;
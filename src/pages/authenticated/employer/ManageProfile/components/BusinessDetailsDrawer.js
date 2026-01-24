/* global $ */
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
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
import useCountryList from '../../../../../hooks/useCountryList';

const BusinessDetailsDrawer = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const [businessName, setBusinessName] = useState("");
    const [country, setCountry] = useState("");
    const [businessType, setBusinessType] = useState("");
    const countryList = useCountryList();

    const handleClose = () => {
        callbackFunction(false);
        $(`#business_info_${id}`).modal('hide');
    }

    useEffect(() => {
        if (data) {
            setBusinessName(data?.business_name);
            setBusinessType(data?.business_type);
            setCountry(data?.country);
        }
    }, [data]);

    const SaveBusinessDetailsChanges = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('businessName', businessName);
            formData.append('country', country);
            formData.append('business_type', businessType);

            await axios.post(`${url}/authenticated/employer/manage-account/create-or-update-business-details`, formData, {
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
                id={`business_info_${id}`}
                isModalCentered={true}
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
                            <InputLabel htmlFor="businessName">Business name <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                id="businessName"
                                type="text"
                                label="Business name"
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
                                MenuProps={{
                                    disableScrollLock: true,
                                    container: () => document.getElementById(`business_info_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
                            >
                                <MenuItem value="GOVERNMENT">GOVERNMENT</MenuItem>
                                <MenuItem value="PRIVATE">PRIVATE</MenuItem>
                                <MenuItem value="NGO">NGO</MenuItem>
                                <MenuItem value="FREELANCE">FREELANCE</MenuItem>
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
                                MenuProps={{
                                    disableScrollLock: true,
                                    container: () => document.getElementById(`business_info_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
                            >
                                {countryList.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SaveBusinessDetailsChanges()} disabled={
                            !businessName || !country || isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default BusinessDetailsDrawer;
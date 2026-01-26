/* global $ */
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';

const PersonalDrawer = ({ id, data, modalTitle, callbackFunction }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const [suffix, setSuffix] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [birthday, setBirthday] = useState(null);
    const [contact, setContactNumber] = useState("");
    const [bio, setBio] = useState("");

    const { getToken, removeToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    useEffect(() => {
        setFname(data?.first_name);
        setMname(data?.middle_name);
        setLname(data?.last_name);
        setSuffix(data?.suffix);
        setEmail(data?.email);
        setGender(data?.gender);
        setBirthday(data?.birthday);
        setAddress(data?.address);
        setContactNumber(data?.contact_number);
        setBio(data?.bio);
    }, [data]);

    const SaveUserProfileChanges = async () => {
        try {
            setIsSubmitting(true);

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('fname', fname);
            formData.append('mname', mname);
            formData.append('lname', lname);
            formData.append('suffix', suffix);
            formData.append('email', email);
            formData.append('gender', gender);
            formData.append('address', address);
            formData.append('contact', contact);
            formData.append('birthday', birthday.format('YYYY-MM-DD'));
            formData.append('bio', bio);

            const response = await axios.post(`${url}/authenticated/update-user-profile-info`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                if (response.data.reloggin) {
                    alert(response.data.message);

                    removeToken('access_token');
                    removeToken('refresh_token');
                    navigate('/');
                }

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

    const handleClose = () => {
        callbackFunction(false);
        $(`#personal_info_${id}`).modal('hide');
    }

    return (
        <>
            <ModalTemplate
                id={`personal_info_${id}`}
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
                            <InputLabel htmlFor="mname">Middle name <span className='text-danger'>*</span></InputLabel>
                            <OutlinedInput
                                required
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

                        <FormControl fullWidth margin='dense' variant="outlined">
                            <InputLabel htmlFor="contact">Contact #</InputLabel>
                            <OutlinedInput
                                value={contact}
                                onChange={(e) => setContactNumber(e.target.value)}
                                id="contact"
                                type="text"
                                label="Contact #"
                            />
                        </FormControl>

                        <FormControl fullWidth margin='dense'>
                            <InputLabel id="demo-simple-suffix-label">Suffix</InputLabel>
                            <Select
                                labelId="demo-simple-suffix-label"
                                id="demo-simple-suffix"
                                value={suffix}
                                label="Suffix"
                                onChange={(e) => setSuffix(e.target.value)}
                                MenuProps={{
                                    disableScrollLock: true,
                                    container: () => document.getElementById(`personal_info_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
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

                        <FormControl fullWidth margin='dense'>
                            <InputLabel id="demo-simple-gender-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-gender-label"
                                id="demo-simple-gender"
                                value={gender}
                                label="Gender"
                                onChange={(e) => setGender(e.target.value)}
                                MenuProps={{
                                    disableScrollLock: true,
                                    container: () => document.getElementById(`personal_info_${id}`),
                                    PaperProps: {
                                        sx: { zIndex: 3000 }
                                    }
                                }}
                            >
                                <MenuItem value="MALE">MALE</MenuItem>
                                <MenuItem value="FEMALE">FEMALE</MenuItem>
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

                        <FormControl fullWidth margin='dense'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    maxDate={dayjs()}
                                    value={birthday}
                                    onChange={(e) => setBirthday(e)}
                                    label={<p>Birthdate</p>}
                                    sx={{ width: '100%' }}
                                    slotProps={{
                                        popper: {
                                            container: () => document.getElementById(`personal_info_${id}`),
                                            sx: { zIndex: 99999 }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>

                        <TextField
                            margin='dense'
                            fullWidth
                            id="outlined-description"
                            label={<><span>Home Address</span></>}
                            multiline
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                        />

                        <TextField
                            margin='dense'
                            fullWidth
                            id="outlined-description"
                            label={<><span>Bio</span></>}
                            multiline
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                        />
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SaveUserProfileChanges()} disabled={
                            !fname ||
                            !mname ||
                            !lname ||
                            !email ||
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

export default PersonalDrawer;
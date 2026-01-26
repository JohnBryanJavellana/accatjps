import { Box, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import useGetCurrentUser from '../../../../hooks/useGetCurrentUser';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { useRef, useState } from 'react';
import PersonalDrawer from './components/PersonalDrawer';
import useGetToken from '../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDateFormat from '../../../../hooks/useDateFormat';
import dayjs from 'dayjs';
import PasswordDrawer from './components/PasswordDrawer';

const AManageAccount = () => {
    const { userData, refreshUser } = useGetCurrentUser();
    const { getToken } = useGetToken();
    const { url, urlWithoutToken } = useSystemURLCon();
    const navigate = useNavigate();
    const { formatDateToReadable } = useDateFormat();
    const fileInputRef = useRef(null);

    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const UpdatePhoto = async (e) => {
        try {
            let ask = window.confirm(`Are you sure you want to update your profile picture?`);
            if (ask === false) return;

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('profilePicture', e.target.files[0]);

            const response = await axios.post(`${url}/authenticated/update-profile-picture`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                refreshUser();
            }
        } catch (error) {
            alert(error.message);

            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
        }
    }

    return (
        <>
            {
                modalIndex === 0 &&
                <PersonalDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Update Personal Information`}
                    callbackFunction={(e) => {
                        refreshUser();
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                modalIndex === 5 &&
                <PasswordDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Update Password`}
                    callbackFunction={() => {
                        refreshUser();
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                !userData
                    ? <SkeletonLoader />
                    : <>
                        <div className="card shadow-sm border border-light rounded-0 rounded-bottom">
                            <div className="card-body p-0 hero-container">
                                <div className="row p-4">
                                    <div className="col-xl-12">
                                        <div className="text-center">
                                            <input type="file" ref={fileInputRef} onChange={(e) => UpdatePhoto(e)} style={{ display: 'none' }} accept="image/*" />

                                            <div className="position-relative d-inline-block" style={{
                                                cursor: 'pointer',
                                                width: '150px',
                                                height: '150px'
                                            }} onClick={handleImageClick}>
                                                {`${urlWithoutToken}${userData?.profile_picture}`}
                                                <img src={`${urlWithoutToken}${userData?.profile_picture}`} className='rounded-circle elevation-1 img-fluid'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        border: '3px solid white'
                                                    }}
                                                />

                                                <div className="position-absolute bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{
                                                    bottom: '5px',
                                                    right: '5px',
                                                    width: '38px',
                                                    height: '38px',
                                                    border: '1px solid #f0f0f0'
                                                }}>
                                                    <span className="material-icons-outlined text-success" style={{ fontSize: '22px' }}>
                                                        photo_camera
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            userData?.bio && <>
                                                <Box component="section" className='m-2 mt-3 text-center rounded text--fontPos13--xW8hS' sx={{ p: 2, border: '1px dashed lightgrey', backgroundColor: '#def8e634' }}>
                                                    {userData?.bio ?? '--'}
                                                </Box>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border border-light">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>Personal Information</div>
                                    <div>
                                        <Tooltip title="Update Personal Info">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#personal_info_0`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(0);
                                                setModalIndex(0);
                                                setModalData({
                                                    id: userData?.id,
                                                    first_name: userData?.first_name,
                                                    middle_name: userData?.middle_name,
                                                    last_name: userData?.last_name,
                                                    suffix: userData?.suffix,
                                                    bio: userData?.bio,
                                                    gender: userData?.gender,
                                                    birthday: dayjs(userData?.birthday),
                                                    address: userData?.address,
                                                    contact_number: userData?.contact_number,
                                                    email: userData?.email
                                                });
                                            }}>
                                                <span className="material-icons-outlined">edit</span>
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Update Password">
                                            <IconButton size='small' className='ml-2' color='warning' data-toggle="modal" data-target={`#password_info_0`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(0);
                                                setModalIndex(5);
                                                setModalData(null);
                                            }}>
                                                <span className="material-icons-outlined">password</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-xl-12 text--fontPos13--xW8hS">
                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">First name:</div>
                                            <div className="col-xl-9">{userData?.first_name}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Middle name:</div>
                                            <div className="col-xl-9">{userData?.middle_name ?? '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Last name:</div>
                                            <div className="col-xl-9">{userData?.last_name ?? '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Suffix:</div>
                                            <div className="col-xl-9">{userData?.suffix ?? '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Gender:</div>
                                            <div className="col-xl-9">{userData?.gender ?? '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Birthday:</div>
                                            <div className="col-xl-9">{userData?.birthday ? formatDateToReadable(userData?.birthday) : '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Email:</div>
                                            <div className="col-xl-9">{userData?.email}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Home Address:</div>
                                            <div className="col-xl-9">{userData?.address ?? '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Contact #:</div>
                                            <div className="col-xl-9">{userData?.contact_number ?? '--'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default AManageAccount;
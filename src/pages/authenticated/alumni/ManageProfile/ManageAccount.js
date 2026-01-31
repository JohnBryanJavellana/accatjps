import { Box, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import useGetCurrentUser from '../../../../hooks/useGetCurrentUser';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { useRef, useState } from 'react';
import LanguagesDrawer from './components/LanguagesDrawer';
import useGetToken from '../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDateFormat from '../../../../hooks/useDateFormat';
import dayjs from 'dayjs';
import LicenseAndCertificationsDrawer from './components/LicenseAndCertificationsDrawer';
import SkillDrawer from './components/SkillDrawer';
import EducationDrawer from './components/EducationDrawer';
import PersonalDrawer from '../../admin/ManageProfile/components/PersonalDrawer';
import PasswordDrawer from '../../admin/ManageProfile/components/PasswordDrawer';
import PersonalScaleDrawer from './components/PersonalScaleDrawer';

const ManageAccount = () => {
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

    const DeleteDocument = async (id, message, type) => {
        try {
            let ask = window.confirm(`Are you sure you want to remove this ${type} -- ${message}? This cannot be undone`);
            if (ask === false) return;

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('documentId', id);

            const response = await axios.post(`${url}/authenticated/job-seeker/manage-account/remove-${type}`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                refreshUser();
            }
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
        }
    }

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
                modalIndex === 1 &&
                <LanguagesDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Add Language`}
                    callbackFunction={() => {
                        refreshUser();
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                modalIndex === 2 &&
                <LicenseAndCertificationsDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? 'Update' : 'Create'} License or Certifications`}
                    callbackFunction={() => {
                        refreshUser();
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                modalIndex === 3 &&
                <SkillDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Add Skill`}
                    callbackFunction={() => {
                        refreshUser();
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                />
            }

            {
                modalIndex === 4 &&
                <EducationDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? 'Update' : 'Create'} Education`}
                    callbackFunction={() => {
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
                modalIndex === 6 &&
                <PersonalScaleDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Update Personal Scale`}
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
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-3 text-bold">Account Status:</div>
                                            <div className="col-xl-9">
                                                <Chip className='rounded-sm elevation-1' size='small' label={userData?.account_status} color={['DECLINED', 'ON-HOLD'].includes(userData?.account_status) ? 'error' : ['VERIFICATION'].includes(userData?.account_status) ? 'warning' : 'success'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border border-light">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>Languages</div>
                                    <div>
                                        <Tooltip title="Add Language">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#language_info_1`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(1);
                                                setModalIndex(1);
                                                setModalData(null);
                                            }}>
                                                <span className="material-icons-outlined">add</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0 text--fontPos13--xW8hS">
                                {
                                    userData?.languages.length <= 0
                                        ? <div className='p-4 text-center text-muted'>
                                            Add languages to your profile to make it easier for employers to find and hire you.
                                        </div> : <div className="row">
                                            <div className="col-xl-12">
                                                {
                                                    userData?.languages.map((language, index) => (
                                                        <div key={index}>
                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                    {language.language}
                                                                    <div className='ml-5'>
                                                                        <Tooltip title="Remove Language">
                                                                            <IconButton size='small' color='error' onClick={() => {
                                                                                DeleteDocument(language.id, language.language, 'language');
                                                                            }}>
                                                                                <span className="material-icons-outlined" style={{ fontSize: '17px' }}>clear</span>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(index < userData?.languages.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                }

                            </div>
                        </div>

                        <div className="card shadow-sm border border-light">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>Certifications & Licenses</div>
                                    <div>
                                        <Tooltip title="Add Certifications or Licenses">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#lc_info_0`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(0);
                                                setModalIndex(2);
                                                setModalData(null);
                                            }}>
                                                <span className="material-icons-outlined">add</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0 text--fontPos13--xW8hS">
                                {
                                    userData?.certifications.length <= 0
                                        ? <div className='p-4 text-center text-muted'>
                                            Add certifications & licenses to your profile to make it easier for employers to find and hire you.
                                        </div> : <div className="row">
                                            <div className="col-xl-12">
                                                {
                                                    userData?.certifications.map((certificate, index) => (
                                                        <div key={index}>
                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                    <div>
                                                                        <div className='text-bold'>{certificate.certificate}</div>
                                                                        <div>{certificate.certificate_description}</div>
                                                                        <div className='text-muted'>Expiry Date: {formatDateToReadable(certificate.expiry_date)}</div>
                                                                    </div>

                                                                    <div className='ml-5'>
                                                                        <Tooltip title="Remove Certificate or License">
                                                                            <IconButton size='small' color='error' onClick={() => {
                                                                                DeleteDocument(certificate.id, certificate.certificate, 'license-and-certification');
                                                                            }}>
                                                                                <span className="material-icons-outlined" style={{ fontSize: '17px' }}>clear</span>
                                                                            </IconButton>
                                                                        </Tooltip>

                                                                        <Tooltip title="Update Certificate or License">
                                                                            <IconButton size='small' color='warning' data-toggle="modal" data-target={`#lc_info_${certificate.id}`} onClick={() => {
                                                                                setIsModalOpen('YES');
                                                                                setModalOpenId(certificate.id);
                                                                                setModalIndex(2);
                                                                                setModalData(certificate);
                                                                            }}>
                                                                                <span className="material-icons-outlined" style={{ fontSize: '17px' }}>edit</span>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(index < userData?.certifications.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                }

                            </div>
                        </div>

                        <div className="card shadow-sm border border-light">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>Skills</div>
                                    <div>
                                        <Tooltip title="Add Skill">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#skill_info_3`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(3);
                                                setModalIndex(3);
                                                setModalData(null);
                                            }}>
                                                <span className="material-icons-outlined">add</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0 text--fontPos13--xW8hS">
                                {
                                    userData?.skills.length <= 0
                                        ? <div className='p-4 text-center text-muted'>
                                            Add skills to your profile to make it easier for employers to find and hire you.
                                        </div> : <div className="row">
                                            <div className="col-xl-12">
                                                {
                                                    userData?.skills.map((skill, index) => (
                                                        <div key={index}>
                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                    <div>
                                                                        <div>{skill.skill}</div>
                                                                    </div>

                                                                    <div className='ml-5'>
                                                                        <Tooltip title="Remove Skill">
                                                                            <IconButton size='small' color='error' onClick={() => {
                                                                                DeleteDocument(skill.id, skill.skill, 'skill');
                                                                            }}>
                                                                                <span className="material-icons-outlined" style={{ fontSize: '17px' }}>clear</span>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(index < userData?.skills.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                }

                            </div>
                        </div>

                        <div className="card shadow-sm border border-light">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>Education</div>
                                    <div>
                                        <Tooltip title="Add Skill">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#education_info_0`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(0);
                                                setModalIndex(4);
                                                setModalData(userData?.educational_profile);
                                            }}>
                                                <span className="material-icons-outlined">edit</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0 text--fontPos13--xW8hS">
                                {
                                    !userData?.educational_profile
                                        ? <div className='p-4 text-center text-muted'>
                                            Update your education to make it easier for employers to find and hire you.
                                        </div> : <div className="row">
                                            <div className="col-xl-12">
                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Course:</div>
                                                    <div className="col-xl-9">{userData?.educational_profile.course_details.course_name}</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Course Highlights:</div>
                                                    <div className="col-xl-9">{userData?.educational_profile.course_highlights ?? '--'}</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Year Graduated:</div>
                                                    <div className="col-xl-9">{userData?.educational_profile.year_graduated}</div>
                                                </div>
                                            </div>
                                        </div>
                                }

                            </div>
                        </div>

                        <div className="card shadow-sm border border-light">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div>Personal Scale Meter</div>
                                    <div>
                                        <Tooltip title="Add Skill">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#personal_scale_info_0`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(0);
                                                setModalIndex(6);
                                                setModalData(userData?.scale_profile);
                                            }}>
                                                <span className="material-icons-outlined">edit</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="w-100 py-3 d-flex align-items-center justify-content-between">
                                    <div>
                                        <span className="d-block text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.8px' }}>
                                            AI Prediction
                                        </span>
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="mr-2"
                                                style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: userData?.is_ai_recommended ? '#28a745' : '#dc3545' }}
                                            ></div>
                                            <h5 className="mb-0" style={{ fontWeight: '600', color: '#334155', fontSize: '1.1rem' }}>
                                                {userData?.ai_prediction}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0 text--fontPos13--xW8hS">
                                {
                                    !userData?.scale_profile
                                        ? <div className='p-4 text-center text-muted'>
                                            Update your personal assessment scale to make it easier for you to find jobs.
                                        </div> : <div className="row">
                                            <div className="col-xl-12">
                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">General Appearance:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.general_appearance} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Manner of Speaking:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.manner_of_speaking} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Mental Alertness:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.mental_alertness} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Physical Condition:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.physical_condition} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Self-Confidence:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.self_confidence} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Presentation of Ideas:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.ability_to_present_ideas} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Communication Skills:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.communication_skills} / 5</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Performance Rating:</div>
                                                    <div className="col-xl-9">{userData?.scale_profile.student_performance_rating} / 5</div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default ManageAccount;
import { Box, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import useGetCurrentUser from '../../../../hooks/useGetCurrentUser';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { useRef, useState } from 'react';
import useGetToken from '../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDateFormat from '../../../../hooks/useDateFormat';
import dayjs from 'dayjs';
import BusinessDetailsDrawer from './components/BusinessDetailsDrawer';
import PersonalDrawer from '../../admin/ManageProfile/components/PersonalDrawer';
import PasswordDrawer from '../../admin/ManageProfile/components/PasswordDrawer';
import UpdateDocFile from './components/UpdateDocFile';

const EManageAccount = () => {
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
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
        }
    }

    const DocumentItem = ({ data, index, label, description, fileUrl, status, icon, remarks, onAction }) => (
        <div className="col-xl-12 mb-3">
            <div className="p-3 border rounded bg-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div
                            className="bg-light rounded d-flex align-items-center justify-content-center mr-3"
                            style={{ width: '45px', height: '45px', color: '#4a5568' }}
                        >
                            <i className={`${icon} fa-lg`}></i>
                        </div>

                        <div>
                            <div className="fw-bold mb-0" style={{ fontSize: '14px' }}>{label}</div>
                            <span className={`badge px-2 rounded-pill ${status === 'VERIFICATION' ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                                status === 'VERIFIED' ? 'bg-success-subtle text-success border border-success-subtle' :
                                    'bg-danger-subtle text-danger border border-danger-subtle'
                                }`} style={{ fontSize: '10px' }}>
                                {status}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex gap-1">
                        <a
                            href={`${urlWithoutToken}${fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success rounded elevation-1 d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            title="View Document"
                        >
                            <i className="fas fa-eye" style={{ fontSize: '12px' }}></i>
                        </a>

                        {
                            ["REJECTED"].includes(status) &&
                            <button
                                data-toggle="modal"
                                data-target={`#document_info_${data?.id}`}
                                type="button"
                                className="btn btn-sm ml-1 btn-outline-primary rounded elevation-1 d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px' }}
                                title="Update Status"
                                onClick={() => {
                                    setModalData({
                                        id: data?.id,
                                        label: label,
                                        description: description,
                                        icon: icon,
                                        status: status,
                                        remarks: remarks,
                                        index: index
                                    });
                                    setModalOpenId(data.id);
                                    setModalIndex(6);
                                }}
                            >
                                <i className="fas fa-edit" style={{ fontSize: '12px' }}></i>
                            </button>
                        }
                    </div>
                </div>

                {remarks && (
                    <div
                        className="mt-3 px-3 py-1 rounded-2 border-start border-4"
                        style={{
                            backgroundColor: '#fcf8f9',
                            borderLeftColor: status === 'REJECTED' ? '#ef4444' : '#64748b',
                            fontSize: '11px'
                        }}
                    >
                        <div className="text-muted small fw-bold">
                            <i className="fas fa-comment-dots me-1"></i> ADMIN REMARKS:
                        </div>
                        <div className="text-dark">{remarks}</div>
                    </div>
                )}
            </div>
        </div>
    );

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
                <BusinessDetailsDrawer
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`${modalData ? 'Update' : 'Create'} Business Details`}
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
                <UpdateDocFile
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`Update Document`}
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
                                    <div>Business Details</div>
                                    <div>
                                        <Tooltip title="Update Business Details">
                                            <IconButton size='small' color='success' data-toggle="modal" data-target={`#business_info_0`} onClick={() => {
                                                setIsModalOpen('YES');
                                                setModalOpenId(0);
                                                setModalIndex(1);
                                                setModalData(userData?.business_details);
                                            }}>
                                                <span className="material-icons-outlined">edit</span>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0 text--fontPos13--xW8hS">
                                {
                                    !userData?.business_details
                                        ? <div className='p-4 text-center text-muted'>
                                            Update your business details to make it easier for job seekers to find and acquire on you.
                                        </div> : <div className="row">
                                            <div className="col-xl-12">
                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Business Name:</div>
                                                    <div className="col-xl-9">{userData?.business_details.business_name}</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Business Type:</div>
                                                    <div className="col-xl-9">{userData?.business_details.business_type}</div>
                                                </div>
                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-2 px-4">
                                                    <div className="col-xl-3 text-bold">Country:</div>
                                                    <div className="col-xl-9">{userData?.business_details.country}</div>
                                                </div>

                                                <Divider sx={{ opacity: '0.3' }} />

                                                <div className="row py-3 px-4">
                                                    <div className="col-xl-12 mb-3 text-muted text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: '800' }}>
                                                        Supporting Documents
                                                    </div>

                                                    <DocumentItem
                                                        data={userData?.business_details}
                                                        label="Business Permit"
                                                        fileUrl={userData?.business_details.business_permit}
                                                        description="Current Mayor's/Business Permit from your local LGU."
                                                        status={userData?.business_details.business_permit_status}
                                                        remarks={userData?.business_details.business_permit_remarks}
                                                        icon="fas fa-file-contract"
                                                        index={0}
                                                    />

                                                    <DocumentItem
                                                        data={userData?.business_details}
                                                        label="BIR Form 2303"
                                                        fileUrl={userData?.business_details.bir_2303}
                                                        description="Certificate of Registration (COR) for tax verification."
                                                        status={userData?.business_details.bir_2303_status}
                                                        remarks={userData?.business_details.bir_2303_remarks}
                                                        icon="fas fa-file-invoice-dollar"
                                                        index={1}
                                                    />

                                                    <DocumentItem
                                                        data={userData?.business_details}
                                                        label="SEC / DTI Registration"
                                                        fileUrl={userData?.business_details.sec_dti_reg}
                                                        description="SEC Certificate (Corporation) or DTI (Sole Proprietorship)."
                                                        status={userData?.business_details.sec_dti_reg_status}
                                                        remarks={userData?.business_details.sec_dti_reg_remarks}
                                                        icon="fas fa-id-card"
                                                        index={2}
                                                    />
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

export default EManageAccount;
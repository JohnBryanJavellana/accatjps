/* global $ */
import { Divider, IconButton, Tooltip } from '@mui/material';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useDateFormat from '../../../../../hooks/useDateFormat';
import UpdateDocStatus from './UpdateDocStatus';
import { useState } from 'react';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';

const ViewUser = ({ id, data, modalTitle, callbackFunction }) => {
    const { url, urlWithoutToken } = useSystemURLCon();
    const { formatDateToReadable } = useDateFormat();
    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [modalData, setModalData] = useState(null);

    const handleClose = () => {
        callbackFunction(false);
        $(`#view_user_info_${id}`).modal('hide');
    }

    const DocumentItem = ({ data, index, label, docKey, fileUrl, status, icon, remarks, onAction }) => (
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
                            href={`${fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            title="View Document"
                        >
                            <i className="fas fa-eye" style={{ fontSize: '12px' }}></i>
                        </a>

                        {
                            ["VERIFICATION", "REJECTED"].includes(status) &&
                            <button
                                data-toggle="modal"
                                data-target={`#document_info_${data?.id}`}
                                type="button"
                                className="btn btn-sm ml-1 btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px' }}
                                title="Update Status"
                                onClick={() => {
                                    setModalData({
                                        id: data?.id,
                                        label: label,
                                        status: status,
                                        remarks: remarks,
                                        index: index
                                    });
                                    setModalOpenId(data.id);
                                    setModalIndex(0);
                                    // onAction(docKey, label, status, remarks);
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
                            borderLeftColor: status === 'DECLINED' ? '#ef4444' : '#64748b',
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
        </div >
    );

    return (
        <>
            <ModalTemplate
                id={`view_user_info_${id}`}
                size={'md'}
                headerClassName={'bg-success'}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pt-1 pb-2 bg-light'}
                body={
                    <>
                        {
                            modalIndex === 0 &&
                            <UpdateDocStatus
                                id={modalOpenId}
                                modalTitle={"Update Document Status"}
                                data={modalData}
                                callbackFunction={(e) => {
                                    if (e) {
                                        handleClose();
                                    }
                                }}
                            />
                        }

                        <div className="row p-4 hero-container">
                            <div className="col-xl-12">
                                <div className="text-center">
                                    <div className="position-relative d-inline-block" style={{
                                        cursor: 'pointer',
                                        width: '150px',
                                        height: '150px'
                                    }}>
                                        <img src={data?.profile_picture} className='rounded-circle elevation-1 img-fluid'
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                border: '3px solid white'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border border-light mt-2">
                            <div className="card-header pl-4 text-sm border border-light">
                                <div className=''>
                                    <div>Personal Information</div>
                                </div>
                            </div>

                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-xl-12 text--fontPos13--xW8hS">
                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">First name:</div>
                                            <div className="col-xl-12">{data?.first_name}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Middle name:</div>
                                            <div className="col-xl-12">{data?.middle_name || '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Last name:</div>
                                            <div className="col-xl-12">{data?.last_name || '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Suffix:</div>
                                            <div className="col-xl-12">{data?.suffix || '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Gender:</div>
                                            <div className="col-xl-12">{data?.gender || '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Birthday:</div>
                                            <div className="col-xl-12">{data?.birthday ? formatDateToReadable(data?.birthday) : '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Email:</div>
                                            <div className="col-xl-12">{data?.email}</div>
                                            <div className="col-xl-12">{
                                                data?.is_active
                                                    ? <div className='text-success d-flex align-items-center'>
                                                        <span className="material-icons-outlined mr-1" style={{ fontSize: '16px' }}>verified</span> Verified
                                                    </div> : <div className='text-danger d-flex align-items-center'>
                                                        <span className="material-icons-outlined mr-1" style={{ fontSize: '16px' }}>error</span> Not Yet Verified
                                                    </div>
                                            }</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />


                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Home Address:</div>
                                            <div className="col-xl-12">{data?.address || '--'}</div>
                                        </div>
                                        <Divider sx={{ opacity: '0.3' }} />

                                        <div className="row py-2 px-4">
                                            <div className="col-xl-12 text-bold">Contact #:</div>
                                            <div className="col-xl-12">{data?.contact_number || '--'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            data?.role === "ALUMNI"
                                ? <>
                                    <div className="card shadow-sm border border-light">
                                        <div className="card-header pl-4 text-sm border border-light">
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <div>Languages</div>
                                            </div>
                                        </div>

                                        <div className="card-body p-0 text--fontPos13--xW8hS">
                                            {
                                                data?.languages.length <= 0
                                                    ? <div className='p-4 text-center text-muted'>
                                                        No languages added.
                                                    </div> : <div className="row">
                                                        <div className="col-xl-12">
                                                            {
                                                                data?.languages.map((language, index) => (
                                                                    <div key={index}>
                                                                        <div className="row py-2 px-4">
                                                                            <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                                {language.language}
                                                                            </div>
                                                                        </div>
                                                                        {(index < data?.languages.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
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
                                            </div>
                                        </div>

                                        <div className="card-body p-0 text--fontPos13--xW8hS">
                                            {
                                                data?.certifications.length <= 0
                                                    ? <div className='p-4 text-center text-muted'>
                                                        No certifications or licenses added.
                                                    </div> : <div className="row">
                                                        <div className="col-xl-12">
                                                            {
                                                                data?.certifications.map((certificate, index) => (
                                                                    <div key={index}>
                                                                        <div className="row py-2 px-4">
                                                                            <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                                <div>
                                                                                    <div className='text-bold'>{certificate.certificate}</div>
                                                                                    <div>{certificate.certificate_description}</div>
                                                                                    <div className='text-muted'>Expiry Date: {formatDateToReadable(certificate.expiry_date)}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {(index < data?.certifications.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
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
                                            </div>
                                        </div>

                                        <div className="card-body p-0 text--fontPos13--xW8hS">
                                            {
                                                data?.skills.length <= 0
                                                    ? <div className='p-4 text-center text-muted'>
                                                        No skills added.
                                                    </div> : <div className="row">
                                                        <div className="col-xl-12">
                                                            {
                                                                data?.skills.map((skill, index) => (
                                                                    <div key={index}>
                                                                        <div className="row py-2 px-4">
                                                                            <div className="col-xl-12 d-flex align-items-center justify-content-between">
                                                                                <div>
                                                                                    <div>{skill.skill}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {(index < data?.skills.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
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
                                            </div>
                                        </div>

                                        <div className="card-body p-0 text--fontPos13--xW8hS">
                                            {
                                                !data?.educational_profile
                                                    ? <div className='p-4 text-center text-muted'>
                                                        No education added.
                                                    </div> : <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 text-bold">Course:</div>
                                                                <div className="col-xl-12">{data?.educational_profile.course}</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 text-bold">Course Highlights:</div>
                                                                <div className="col-xl-12">{data?.educational_profile.course_highlights ?? '--'}</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 text-bold">Year Graduated:</div>
                                                                <div className="col-xl-12">{data?.educational_profile.year_graduated}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }

                                        </div>
                                    </div>

                                    <div className="card mb-0 shadow-sm border border-light">
                                        <div className="card-header pl-4 text-sm border border-light">
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <div>Personal Scale Meter</div>
                                            </div>
                                        </div>

                                        <div className="card-body p-0 text--fontPos13--xW8hS">
                                            {
                                                !data?.scale_profile
                                                    ? <div className='p-4 text-center text-muted'>
                                                        Update your personal assessment scale to make it easier for you to find jobs.
                                                    </div> : <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">General Appearance:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.general_appearance} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Manner of Speaking:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.manner_of_speaking} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Mental Alertness:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.mental_alertness} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Physical Condition:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.physical_condition} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Self-Confidence:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.self_confidence} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Presentation of Ideas:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.ability_to_present_ideas} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Communication Skills:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.communication_skills} / 5</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-5 text-bold">Performance Rating:</div>
                                                                <div className="col-xl-7">{data?.scale_profile.student_performance_rating} / 5</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="card shadow-sm border border-light">
                                        <div className="card-header pl-4 text-sm border border-light">
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <div>Business Details</div>
                                            </div>
                                        </div>

                                        <div className="card-body p-0 text--fontPos13--xW8hS">
                                            {
                                                !data?.business_details
                                                    ? <div className='p-4 text-center text-muted'>
                                                        Update your business details to make it easier for job seekers to find and acquire on you.
                                                    </div> : <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 text-bold">Business Name:</div>
                                                                <div className="col-xl-12">{data?.business_details.business_name}</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 text-bold">Business Type:</div>
                                                                <div className="col-xl-12">{data?.business_details.business_type}</div>
                                                            </div>
                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-2 px-4">
                                                                <div className="col-xl-12 text-bold">Country:</div>
                                                                <div className="col-xl-12">{data?.business_details.country}</div>
                                                            </div>

                                                            <Divider sx={{ opacity: '0.3' }} />

                                                            <div className="row py-3 px-4">
                                                                <div className="col-xl-12 mb-3 text-muted text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: '800' }}>
                                                                    Supporting Documents
                                                                </div>

                                                                <DocumentItem
                                                                    data={data?.business_details}
                                                                    label="Business Permit"
                                                                    fileUrl={data?.business_details.business_permit}
                                                                    status={data?.business_details.business_permit_status}
                                                                    remarks={data?.business_details.business_permit_remarks}
                                                                    icon="fas fa-file-contract"
                                                                    index={0}
                                                                />

                                                                <DocumentItem
                                                                    data={data?.business_details}
                                                                    label="BIR Form 2303"
                                                                    fileUrl={data?.business_details.bir_2303}
                                                                    status={data?.business_details.bir_2303_status}
                                                                    remarks={data?.business_details.bir_2303_remarks}
                                                                    icon="fas fa-file-invoice-dollar"
                                                                    index={1}
                                                                />

                                                                <DocumentItem
                                                                    data={data?.business_details}
                                                                    label="SEC / DTI Registration"
                                                                    fileUrl={data?.business_details.sec_dti_reg}
                                                                    status={data?.business_details.sec_dti_reg_status}
                                                                    remarks={data?.business_details.sec_dti_reg_remarks}
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
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>
                    </>
                }
            />
        </>
    )
}

export default ViewUser
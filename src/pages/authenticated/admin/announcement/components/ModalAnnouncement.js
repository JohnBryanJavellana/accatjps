/* global $ */
import { useNavigate } from 'react-router-dom';
import useDateFormat from '../../../../../hooks/useDateFormat';
import useGetToken from '../../../../../hooks/useGetToken';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';

const ModalAnnouncement = ({ id, data, modalTitle, callbackFunction, canMessage = false }) => {
    const { formatDateToReadable } = useDateFormat();
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url, urlWithoutToken } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [messages, setAnnouncementMessages] = useState([]);

    const [comment, setComment] = useState('');

    useEffect(() => {
        canMessage === true
            ? GetAnnouncementMessages(true)
            : setIsFetching(false);
        return () => { };
    }, [data, canMessage]);

    const GetAnnouncementMessages = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const formData = new FormData();
            formData.append('post_id', data?.id);

            const response = await axios.post(`${url}/authenticated/job-seeker/announcement/get-announcements`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setAnnouncementMessages(response.data.messages);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const SaveMessage = async () => {
        try {
            const atoken = getToken('access_token');
            const formData = new FormData();

            formData.append('message', comment);
            formData.append('documentId', data?.id);

            await axios.post(`${url}/authenticated/job-seeker/announcement/submit-comment`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setComment('');
            GetAnnouncementMessages(false);
        }
    }

    const handleClose = () => {
        callbackFunction(false);
        $(`#announcement_info_${id}`).modal('hide');
    }

    const bodyContent = (
        <div className="flex-grow-1 p-4" style={{ backgroundColor: '#fff' }}>
            <div className="position-relative mb-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)', borderRadius: '15px', color: '#fff' }}>
                        <i className="fas fa-bullhorn"></i>
                    </div>
                    <div className="ml-3">
                        <h6 className="mb-0 fw-bold text-dark text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                            {canMessage ? "News Update" : "Official Announcement"}
                        </h6>
                        <small className="text-muted"><i className="far fa-clock mr-1"></i>{formatDateToReadable(data?.created_at)}</small>
                    </div>
                </div>
                <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '2rem', lineHeight: '1.2' }}>{data?.title}</h2>
                <div className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-line', textAlign: 'justify' }}>
                    {data?.content}
                </div>
            </div>

            <div className="d-flex align-items-center mt-5 pt-3 border-top">
                <div className="bg-light rounded-circle p-2 mr-2">
                    <i className="fas fa-university text-secondary"></i>
                </div>
                <div>
                    <p className="mb-0 fw-bold text-dark small">{`${data?.author.first_name} ${data?.author.middle_name} ${data?.author.last_name} ${data?.author.suffix}`}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>{data?.author.role}</p>
                </div>
            </div>
        </div>
    );

    return (
        <ModalTemplate
            id={`announcement_info_${id}`}
            size={canMessage ? 'xl' : 'lg'}
            header={
                <div className="d-flex align-items-center justify-content-between w-100 pr-4">
                    <span className="modal-title text-sm">
                        <i className={`fas ${canMessage ? 'fa-comments' : 'fa-bullhorn'} text-success mr-2`}></i>
                        <strong>{modalTitle}</strong>
                    </span>
                </div>
            }
            bodyClassName={'p-0'}
            body={
                canMessage ? (
                    isFetching
                        ? <SkeletonLoader onViewMode={'update'} />
                        : <div className="d-flex flex-column flex-lg-row" style={{ height: '75vh', minHeight: '600px' }}>
                            <div className="flex-grow-1 border-right overflow-auto" style={{ flex: '2', backgroundColor: '#fff' }}>
                                {bodyContent}
                            </div>

                            <div className="d-flex flex-column bg-light" style={{ flex: '1', minWidth: '350px', height: '100%' }}>
                                <div className="p-3 bg-white border-bottom fw-bold d-flex justify-content-between align-items-center">
                                    <span><i className="fas fa-comments text-success mr-2"></i>Comments</span>
                                    <span className="badge badge-pill badge-light text-success border">{messages.length}</span>
                                </div>

                                <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
                                    {
                                        messages.length > 0 ? (
                                            messages.map((m, index) => {
                                                const fullName = `${m.user?.first_name} ${m.user?.middle_name || ''} ${m.user?.last_name} ${m.user?.suffix || ''}`;
                                                const course = m.user?.educational_profile?.course_details?.course_name;
                                                const gradYear = m.user?.educational_profile?.year_graduated;

                                                return (
                                                    <div key={index} className="d-flex mb-4 align-items-start">
                                                        <div className="mr-3 position-relative">
                                                            <img
                                                                src={`${urlWithoutToken}${m.user?.profile_picture}`}
                                                                alt={fullName}
                                                                className="rounded-circle shadow-sm border"
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                            />
                                                            <span className="position-absolute" style={{ bottom: '2px', right: '2px', width: '10px', height: '10px', backgroundColor: '#28a745', border: '2px solid #fff', borderRadius: '50%' }}></span>
                                                        </div>

                                                        <div className="flex-grow-1" style={{ maxWidth: 'calc(100% - 55px)' }}>
                                                            <div className="bg-white p-3 shadow-sm border" style={{ borderRadius: '0 15px 15px 15px' }}>
                                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                                    <div className="mr-2">
                                                                        <h6 className="mb-0 fw-bold text-dark d-inline" style={{ fontSize: '13px' }}>{fullName}</h6>
                                                                        <span className="ml-2 badge badge-light text-muted fw-normal" style={{ fontSize: '9px', textTransform: 'uppercase' }}>{m.user?.role}</span>
                                                                    </div>
                                                                    <small className="text-muted flex-shrink-0" style={{ fontSize: '10px' }}>
                                                                        {formatDateToReadable(m.created_at, true)}
                                                                    </small>
                                                                </div>

                                                                {course && (
                                                                    <div className="mb-2 text-success fw-bold" style={{ fontSize: '10px', opacity: 0.8, lineHeight: '1.2' }}>
                                                                        <i className="fas fa-graduation-cap mr-1"></i>
                                                                        {course} • Class of {gradYear}
                                                                    </div>
                                                                )}

                                                                <p className="mb-0 text-secondary" style={{ fontSize: '13.5px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                                                                    {m.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-5 h-100 d-flex flex-column justify-content-center">
                                                <div className="mb-3 text-muted opacity-25">
                                                    <i className="fas fa-comments fa-4x"></i>
                                                </div>
                                                <h6 className="fw-bold text-muted">No comments yet</h6>
                                                <p className="small text-muted px-4">Be the first to share your thoughts with the alumni community!</p>
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="p-3 bg-white border-top mt-auto shadow-sm">
                                    <textarea
                                        className="form-control border-0 bg-light p-2"
                                        rows="2"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        style={{ resize: 'none', borderRadius: '12px', fontSize: '14px' }}
                                    ></textarea>
                                    <button
                                        className="btn btn-success btn-sm btn-block mt-2 py-2 fw-bold"
                                        disabled={!comment || comment.trim() === ''}
                                        onClick={() => SaveMessage()}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Post Comment <i className="fas fa-paper-plane ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                ) : (
                    <div className="container-fluid py-2">
                        <div className="row justify-content-center">
                            <div className="col-11">
                                {bodyContent}
                            </div>
                        </div>
                    </div>
                )
            }
            footer={
                <button type='button' className='btn btn-default elevation-1' onClick={handleClose}>
                    <i className='fas fa-times text-danger mr-2'></i> Close
                </button>
            }
        />
    );
}

export default ModalAnnouncement;
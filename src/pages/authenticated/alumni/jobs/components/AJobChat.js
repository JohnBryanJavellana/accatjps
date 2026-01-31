/* global $ */
import { useEffect, useRef, useState } from 'react';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import useGetToken from '../../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import useGetCurrentUser from '../../../../../hooks/useGetCurrentUser';

const AJobChat = ({ id, data, modalTitle, callbackFunction, fromSenderId, toSenderId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState(true);
    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleClose = () => {
        callbackFunction(false);
        $(`#job_chat_info_${id}`).modal('hide');
    }

    const GetChatMessages = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const formData = new FormData();
            formData.append('job_id', data?.application_id);
            formData.append('main_job_id', data?.id);

            const response = await axios.post(`${url}/authenticated/get-job-chats`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setMessages(response.data.chats);
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
            setIsSubmitting(true);
            const atoken = getToken('access_token');
            const formData = new FormData();

            formData.append('message', message);
            formData.append('job_id', data?.application_id);
            formData.append('from_sender_id', fromSenderId);
            formData.append('to_sender_id', toSenderId);

            await axios.post(`${url}/authenticated/submit-job-chat`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsSubmitting(false);
            setMessage('');
            GetChatMessages(false);
        }
    }

    useEffect(() => {
        if (data && userData) {
            GetChatMessages(true);
            return () => { };
        }
    }, [data, userData]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <>
            <ModalTemplate
                id={`job_chat_info_${id}`}
                size={'lg'}
                header={<span className="modal-title text-sm"><strong>{modalTitle}</strong></span>}
                bodyClassName={'px-4 pb-2 text-sm'}
                body={
                    isFetching || !userData
                        ? <SkeletonLoader onViewMode={'update'} />
                        : <div className="chat-box d-flex flex-column" style={{ height: '400px' }}>
                            <div className="flex-grow-1 overflow-auto p-3 bg-light border rounded mb-2">
                                {messages.map((chat, index) => {
                                    const isMe = chat.from_sender.id === userData.id;
                                    return (
                                        <div key={index} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                            {!isMe && <img src={chat.from_sender.profile_picture} className="img-circle mr-2" style={{ width: '30px', height: '30px' }} alt="avatar" />}
                                            <div className={`p-2 rounded ${isMe ? 'bg-success text-white' : 'bg-white border'}`} style={{ maxWidth: '70%' }}>
                                                <div>{chat.message}</div>
                                                <small className="d-block text-right opacity-75" style={{ fontSize: '0.7rem' }}>
                                                    {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Write a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-success" onClick={() => SaveMessage()} disabled={!message || !fromSenderId || !toSenderId || isSubmitting}>
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                }
                footer={
                    <button type='button' className='btn-sm btn btn-default' onClick={handleClose}>
                        <i className='fas fa-times text-danger mr-2'></i> Close
                    </button>
                }
            />
        </>
    )
}

export default AJobChat;
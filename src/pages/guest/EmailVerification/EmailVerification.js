import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useSystemURLCon from '../../../hooks/useSystemURLCon';

const EmailVerification = () => {
    const { url } = useSystemURLCon();
    const { uid, token } = useParams();
    const [processing, setProcessing] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    const VerifyEmail = async () => {
        try {
            setProcessing(true);

            const response = await axios.get(`${url}/verify-email/${uid}/${token}`);
            setResponseMessage(response.data.message);
        } catch (error) {
            setResponseMessage(error.response.data.message);
        } finally {
            setProcessing(false);
        }
    }

    useEffect(() => {
        VerifyEmail();
    }, [uid, token]);

    return (
        <>
            <div className={`guest-bg`}>
                <div className="container p-0">
                    <div className='row d-flex align-items-center justify-content-center'>
                        <div className='col-xl-5'>
                            <div className="card text-dark fade-up bg-white elevation-0">
                                <div className="card-body px-5 py-4 text-center">
                                    {
                                        processing
                                            ? <>Please wait while we verify & activate your email.</>
                                            : <>
                                                {responseMessage}
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmailVerification;
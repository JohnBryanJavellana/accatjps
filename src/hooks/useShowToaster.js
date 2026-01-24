import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import Error from '../lottie/Error.json';
import Success from '../lottie/Success.json';
import { Link } from 'react-router-dom';

const useShowToaster = () => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastStatus, setToastStatus] = useState("");
    const [toastId, setToastId] = useState('message_toast');

    const Toast = ({ callbackFunction }) => {
        return (
            <>
                {
                    openToast &&
                    <div className={`alert w-100 alert-light text-${toastStatus} text-sm pb-2`}>
                        <div className="row">
                            <div className="col-11">{toastMessage}</div>
                            <div className="col-1 text-right">
                                <Link to="#" onClick={() => setOpenToast(false)}>
                                    <span className="material-icons-outlined text-dark">close</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }

    return { setOpenToast, Toast, setToastMessage, setToastStatus, toastStatus, setToastId };
}

export default useShowToaster;

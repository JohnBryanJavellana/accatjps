import { useState } from 'react';
import './css/loading.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const useShowSubmitLoader = () => {
    const [method, setMethod] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [progress, setProgress] = useState(0);

    const SubmitLoadingAnim = ({ cls, place = 'IN' }) => {
        return <>
            {showLoader && (
                <div className={cls}>
                    {
                        cls === 'loader2'
                            ? <img src="/system-images/am-spinner-1.gif" alt="" height="100" />
                            : <div className='bg-white rounded-lg text-center py-4 px-4' style={{ width: '350px' }}>
                                <div className={`text-bold ${place !== 'IN' && 'small'} mb-3`}>{method}</div>
                                <ProgressBar variant='success' className='rounded-lg bg-light' animated now={progress} />
                            </div>
                    }
                </div>
            )}
        </>
    }

    return { showLoader, setShowLoader, setProgress, SubmitLoadingAnim, setMethod };
}

export default useShowSubmitLoader;
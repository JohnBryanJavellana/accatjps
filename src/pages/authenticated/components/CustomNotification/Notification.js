import { Divider } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import useDateFormat from '../../../../hooks/useDateFormat';
import useGetCurrentUser from '../../../../hooks/useGetCurrentUser';
import useGetToken from '../../../../hooks/useGetToken';
import useShowSubmitLoader from '../../../../hooks/useShowSubmitLoader';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import TablePaginationTemplate from '../TablePaginationTemplate';
import './Notification.css';
import DetectMobileViewport from '../../../../hooks/DetectMobileViewport';

const Notification = ({ limit = null, onMainPage = false, callbackFunction = () => { } }) => {
    const { removeToken, getToken } = useGetToken();
    const navigate = useNavigate();
    const { url, urlWithoutToken } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const { formatDateToReadable } = useDateFormat();
    const { userData } = useGetCurrentUser();
    const isMobileViewport = DetectMobileViewport();
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [page, setPage] = useState(0);
    const [role, setRole] = useState('');
    const { SubmitLoadingAnim, setShowLoader, setProgress, setMethod } = useShowSubmitLoader();

    useEffect(() => {
        if (userData) {
            GetNotifications(true);

            let r = String(userData?.role).toLowerCase();
            setRole(r);
            return () => { };
        }
    }, [userData]);

    const GetNotifications = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.post(`${url}/authenticated/get-notifications`, {
                limit: limit
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            callbackFunction(response.data.notifications.some(e => e.is_read === false));
            setNotifications(response.data.notifications);
            setFilteredNotifications(response.data.notifications);
        } catch (error) {
            return console.log(error);

            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const SetAsRead = async (notificationId, needsUpdate = true, redirectUrl) => {
        try {
            setShowLoader(true);
            setProgress(0);
            setMethod('PLEASE WAIT...');

            if (needsUpdate) {
                const token = getToken('access_token');
                await axios.post(`${url}/authenticated/update-notification`, {
                    notificationId: notificationId
                }, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgress(percent);
                        }
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setShowLoader(false);
            navigate(redirectUrl);
            GetNotifications(false);
        }
    }

    return (
        <>
            <SubmitLoadingAnim cls='loader' />

            {
                !onMainPage &&
                <div className="row pb-2 mb-1">
                    <div className="col-xl-12 text-center text-muted text-bold">
                        NOTIFICATIONS
                    </div>
                </div>
            }

            {
                isFetching && !userData
                    ? <SkeletonLoader className='w-100' onViewMode={'update'} />
                    : <>
                        {
                            notifications.length > 0
                                ? <>
                                    {
                                        filteredNotifications.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((notification, index) => (
                                            <>
                                                <div className="row py-2 notification-container" onClick={() => {
                                                    let designation = "";

                                                    switch (notification.type) {
                                                        case "JOB_POST":
                                                            designation = `/welcome/${String(userData.role).toLowerCase()}/jobs`;
                                                            break;

                                                        case "CHAT":
                                                            designation = userData.role === "ALUMNI" ? `/welcome/alumni/jobs?tab=applied` : `/welcome/employer/jobs/${notification.job}?tab=candidates&modal_id=${notification.redirect_id}`;
                                                            break;

                                                        default:
                                                            designation = "";
                                                            break;
                                                    }

                                                    SetAsRead(notification.id, !notification.is_read, designation);
                                                }} key={index}>
                                                    <div className={`col-${!onMainPage || isMobileViewport ? '3' : '1'} text-center`}>
                                                        <img className='rounded-circle elevation-1' height={50} width={50} src={notification.from_user.profile_picture} alt='' />
                                                    </div>

                                                    <div className={`text-${notification.is_read ? 'muted' : 'dark'} col-${!onMainPage || isMobileViewport ? '9' : '11'}`}>
                                                        <div style={{ lineHeight: '20px' }}>
                                                            <strong>{`${notification.from_user.fname ?? ''} ${notification.from_user.mname ?? ''} ${notification.from_user.lname ?? ''} ${notification.from_user.suffix ?? ''}`}</strong> {notification.message}
                                                        </div>

                                                        <div style={{ lineHeight: '17px' }}>
                                                            <div className='text-muted mt-1'>{formatDateToReadable(notification.created_at, true)}</div>
                                                            <small className='text-muted'><TimeAgo date={notification.created_at} /></small>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(index < notifications.length - 1) && <Divider sx={{ opacity: '0.3' }} />}
                                            </>
                                        ))
                                    }

                                    {
                                        !onMainPage ?
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <Link to={`/welcome/${role}/notifications`} className="btn btn-block mt-2 btn-success elevation-1 btn-sm">
                                                        Show All Notifications
                                                    </Link>
                                                </div>
                                            </div> : <>
                                                <TablePaginationTemplate
                                                    dataset={filteredNotifications}
                                                    rowsPerPage={rowsPerPage}
                                                    rowsPerPageOptions={[20, 50, 100]}
                                                    page={page}
                                                    labelRowsPerPage={"Rows per page:"}
                                                    callbackFunction={(e) => {
                                                        setRowsPerPage(e.rows);
                                                        setPage(e.page);
                                                    }}
                                                />
                                            </>
                                    }
                                </> : <div className='text-center text-muted'>✖️</div>
                        }
                    </>
            }
        </>
    )
}

export default Notification;
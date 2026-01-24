import { useEffect, useState } from 'react';
import useGetCurrentUser from '../../../../hooks/useGetCurrentUser';
import JobsRow from './component/JobsRow';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { useNavigate } from 'react-router-dom';
import TablePaginationTemplate from '../../components/TablePaginationTemplate';
import TabTemplate from '../../components/TabTemplate';

const JobAds = () => {
    const [isFetching, setIsFetching] = useState(true);
    const { userData } = useGetCurrentUser();
    const [tabId, setTabId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            setIsFetching(false);
            return () => { };
        }
    }, [userData]);

    return (
        <>
            {
                !isFetching ? <>
                    <div className="text-right mb-3">
                        <button disabled={!["APPROVED"].includes(userData?.account_status)} onClick={() => {
                            !["APPROVED"].includes(userData?.account_status)
                                ? alert("You can’t post a job right now. Your account is still awaiting approval from the admin.")
                                : navigate("/welcome/employer/jobs/create")
                        }} className="btn btn-success btn-sm elevation-1">
                            <i className="fas fa-plus mr-1"></i> Create Job Post
                        </button>
                    </div>

                    <TabTemplate
                        disabled={!userData}
                        tabId={tabId}
                        tabs={[
                            {
                                icon: "notifications_active",
                                label: "Active",
                                index: 0
                            },
                            {
                                icon: "disabled_visible",
                                label: "Inactive",
                                index: 1
                            },
                            {
                                icon: "edit_note",
                                label: "Drafts",
                                index: 2
                            }
                        ]}
                        callbackFunction={(e) => setTabId(e)}
                    />

                    <div className="card border-0 shadow-0 mt-0 elevation-0 rounded-0 bg-transparent">
                        <div className="card-body px-0">
                            <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                                {tabId === 0 && <JobsRow statusses={'ACTIVE'} userData={userData} />}
                            </div>

                            <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                                {tabId === 1 && <JobsRow statusses={'INACTIVE'} userData={userData} />}
                            </div>

                            <div role="tabpanel" hidden={tabId !== 2} id={`simple-tabpanel-2`} aria-labelledby={`simple-tab-2`}>
                                {tabId === 2 && <JobsRow statusses={'DRAFT'} userData={userData} />}
                            </div>
                        </div>
                    </div>
                </> : <SkeletonLoader />
            }
        </>
    )
}

export default JobAds;
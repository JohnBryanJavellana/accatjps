import React, { useEffect, useState } from 'react'
import TabTemplate from '../../components/TabTemplate';
import AJobPosts from './AJobPosts';
import AppliedJobs from './AppliedJobs';
import AJobSavedPosts from './AJobSavedPosts';
import { useNavigate } from 'react-router-dom';

const AJP = () => {
    const [tabId, setTabId] = useState(0);
    const params = new URLSearchParams(window.location.search);
    const navigate = useNavigate();

    useEffect(() => {
        if (params.has('tab') && params.get('tab') === "applied") {
            setTabId(2);
        }
    }, [params]);

    return (
        <>
            <TabTemplate
                tabId={tabId}
                tabs={[
                    {
                        icon: "feed",
                        label: "Job Posts",
                        index: 0
                    },
                    {
                        icon: "bookmark_border",
                        label: "Saved",
                        index: 1
                    },
                    {
                        icon: "done",
                        label: "Applied",
                        index: 2
                    }
                ]}
                callbackFunction={(e) => {
                    navigate(`/welcome/alumni/jobs`);
                    setTabId(e);
                }}
            />

            <div className="card border-0 shadow-0 mt-0 elevation-0 rounded-0 bg-transparent">
                <div className="card-body px-0">
                    <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                        {tabId === 0 && <AJobPosts />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                        {tabId === 1 && <AJobSavedPosts />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 2} id={`simple-tabpanel-2`} aria-labelledby={`simple-tab-2`}>
                        {tabId === 2 && <AppliedJobs />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AJP;
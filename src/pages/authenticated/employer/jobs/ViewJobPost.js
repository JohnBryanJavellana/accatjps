import { useState } from 'react'
import { useParams } from 'react-router-dom'
import TabTemplate from '../../components/TabTemplate';
import JobDetails from './component/JobDetails';
import Candidates from './component/Candidates';

const ViewJobPost = () => {
    const { jobId } = useParams();
    const [tabId, setTabId] = useState(0);

    return (
        <>
            <TabTemplate
                disabled={!jobId}
                tabId={tabId}
                tabs={[
                    {
                        icon: "info",
                        label: "Job Overview",
                        index: 0
                    },
                    {
                        icon: "groups",
                        label: "Candidates",
                        index: 1
                    }
                ]}
                callbackFunction={(e) => setTabId(e)}
            />

            <div className="card border-0 shadow-0 mt-0 elevation-0 rounded-0 bg-transparent">
                <div className="card-body p-0">
                    <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                        {tabId === 0 && <>
                            <div className="card border-none shadow-sm">
                                <div className="card-body text-sm">
                                    <JobDetails jobId={jobId} />
                                </div>
                            </div>
                        </>}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                        {tabId === 1 && <>
                            <div className="card border-none shadow-none">
                                <div className="card-body text-sm px-0">
                                    <Candidates jobId={jobId} />
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewJobPost
import React, { useState } from 'react'
import TabTemplate from '../../components/TabTemplate';
import Courses from './components/Courses/Courses';

const SystemSettings = () => {
    const [tabId, setTabId] = useState(0);

    return (
        <>
            <TabTemplate
                tabId={tabId}
                tabs={[
                    {
                        icon: "school",
                        label: "Courses",
                        index: 0
                    }
                ]}
                callbackFunction={(e) => setTabId(e)}
            />

            <div className="card border-0 shadow-0 mt-0 elevation-0 rounded-0 bg-white">
                <div className="card-body px-0 pt-0">
                    <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                        {tabId === 0 && <Courses />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SystemSettings;
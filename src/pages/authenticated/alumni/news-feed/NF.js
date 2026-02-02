import React, { useEffect, useState } from 'react'
import TabTemplate from '../../components/TabTemplate';
import NewsFeed from './NewsFeed';

const NF = () => {
    const [tabId, setTabId] = useState(0);

    return (
        <>
            <TabTemplate
                tabId={tabId}
                tabs={[
                    {
                        icon: "feed",
                        label: "News Feed",
                        index: 0
                    },
                    {
                        icon: "person",
                        label: "My News Feed",
                        index: 1
                    }
                ]}
                callbackFunction={(e) => {
                    setTabId(e);
                }}
            />

            <div className="card border-0 shadow-0 mt-0 elevation-0 rounded-0 bg-transparent">
                <div className="card-body px-0">
                    <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                        {tabId === 0 && <NewsFeed />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                        {tabId === 1 && <NewsFeed isMine />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NF;
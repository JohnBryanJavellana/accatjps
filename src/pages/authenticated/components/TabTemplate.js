import { Tab, Tabs } from '@mui/material';

const TabTemplate = ({ tabs, tabId, callbackFunction, centered = false, variant = "scrollable", disabled = false }) => {
    const handleChange = (_, newValue) => {
        callbackFunction(newValue);
    }

    const tabLabel = (icon, label, index) => {
        return (
            <div className={`d-flex align-items-center ${tabId === index && 'text-bold'}`}>
                <span className='material-icons-outlined mr-2' style={{ fontSize: "18px" }}>{icon}</span>
                {/* <div className='d-flex align-items-center' style={{ paddingTop: '2px' }} dangerouslySetInnerHTML={{ __html: label  }} /> */}
                {label}
            </div>
        );
    }

    const tabProps = (index) => {
        return {
            'id': `simple-tab-${index}`,
            'style': {
                backgroundColor: tabId === index ? 'rgb(225.6, 250.05, 233.7)' : 'white',
                border: '1px solid rgb(240, 240, 240)',
                borderBottom: 'none'
            },
            'className': `rounded-top`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    }

    return (
        <Tabs
            selectionFollowsFocus
            className='border-bottom'
            centered={centered}
            value={tabId}
            onChange={!disabled && handleChange}
            aria-label="ROOM VIEW TABS"
            variant={variant}
            scrollButtons="auto"
            slotProps={{
                indicator: {
                    style: {
                        backgroundColor: 'rgb(46, 160, 46)'
                    }
                }
            }}
            sx={{
                '& .MuiTabs-flexContainer': {
                    gap: theme => theme.spacing(0.7)
                },
                '& .Mui-selected': {
                    color: 'green !important',
                }
            }}
        >
            {
                tabs.map((tab, index) => (
                    <Tab key={index} label={tabLabel(tab.icon, tab.label, tab.index)} {...tabProps(tab.index)} value={tab.index} />
                ))
            }
        </Tabs>
    );
}

export default TabTemplate;
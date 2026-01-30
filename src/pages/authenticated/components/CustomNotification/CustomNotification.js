import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Badge, IconButton } from '@mui/material';
import Notification from './Notification';

const CustomNotification = ({ limit }) => {
    const [hasUnread, setHasUnread] = useState(false);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': { right: -3 }
    }));

    return (
        <>
            <div className="dropdown">
                <IconButton color="inherit" data-toggle="dropdown" href="#" aria-expanded="true">
                    <StyledBadge invisible={!hasUnread} variant='dot' color="error">
                        {hasUnread ? <NotificationsActiveIcon fontSize="small" /> : <NotificationsNoneIcon fontSize="small" />}
                    </StyledBadge>
                </IconButton>

                <div className="dropdown-menu dropdown-menu-xl dropdown-menu-right" style={{ left: 'inherit', right: '0px' }}>
                    <div className="p-3 text-sm">
                        <Notification limit={limit} callbackFunction={(e) => setHasUnread(e)} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomNotification;
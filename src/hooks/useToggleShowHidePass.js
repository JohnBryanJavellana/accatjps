import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const useToggleShowHidePass = () => {
    const [visible, setVisible] = useState(false);
    const toggle = () => setVisible((prev) => !prev);
    const inputType = visible ? "text" : "password";

    const EndAdornment = () => {
        return (
            <>
                <InputAdornment position="end">
                    <IconButton aria-label={ visible ? 'hide the password' : 'display the password' } onClick={toggle} edge="end">
                        {visible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            </>
        );
    }

    return { EndAdornment, visible, inputType };
}

export default useToggleShowHidePass;
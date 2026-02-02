import { useMediaQuery } from '@mui/material';
import React from 'react'

const DetectMobileViewport = () => {
    const isPointerCoarse = useMediaQuery('(pointer: coarse)');
    const isMobile = useMediaQuery('(max-width: 768px)');

    return isPointerCoarse || isMobile;
}

export default DetectMobileViewport;